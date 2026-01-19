package com.oceanlk.backend.filter;

import com.oceanlk.backend.repository.AdminUserRepository;
import com.oceanlk.backend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final AdminUserRepository adminUserRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                // Token invalid or expired
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            String finalUsername = username;

            // Check if user exists in DB
            // Check if user exists in DB
            var adminUserOpt = adminUserRepository.findByUsername(username);
            if (adminUserOpt.isPresent() && jwtUtil.validateToken(jwt, username)) {
                var adminUser = adminUserOpt.get();

                // Create user details with proper roles
                // Ideally, role comes from DB. Assuming simplified role management or "ROLE_"
                // prefix needed by Spring Security.
                // adminUser.getRole() returns "ADMIN" probably?
                // SecurityConfig checks hasRole("ADMIN"), so we need authority "ROLE_ADMIN".

                String role = adminUser.getRole();
                if (role == null)
                    role = "ADMIN";
                if (!role.startsWith("ROLE_"))
                    role = "ROLE_" + role;

                UserDetails userDetails = new User(finalUsername, "",
                        Collections.singletonList(
                                new org.springframework.security.core.authority.SimpleGrantedAuthority(role)));

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
