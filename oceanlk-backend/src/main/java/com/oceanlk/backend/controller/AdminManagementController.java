package com.oceanlk.backend.controller;

import com.oceanlk.backend.dto.UserCreateRequest;
import com.oceanlk.backend.dto.UserUpdateRequest;
import com.oceanlk.backend.model.AdminUser;
import com.oceanlk.backend.service.AdminUserService;
import com.oceanlk.backend.service.AuditLogService;
import com.oceanlk.backend.service.EmailService;
import com.oceanlk.backend.service.OtpService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
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
    public ResponseEntity<?> addAdmin(@Valid @RequestBody UserCreateRequest request,
            @RequestHeader("Authorization") String auth) {
        if (adminUserService.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(400).body(Map.of("error", "Username already exists"));
        }
        if (adminUserService.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(400).body(Map.of("error", "Email already exists"));
        }

        AdminUser admin = new AdminUser(
                request.getName(),
                request.getUsername(),
                request.getPassword(),
                request.getEmail(),
                request.getPhone(),
                request.getRole() == null ? "ADMIN" : request.getRole());
        admin.setActive(true);
        admin.setVerified(false);
        admin.setCreatedDate(java.time.LocalDateTime.now());

        String plainPassword = request.getPassword();
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
    public ResponseEntity<?> updateAdmin(@PathVariable String id, @Valid @RequestBody UserUpdateRequest request) {
        return adminUserService.findById(id)
                .map(existingAdmin -> {
                    if (request.getName() != null)
                        existingAdmin.setName(request.getName());
                    if (request.getEmail() != null)
                        existingAdmin.setEmail(request.getEmail());
                    if (request.getPhone() != null)
                        existingAdmin.setPhone(request.getPhone());
                    if (request.getRole() != null)
                        existingAdmin.setRole(request.getRole());
                    if (request.getActive() != null)
                        existingAdmin.setActive(request.getActive());

                    if (request.getUsername() != null && !request.getUsername().equals(existingAdmin.getUsername())) {
                        if (adminUserService.findByUsername(request.getUsername()).isPresent()) {
                            return ResponseEntity.status(400).body(Map.of("error", "Username already exists"));
                        }
                        existingAdmin.setUsername(request.getUsername());
                    }

                    AdminUser updated = adminUserService.updateAdmin(existingAdmin);
                    auditLogService.logAction("SUPER_ADMIN", "UPDATE_ADMIN", "AdminUser", updated.getId(),
                            "Updated admin details for: " + updated.getUsername());
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.status(404).build());
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<?> getProfile(@PathVariable String username, java.security.Principal principal,
            org.springframework.security.core.Authentication authentication) {
        boolean isOwner = principal.getName().equals(username);
        boolean isSuperAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

        if (!isOwner && !isSuperAdmin) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", "Access denied. You can only view your own profile."));
        }

        return adminUserService.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).build());
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request,
            java.security.Principal principal) {
        String username = request.get("username");
        String newPassword = request.get("newPassword");

        if (!principal.getName().equals(username)) {
            return ResponseEntity.status(403).body(Map.of("error", "You can only change your own password."));
        }

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
    public ResponseEntity<?> updateProfileName(@RequestBody Map<String, String> request,
            java.security.Principal principal) {
        String username = request.get("username");
        String newName = request.get("name");

        if (!principal.getName().equals(username)) {
            return ResponseEntity.status(403).body(Map.of("error", "You can only update your own profile."));
        }

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
    public ResponseEntity<?> initiateContactUpdate(@RequestBody Map<String, String> request,
            java.security.Principal principal) {
        String username = request.get("username");
        String type = request.get("type"); // "email" or "phone"
        String value = request.get("value");

        if (!principal.getName().equals(username)) {
            return ResponseEntity.status(403).body(Map.of("error", "Unauthorized access."));
        }

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
    public ResponseEntity<?> verifyContactUpdate(@RequestBody Map<String, String> request,
            java.security.Principal principal) {
        String username = request.get("username");
        String otp = request.get("otp");

        if (!principal.getName().equals(username)) {
            return ResponseEntity.status(403).body(Map.of("error", "Unauthorized access."));
        }

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
