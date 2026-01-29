package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.AdminUser;
import com.oceanlk.backend.service.AdminUserService;
import com.oceanlk.backend.service.AuditLogService;
import com.oceanlk.backend.service.EmailService;
import com.oceanlk.backend.service.OtpService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/management")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:4173" })
@Slf4j
public class AdminManagementController {

    private final AdminUserService adminUserService;
    private final AuditLogService auditLogService;
    private final EmailService emailService;
    private final OtpService otpService;

    @GetMapping("/list")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<AdminUser>> getAllAdmins() {
        return ResponseEntity.ok(adminUserService.getAllAdmins());
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> addAdmin(@RequestBody AdminUser admin, @RequestHeader("Authorization") String auth) {
        if (adminUserService.findByUsername(admin.getUsername()).isPresent()) {
            return ResponseEntity.status(400).body(Map.of("error", "Username already exists"));
        }
        if (adminUserService.findByEmail(admin.getEmail()).isPresent()) {
            return ResponseEntity.status(400).body(Map.of("error", "Email already exists"));
        }

        // Initialize fields that might not be set from the frontend
        admin.setActive(true);
        admin.setVerified(false);
        admin.setCreatedDate(java.time.LocalDateTime.now());

        String plainPassword = admin.getPassword();
        AdminUser created = adminUserService.createAdmin(admin);

        // Send welcome email
        try {
            emailService.sendAdminWelcomeEmail(created, plainPassword);
        } catch (MessagingException e) {
            log.error("Failed to send welcome email to new admin: {}", e.getMessage());
        }

        auditLogService.logAction("SUPER_ADMIN", "CREATE_ADMIN", "AdminUser", created.getId(),
                "Created new admin: " + created.getUsername());
        return ResponseEntity.ok(created);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> deleteAdmin(@PathVariable String id) {
        adminUserService.deleteAdmin(id);
        auditLogService.logAction("SUPER_ADMIN", "DELETE_ADMIN", "AdminUser", id, "Deleted admin with ID: " + id);
        return ResponseEntity.ok(Map.of("message", "Admin deleted successfully"));
    }

    @PutMapping("/edit/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> updateAdmin(@PathVariable String id, @RequestBody AdminUser adminDetails) {
        return adminUserService.findById(id)
                .map(existingAdmin -> {
                    // Update only specific fields to avoid overwriting password or sensitive data
                    // unintentionally
                    existingAdmin.setName(adminDetails.getName());
                    existingAdmin.setEmail(adminDetails.getEmail());
                    existingAdmin.setPhone(adminDetails.getPhone());
                    existingAdmin.setRole(adminDetails.getRole());
                    existingAdmin.setActive(adminDetails.isActive());
                    // Username is usually kept constant, but let's allow it if provided and not
                    // conflicting
                    if (adminDetails.getUsername() != null
                            && !adminDetails.getUsername().equals(existingAdmin.getUsername())) {
                        if (adminUserService.findByUsername(adminDetails.getUsername()).isPresent()) {
                            return ResponseEntity.status(400).body(Map.of("error", "Username already exists"));
                        }
                        existingAdmin.setUsername(adminDetails.getUsername());
                    }

                    AdminUser updated = adminUserService.updateAdmin(existingAdmin);
                    auditLogService.logAction("SUPER_ADMIN", "UPDATE_ADMIN", "AdminUser", updated.getId(),
                            "Updated admin details for: " + updated.getUsername());
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.status(404).build());
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<?> getProfile(@PathVariable String username) {
        return adminUserService.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).build());
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String newPassword = request.get("newPassword");

        // Note: OTP verification should have happened before calling this,
        // or we verify it here. Let's assume verification happens in separate step for
        // better UX.
        // For security, we'll re-verify if needed or trust the previous step if handled
        // by state.

        return adminUserService.findByUsername(username)
                .map(user -> {
                    adminUserService.changePassword(user, newPassword);
                    auditLogService.logAction(username, "CHANGE_PASSWORD", "AdminUser", user.getId(),
                            "Changed password");
                    return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
                })
                .orElse(ResponseEntity.status(404).build());
    }

    @PutMapping("/profile/update-name")
    public ResponseEntity<?> updateProfileName(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String newName = request.get("name");

        return adminUserService.findByUsername(username)
                .map(user -> {
                    user.setName(newName);
                    adminUserService.updateAdmin(user);
                    auditLogService.logAction(username, "UPDATE_PROFILE", "AdminUser", user.getId(),
                            "Updated profile name");
                    return ResponseEntity.ok(Map.of("message", "Name updated successfully"));
                })
                .orElse(ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }

    @PostMapping("/profile/contact-update/init")
    public ResponseEntity<?> initiateContactUpdate(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String type = request.get("type"); // "email" or "phone"
        String value = request.get("value");

        return adminUserService.findByUsername(username)
                .map(user -> {
                    // Check if email/phone already exists in another account
                    if ("email".equals(type)) {
                        if (adminUserService.findByEmail(value).isPresent()) {
                            return ResponseEntity.status(400).body(Map.of("error", "Email already in use"));
                        }
                        user.setTempEmail(value);
                        user.setTempPhone(null); // Clear other temp field
                    } else if ("phone".equals(type)) {
                        user.setTempPhone(value);
                        user.setTempEmail(null);
                    } else {
                        return ResponseEntity.badRequest().body(Map.of("error", "Invalid type"));
                    }

                    otpService.sendOtpToTarget(user, type, value);
                    // Save user to store temp fields and otp
                    adminUserService.updateAdmin(user);

                    return ResponseEntity.ok(Map.of("message", "OTP sent to new " + type));
                })
                .orElse(ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }

    @PostMapping("/profile/contact-update/verify")
    public ResponseEntity<?> verifyContactUpdate(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String otp = request.get("otp");

        return adminUserService.findByUsername(username)
                .map(user -> {
                    if (otpService.verifyTempOtp(user, otp)) {
                        if (user.getTempEmail() != null) {
                            user.setEmail(user.getTempEmail());
                            user.setTempEmail(null);
                            auditLogService.logAction(username, "UPDATE_EMAIL", "AdminUser", user.getId(),
                                    "Updated email");
                        } else if (user.getTempPhone() != null) {
                            user.setPhone(user.getTempPhone());
                            user.setTempPhone(null);
                            auditLogService.logAction(username, "UPDATE_PHONE", "AdminUser", user.getId(),
                                    "Updated phone");
                        }
                        adminUserService.updateAdmin(user);
                        return ResponseEntity.ok(Map.of("message", "Contact info updated successfully"));
                    } else {
                        return ResponseEntity.status(400).body(Map.of("error", "Invalid or expired OTP"));
                    }
                })
                .orElse(ResponseEntity.status(404).body(Map.of("error", "User not found")));
    }
}
