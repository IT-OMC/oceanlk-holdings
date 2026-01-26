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
    private final com.oceanlk.backend.service.AuditLogService auditLogService;
    private final com.oceanlk.backend.service.AdminUserService adminUserService;
    private final com.oceanlk.backend.service.OtpService otpService;
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

            // Log Action
            auditLogService.logAction(admin.getUsername(), "LOGIN", "AdminUser", admin.getId(),
                    "Admin logged in successfully");

            LoginResponse response = new LoginResponse(token, admin.getName(), admin.getUsername(), admin.getRole(),
                    admin.isVerified());
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
            response.put("name", admin.getName());
            response.put("username", admin.getUsername());
            response.put("role", admin.getRole());
            response.put("verified", admin.isVerified());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Token validation failed"));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        return adminUserRepository.findByEmail(email)
                .map(user -> {
                    // In a real app, you might want to send a specific reset token or OTP
                    // For now, we'll use the existing OtpService logic
                    // This is handled by OtpController /api/admin/otp/send usually,
                    // but we can add logic here if preferred.
                    return ResponseEntity
                            .ok(Map.of("message", "If an account exists with this email, you will receive an OTP."));
                })
                .orElse(ResponseEntity
                        .ok(Map.of("message", "If an account exists with this email, you will receive an OTP.")));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        return adminUserRepository.findByEmail(email)
                .map(user -> {
                    if (otpService.verifyOtp(user, otp)) {
                        adminUserService.changePassword(user, newPassword);
                        auditLogService.logAction(user.getUsername(), "RESET_PASSWORD", "AdminUser", user.getId(),
                                "Password reset via OTP");
                        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
                    } else {
                        return ResponseEntity.status(400).body(Map.of("error", "Invalid or expired OTP"));
                    }
                })
                .orElse(ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }

    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
