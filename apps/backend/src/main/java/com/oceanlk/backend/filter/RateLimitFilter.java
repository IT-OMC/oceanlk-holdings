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
        try {
            RedisURI.Builder uriBuilder = RedisURI.builder()
                    .withHost(redisHost)
                    .withPort(redisPort)
                    .withTimeout(Duration.ofSeconds(2));

            if (redisPassword != null && !redisPassword.isBlank()) {
                uriBuilder.withPassword(redisPassword.toCharArray());
            }

            RedisClient redisClient = RedisClient.create(uriBuilder.build());
            StatefulRedisConnection<byte[], byte[]> connection = redisClient.connect(ByteArrayCodec.INSTANCE);
            pm = LettuceBasedProxyManager.builderFor(connection).build();
            log.info("RateLimitFilter: using Redis backend at {}:{}", redisHost, redisPort);
        } catch (Exception e) {
            log.warn("RateLimitFilter: Redis unavailable ({}). Falling back to in-memory rate limiting. " +
                    "This is fine for local development but should not happen in production.", e.getMessage());
        }

        this.proxyManager = pm;
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
