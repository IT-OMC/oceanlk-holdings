package com.oceanlk.backend.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * A simple memory-based rate limiter to protect sensitive endpoints
 * like login and OTP from brute force attacks.
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, RequestInfo> requestCounts = new ConcurrentHashMap<>();

    // Limits: 5 requests per minute per IP for sensitive routes
    private static final int MAX_REQUESTS = 10;
    private static final long WINDOW_MS = TimeUnit.MINUTES.toMillis(1);

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Only rate limit sensitive endpoints
        if (isSensitivePath(path)) {
            String clientIp = getClientIp(request);
            String key = clientIp + ":" + path;

            long currentTime = System.currentTimeMillis();
            RequestInfo info = requestCounts.compute(key, (k, v) -> {
                if (v == null || (currentTime - v.startTime > WINDOW_MS)) {
                    return new RequestInfo(currentTime, 1);
                } else {
                    v.count++;
                    return v;
                }
            });

            if (info.count > MAX_REQUESTS) {
                response.setStatus(429); // Too Many Requests
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Too many requests. Please try again later.\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isSensitivePath(String path) {
        return path.contains("/api/admin/login") ||
                path.contains("/api/admin/otp") ||
                path.contains("/api/admin/forgot-password") ||
                path.contains("/api/admin/reset-password");
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    private static class RequestInfo {
        long startTime;
        int count;

        RequestInfo(long startTime, int count) {
            this.startTime = startTime;
            this.count = count;
        }
    }
}
