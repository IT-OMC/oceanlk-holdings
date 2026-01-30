package com.oceanlk.backend.controller;

import com.oceanlk.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/system")
@RequiredArgsConstructor
public class EmailHealthController {

    private final EmailService emailService;

    @GetMapping("/test-email")
    public ResponseEntity<Map<String, Object>> testEmail() {
        Map<String, Object> response = new HashMap<>();
        long startTime = System.currentTimeMillis();

        try {
            // Get current user from security context
            String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();

            // If running without actual authentication for testing purposes or if principal
            // is not email
            // You might want to fallback or check the principal type.
            // Assuming standard convention where Principal name is username/email.

            if (currentUserEmail == null || "anonymousUser".equals(currentUserEmail)) {
                response.put("status", "FAILURE");
                response.put("error", "No authenticated user found. Please login as admin.");
                return ResponseEntity.badRequest().body(response);
            }

            emailService.sendAdminNotification(
                    currentUserEmail,
                    "System Health Check",
                    "This is a test email to verify the email service configuration and latency.",
                    "/admin/system");

            long endTime = System.currentTimeMillis();
            response.put("status", "SUCCESS");
            response.put("smtpHost", "Configured in application.properties"); // Could expose actual host if safe
            response.put("latency", (endTime - startTime) + "ms");
            response.put("recipient", currentUserEmail);
            response.put("error", null);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            long endTime = System.currentTimeMillis();
            response.put("status", "FAILURE");
            response.put("latency", (endTime - startTime) + "ms");
            response.put("error", e.getMessage());
            response.put("exceptionClass", e.getClass().getSimpleName());

            return ResponseEntity.internalServerError().body(response);
        }
    }
}
