package com.oceanlk.backend.filter;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import io.github.bucket4j.redis.lettuce.cas.LettuceBasedProxyManager;
import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.codec.ByteArrayCodec;
import jakarta.annotation.PreDestroy;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.function.Supplier;

/**
 * Distributed rate limiter backed by Redis using the Bucket4j token-bucket
 * algorithm.
 * Works correctly across multiple Docker replicas because state is stored in
 * Redis, not in the JVM heap.
 *
 * <p>
 * Falls back to a local in-memory rate limiter when Redis is unavailable
 * (e.g. local development without a Redis instance).
 * </p>
 *
 * Applied only to sensitive auth endpoints (login, OTP, password reset).
 */
@Component
@Slf4j
public class RateLimitFilter extends OncePerRequestFilter {

    /** Non-null only when Redis is available. */
    private final ProxyManager<byte[]> proxyManager;

    /**
     * The Lettuce client and connection are kept as fields purely so they can be
     * released again in {@link #shutdownRedisResources()}.
     *
     * <p>
     * They used to be constructor-local variables, which leaked in BOTH paths:
     * </p>
     * <ul>
     * <li><b>Redis down:</b> {@code RedisClient.create(...)} already allocates a
     * {@code DefaultClientResources} (Netty event loop groups + thread pools)
     * before {@code connect()} is ever attempted. When {@code connect()} then
     * threw, the catch block swallowed the exception and dropped the client on
     * the floor without calling {@code shutdown()}. A few seconds later the GC
     * ran and Lettuce logged
     * "DefaultClientResources was not shut down properly".</li>
     * <li><b>Redis up:</b> nothing held a reference to the client or the
     * connection, so they were never closed on application shutdown either --
     * the same leak, just deferred until redeploy.</li>
     * </ul>
     */
    private final RedisClient redisClient;
    private final StatefulRedisConnection<byte[], byte[]> redisConnection;

    /** Fallback in-memory buckets used when Redis is unavailable. */
    private final ConcurrentHashMap<String, Bucket> localBuckets = new ConcurrentHashMap<>();

    @Value("${app.rate-limit.max-requests:20}")
    private int maxRequests;

    @Value("${app.rate-limit.window-ms:60000}")
    private long windowMs;

    public RateLimitFilter(
            @Value("${spring.data.redis.host:localhost}") String redisHost,
            @Value("${spring.data.redis.port:6379}") int redisPort,
            @Value("${spring.data.redis.password:}") String redisPassword) {

        ProxyManager<byte[]> pm = null;
        RedisClient client = null;
        StatefulRedisConnection<byte[], byte[]> connection = null;

        try {
            RedisURI.Builder uriBuilder = RedisURI.builder()
                    .withHost(redisHost)
                    .withPort(redisPort)
                    .withTimeout(Duration.ofSeconds(2));

            if (redisPassword != null && !redisPassword.isBlank()) {
                uriBuilder.withPassword(redisPassword.toCharArray());
            }

            client = RedisClient.create(uriBuilder.build());
            connection = client.connect(ByteArrayCodec.INSTANCE);
            pm = LettuceBasedProxyManager.builderFor(connection).build();
            log.info("RateLimitFilter: using Redis backend at {}:{}", redisHost, redisPort);
        } catch (Exception e) {
            log.warn("RateLimitFilter: Redis unavailable ({}). Falling back to in-memory rate limiting. " +
                    "This is fine for local development but should not happen in production.", e.getMessage());
            // Release the Netty event loops / thread pools the failed client already
            // allocated, instead of leaving them for the GC to complain about.
            releaseRedisResources(connection, client);
            connection = null;
            client = null;
            pm = null;
        }

        this.redisClient = client;
        this.redisConnection = connection;
        this.proxyManager = pm;
    }

    /**
     * Closes the Lettuce connection and shuts the client down when the Spring
     * context is destroyed, so repeated restarts/redeploys don't accumulate
     * event-loop threads and file descriptors.
     */
    @PreDestroy
    void shutdownRedisResources() {
        if (redisClient != null) {
            log.info("RateLimitFilter: shutting down Lettuce Redis client");
        }
        releaseRedisResources(redisConnection, redisClient);
    }

    private static void releaseRedisResources(StatefulRedisConnection<byte[], byte[]> connection, RedisClient client) {
        if (connection != null) {
            try {
                connection.close();
            } catch (Exception ex) {
                log.debug("RateLimitFilter: error closing Redis connection", ex);
            }
        }
        if (client != null) {
            try {
                // Quiet period 0 so startup/shutdown isn't delayed by the default 2s.
                client.shutdown(0, 2, TimeUnit.SECONDS);
            } catch (Exception ex) {
                log.debug("RateLimitFilter: error shutting down Lettuce client", ex);
            }
        }
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        if (!isSensitivePath(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = getClientIp(request);
        String bucketKey = "rl:" + clientIp + ":" + path;

        boolean allowed;
        if (proxyManager != null) {
            // Distributed Redis-backed rate limiting
            long windowSeconds = windowMs / 1000;
            Supplier<BucketConfiguration> configSupplier = () -> BucketConfiguration.builder()
                    .addLimit(Bandwidth.builder()
                            .capacity(maxRequests)
                            .refillGreedy(maxRequests, Duration.ofSeconds(windowSeconds))
                            .build())
                    .build();
            var bucket = proxyManager.builder().build(bucketKey.getBytes(), configSupplier);
            allowed = bucket.tryConsume(1);
        } else {
            // Local in-memory fallback
            long windowSeconds = windowMs / 1000;
            Bucket bucket = localBuckets.computeIfAbsent(bucketKey, k -> Bucket.builder()
                    .addLimit(Bandwidth.builder()
                            .capacity(maxRequests)
                            .refillGreedy(maxRequests, Duration.ofSeconds(windowSeconds))
                            .build())
                    .build());
            allowed = bucket.tryConsume(1);
        }

        if (allowed) {
            filterChain.doFilter(request, response);
        } else {
            log.warn("Rate limit exceeded for IP: {} on path: {}", clientIp, path);
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Too many requests. Please try again later.\"}");
        }
    }

    private boolean isSensitivePath(String path) {
        return path.contains("/api/admin/login")
                || path.contains("/api/admin/otp")
                || path.contains("/api/admin/forgot-password")
                || path.contains("/api/admin/reset-password");
    }

    /**
     * Extracts the real client IP, taking the first entry from X-Forwarded-For
     * to prevent IP spoofing via a crafted header.
     */
    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isBlank()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }
}
