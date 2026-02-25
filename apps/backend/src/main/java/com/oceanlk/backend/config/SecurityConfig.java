package com.oceanlk.backend.config;

import com.oceanlk.backend.filter.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthFilter;
        private final com.oceanlk.backend.filter.RateLimitFilter rateLimitFilter;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(csrf -> csrf.disable())
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .authorizeHttpRequests(auth -> auth
                                                // Public endpoints
                                                .requestMatchers("/api/contact").permitAll()
                                                .requestMatchers("/api/chat/**").permitAll()
                                                .requestMatchers("/api/search").permitAll()
                                                .requestMatchers("/api/admin/login").permitAll()
                                                .requestMatchers("/api/metrics").permitAll()
                                                // Actuator — health+info public (Docker probe), rest requires
                                                // SUPER_ADMIN
                                                // NOTE: In prod, actuator is bound to 127.0.0.1:8081 via
                                                // management.server.*
                                                // This rule is defence-in-depth if port is ever accidentally exposed.
                                                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                                                .requestMatchers("/actuator/**").hasRole("SUPER_ADMIN")
                                                .requestMatchers("/api/admin/validate").permitAll()
                                                .requestMatchers("/api/admin/otp/**").permitAll()
                                                .requestMatchers("/api/admin/forgot-password").permitAll()
                                                .requestMatchers("/api/admin/reset-password").permitAll()
                                                .requestMatchers("/api/talent-pool/submit").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/jobs").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/media/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/companies/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/events/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/partners/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/testimonials/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/leadership/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/leadership-categories/**")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/content/**").permitAll()
                                                .requestMatchers("/api/public/whatsapp").permitAll()
                                                .requestMatchers("/uploads/**").permitAll() // Allow public access to
                                                                                            // uploaded files (legacy)
                                                .requestMatchers(HttpMethod.GET, "/api/files/**").permitAll() // Allow
                                                                                                              // public
                                                                                                              // access
                                                                                                              // to
                                                                                                              // GridFS
                                                                                                              // files
                                                .requestMatchers("/api/test/**").hasRole("ADMIN") // Protect email
                                                                                                  // testing
                                                .requestMatchers("/api/talent-pool/cv/**")
                                                .hasAnyRole("ADMIN", "SUPER_ADMIN") // Protect
                                                // CV
                                                // download

                                                // Debug controller — belt-and-suspenders (also @Profile("!prod") in the
                                                // class)
                                                .requestMatchers("/api/debug/**").hasRole("SUPER_ADMIN")

                                                // Admin endpoints
                                                .requestMatchers("/api/admin/audit-logs/**").hasRole("SUPER_ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/admin/whatsapp")
                                                .hasRole("SUPER_ADMIN")
                                                .requestMatchers("/api/admin/management/list")
                                                .hasAnyRole("ADMIN", "SUPER_ADMIN")
                                                .requestMatchers("/api/admin/management/add")
                                                .hasAnyRole("ADMIN", "SUPER_ADMIN")
                                                .requestMatchers("/api/admin/management/delete/**")
                                                .hasAnyRole("ADMIN", "SUPER_ADMIN")
                                                .requestMatchers("/api/admin/management/edit/**")
                                                .hasAnyRole("ADMIN", "SUPER_ADMIN")
                                                .requestMatchers("/api/admin/management/**")
                                                .hasAnyRole("ADMIN", "SUPER_ADMIN")
                                                .requestMatchers("/api/admin/**").hasAnyRole("ADMIN", "SUPER_ADMIN")
                                                .requestMatchers(HttpMethod.POST, "/api/jobs")
                                                .hasAnyRole("ADMIN", "SUPER_ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/jobs/**")
                                                .hasAnyRole("ADMIN", "SUPER_ADMIN")
                                                .requestMatchers(HttpMethod.DELETE, "/api/jobs/**")
                                                .hasAnyRole("ADMIN", "SUPER_ADMIN")
                                                .requestMatchers(HttpMethod.POST, "/api/media")
                                                .hasAnyRole("ADMIN", "SUPER_ADMIN")
                                                .requestMatchers(HttpMethod.PUT, "/api/media/**")
                                                .hasAnyRole("ADMIN", "SUPER_ADMIN")
                                                .requestMatchers(HttpMethod.DELETE, "/api/media/**")
                                                .hasAnyRole("ADMIN", "SUPER_ADMIN")
                                                .requestMatchers(HttpMethod.PATCH, "/api/talent-pool/application/**")
                                                .hasAnyRole("ADMIN", "SUPER_ADMIN")
                                                .requestMatchers(HttpMethod.DELETE, "/api/talent-pool/application/**")
                                                .hasAnyRole("ADMIN", "SUPER_ADMIN")
                                                .requestMatchers("/api/talent-pool/applications")
                                                .hasAnyRole("ADMIN", "SUPER_ADMIN")

                                                // Default deny for non-explicitly permitted routes
                                                .anyRequest().authenticated())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                // Security Headers
                                .headers(headers -> headers
                                                // Report-Only CSP (promote to enforcing after staging soak)
                                                // To enforce: rename to contentSecurityPolicy() and remove the custom
                                                // header writer
                                                .addHeaderWriter((request, response) -> {
                                                        String csp = "default-src 'self'; " +
                                                                        "script-src 'self'; " +
                                                                        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
                                                                        +
                                                                        "font-src 'self' https://fonts.gstatic.com; " +
                                                                        "img-src 'self' data: blob: https:; " +
                                                                        "connect-src 'self' " +
                                                                        "https://ocean.lk https://www.ocean.lk " +
                                                                        "https://generativelanguage.googleapis.com " +
                                                                        "https://maps.googleapis.com " +
                                                                        "https://www.googleapis.com; " +
                                                                        "media-src 'self' blob: https://www.youtube.com https://www.youtube-nocookie.com; "
                                                                        +
                                                                        "frame-src https://www.youtube-nocookie.com https://www.google.com; "
                                                                        +
                                                                        "worker-src 'self' blob:; " +
                                                                        "base-uri 'self'; " +
                                                                        "form-action 'self'; " +
                                                                        "frame-ancestors 'none'; " +
                                                                        "upgrade-insecure-requests;";
                                                        // STAGING: Report-Only — change to Content-Security-Policy once
                                                        // violations are clear
                                                        response.setHeader("Content-Security-Policy-Report-Only", csp);
                                                })
                                                .frameOptions(frame -> frame.deny())
                                                .httpStrictTransportSecurity(hsts -> hsts
                                                                .maxAgeInSeconds(31536000)
                                                                .includeSubDomains(true)
                                                                .preload(true)))
                                .addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class)
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                // Get allowed origins from environment variable
                String allowedOriginsEnv = System.getenv("CORS_ALLOWED_ORIGINS");
                if (allowedOriginsEnv != null && !allowedOriginsEnv.isEmpty()) {
                        configuration.setAllowedOrigins(Arrays.asList(allowedOriginsEnv.split(",")));
                } else {
                        // Default for development (safe fallbacks)
                        configuration.setAllowedOrigins(
                                        Arrays.asList("http://localhost:5173", "http://localhost:4173",
                                                        "https://ocean.lk", "https://www.ocean.lk",
                                                        "https://test.ocean.lk"));
                }

                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With",
                                "Accept",
                                "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"));
                configuration
                                .setExposedHeaders(Arrays.asList("Access-Control-Allow-Origin",
                                                "Access-Control-Allow-Credentials"));
                configuration.setAllowCredentials(true);
                configuration.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }
}
