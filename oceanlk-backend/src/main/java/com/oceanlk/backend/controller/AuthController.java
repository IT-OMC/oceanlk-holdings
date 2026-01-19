package com.oceanlk.backend.controller;

import com.oceanlk.backend.dto.LoginRequest;
import com.oceanlk.backend.dto.LoginResponse;
import com.oceanlk.backend.model.AdminUser;
import com.oceanlk.backend.repository.AdminUserRepository;
import com.oceanlk.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:4173" })
public class AuthController {

    private final AdminUserRepository adminUserRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            AdminUser admin = adminUserRepository.findByUsername(loginRequest.getUsername())
                    .orElse(null);

            if (admin == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Invalid username or password"));
            }

            if (!passwordEncoder.matches(loginRequest.getPassword(), admin.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Invalid username or password"));
            }

            if (!admin.isActive()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(createErrorResponse("Account is inactive"));
            }

            // Update last login
            admin.setLastLoginDate(LocalDateTime.now());
            adminUserRepository.save(admin);

            // Generate JWT token
            String token = jwtUtil.generateToken(admin.getUsername());

            LoginResponse response = new LoginResponse(token, admin.getUsername(), admin.getRole());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("An error occurred during login"));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Invalid token format"));
            }

            String token = authHeader.substring(7);
            String username = jwtUtil.extractUsername(token);

            AdminUser admin = adminUserRepository.findByUsername(username).orElse(null);
            if (admin == null || !jwtUtil.validateToken(token, username)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Invalid or expired token"));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("valid", true);
            response.put("username", admin.getUsername());
            response.put("role", admin.getRole());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Token validation failed"));
        }
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
