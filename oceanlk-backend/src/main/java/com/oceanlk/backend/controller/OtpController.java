package com.oceanlk.backend.controller;

import com.oceanlk.backend.service.AdminUserService;
import com.oceanlk.backend.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/otp")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:4173" })
public class OtpController {

    private final OtpService otpService;
    private final AdminUserService adminUserService;

    @PostMapping("/send")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String method = request.getOrDefault("method", "email"); // email or phone

        return adminUserService.findByUsername(username)
                .map(user -> {
                    otpService.sendOtp(user, method);
                    return ResponseEntity.ok(Map.of("message", "OTP sent successfully to your " + method));
                })
                .orElse(ResponseEntity.status(404).body(Map.of("error", "Admin user not found")));
    }

    @PostMapping("/send-by-email")
    public ResponseEntity<?> sendOtpByEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String method = request.getOrDefault("method", "email");

        return adminUserService.findByEmail(email)
                .map(user -> {
                    otpService.sendOtp(user, method);
                    return ResponseEntity.ok(Map.of("message", "OTP sent successfully to your email"));
                })
                .orElse(ResponseEntity
                        .ok(Map.of("message", "If an account exists with this email, you will receive an OTP.")));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String otp = request.get("otp");

        return adminUserService.findByUsername(username)
                .map(user -> {
                    if (otpService.verifyOtp(user, otp)) {
                        user.setVerified(true);
                        adminUserService.updateAdmin(user);
                        return ResponseEntity.ok(Map.of("message", "OTP verified successfully", "verified", true));
                    } else {
                        return ResponseEntity.status(400).body(Map.of("error", "Invalid or expired OTP"));
                    }
                })
                .orElse(ResponseEntity.status(404).body(Map.of("error", "Admin user not found")));
    }
}
