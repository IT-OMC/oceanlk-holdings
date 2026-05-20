package com.oceanlk.backend.controller;

import com.oceanlk.backend.dto.UserCreateRequest;
import com.oceanlk.backend.dto.UserUpdateRequest;
import com.oceanlk.backend.model.AdminUser;
import com.oceanlk.backend.service.AdminUserService;
import com.oceanlk.backend.service.AuditLogService;
import com.oceanlk.backend.service.EmailService;
import com.oceanlk.backend.service.NotificationService;
import com.oceanlk.backend.service.OtpService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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
    private final NotificationService notificationService;

    @GetMapping("/list")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<AdminUser>> getAllAdmins() {
        System.out.println("DEBUG: getAllAdmins accessed by user");
        return ResponseEntity.ok(adminUserService.getAllAdmins());
    }

    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<?> addAdmin(@Valid @RequestBody UserCreateRequest request,
            @RequestHeader("Authorization") String auth,
            org.springframework.security.core.Authentication authentication) {
        // DEBUG: Log authentication details
        System.out.println("DEBUG - addAdmin called by user: " +
                (authentication != null ? authentication.getName() : "null"));
        System.out.println("DEBUG - addAdmin authorities: " +
                (authentication != null ? authentication.getAuthorities() : "null"));

        // Check if trying to create SUPER_ADMIN
        String requestedRole = request.getRole() == null ? "ADMIN" : request.getRole();
        if ("SUPER_ADMIN".equals(requestedRole)) {
            // Only SUPER_ADMIN can create SUPER_ADMIN users
            boolean isSuperAdmin = authentication != null && authentication.getAuthorities().stream()
                    .anyMatch(granted -> granted.getAuthority().equals("ROLE_SUPER_ADMIN"));
            System.out.println("DEBUG - User is SUPER_ADMIN: " + isSuperAdmin);
            if (!isSuperAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only SUPER_ADMIN can create SUPER_ADMIN users"));
            }
        }

        if (adminUserService.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Username already exists"));
        }
        if (adminUserService.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Email already exists"));
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

        // Notify Super Admins
        notificationService.createNotification(
                "Admin Management Action",
                authentication.getName() + " created a new admin account: " + created.getUsername(),
                "INFO",
                "ROLE_SUPER_ADMIN",
                "/admin/management",
                authentication.getName());

        return ResponseEntity.ok(created);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<?> deleteAdmin(@PathVariable String id,
            org.springframework.security.core.Authentication authentication) {
        adminUserService.deleteAdmin(id);
        auditLogService.logAction("SUPER_ADMIN", "DELETE_ADMIN", "AdminUser", id, "Deleted admin with ID: " + id);

        // Notify Super Admins
        try {
            org.springframework.security.core.Authentication auth_obj = authentication != null ? authentication
                    : org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            notificationService.createNotification(
                    "Admin Management Action",
                    (auth_obj != null ? auth_obj.getName() : "System") + " deleted an admin account (ID: " + id + ")",
                    "WARNING",
                    "ROLE_SUPER_ADMIN",
                    "/admin/management",
                    (auth_obj != null ? auth_obj.getName() : null));
        } catch (Exception e) {
            log.error("Failed to send delete admin notification: {}", e.getMessage());
        }

        return ResponseEntity.ok(Map.of("message", "Admin deleted successfully"));
    }

    @PutMapping("/edit/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
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
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                    .body(Map.of("error", "Username already exists"));
                        }
                        existingAdmin.setUsername(request.getUsername());
                    }

                    AdminUser updated = adminUserService.updateAdmin(existingAdmin);
                    auditLogService.logAction("SUPER_ADMIN", "UPDATE_ADMIN", "AdminUser", updated.getId(),
                            "Updated admin details for: " + updated.getUsername());

                    // Notify Super Admins
                    try {
                        org.springframework.security.core.Authentication auth_obj = org.springframework.security.core.context.SecurityContextHolder
                                .getContext().getAuthentication();
                        notificationService.createNotification(
                                "Admin Management Action",
                                (auth_obj != null ? auth_obj.getName() : "System") + " updated admin details for: "
                                        + updated.getUsername(),
                                "INFO",
                                "ROLE_SUPER_ADMIN",
                                "/admin/management",
                                (auth_obj != null ? auth_obj.getName() : null));
                    } catch (Exception e) {
                        log.error("Failed to send update admin notification: {}", e.getMessage());
                    }

                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<?> getProfile(@PathVariable String username, java.security.Principal principal,
            org.springframework.security.core.Authentication authentication) {
        boolean isOwner = principal.getName().equals(username);
        boolean isSuperAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

        if (!isOwner && !isSuperAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied. You can only view your own profile."));
        }

        return adminUserService.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request,
            java.security.Principal principal) {
        String username = request.get("username");
        String newPassword = request.get("newPassword");

        if (!principal.getName().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You can only change your own password."));
        }

        return adminUserService.findByUsername(username)
                .map(user -> {
                    adminUserService.changePassword(user, newPassword);
                    auditLogService.logAction(username, "CHANGE_PASSWORD", "AdminUser", user.getId(),
                            "Changed password");
                    return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> request,
            java.security.Principal principal) {
        String username = request.get("username");
        String newName = request.get("name");
        String newEmail = request.get("email");
        String newPhone = request.get("phone");
        String newAvatar = request.get("avatar");
        String newUsername = request.get("newUsername");

        if (!principal.getName().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You can only update your own profile."));
        }

        return adminUserService.findByUsername(username)
                .map(user -> {
                    if (newName != null)
                        user.setName(newName);
                    if (newEmail != null) {
                        // Check if email already exists in another account
                        if (!newEmail.equals(user.getEmail()) && adminUserService.findByEmail(newEmail).isPresent()) {
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                    .body(Map.of("error", "Email already in use"));
                        }
                        user.setEmail(newEmail);
                    }
                    if (newPhone != null)
                        user.setPhone(newPhone);
                    if (newAvatar != null)
                        user.setAvatar(newAvatar);

                    if (newUsername != null && !newUsername.equals(user.getUsername())) {
                        if (adminUserService.findByUsername(newUsername).isPresent()) {
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                    .body(Map.of("error", "Username already in use"));
                        }
                        user.setUsername(newUsername);
                        // Note: User will need to log in again with new username if session is based on
                        // it
                    }

                    adminUserService.updateAdmin(user);
                    auditLogService.logAction(username, "UPDATE_PROFILE", "AdminUser", user.getId(),
                            "Updated profile details");
                    return ResponseEntity.ok(Map.of("message", "Profile updated successfully", "user", user));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found")));
    }

    @GetMapping("/profile/preferences")
    public ResponseEntity<?> getPreferences(java.security.Principal principal) {
        return adminUserService.findByUsername(principal.getName())
                .map(user -> {
                    var prefs = user.getEmailPreferences();
                    if (prefs == null) {
                        prefs = Map.of(
                                "PENDING_CHANGES", true,
                                "USER_MANAGEMENT", true,
                                "SYSTEM_ALERTS", true);
                    }
                    return ResponseEntity.ok(prefs);
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/profile/preferences")
    public ResponseEntity<?> updatePreferences(@RequestBody Map<String, Boolean> preferences,
            java.security.Principal principal) {
        return adminUserService.findByUsername(principal.getName())
                .map(user -> {
                    user.setEmailPreferences(preferences);
                    adminUserService.updateAdmin(user);
                    auditLogService.logAction(principal.getName(), "UPDATE_PREFERENCES", "AdminUser", user.getId(),
                            "Updated email preferences");
                    return ResponseEntity.ok(Map.of("message", "Preferences updated successfully"));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/profile/contact-update/init")
    public ResponseEntity<?> initiateContactUpdate(@RequestBody Map<String, String> request,
            java.security.Principal principal) {
        String username = request.get("username");
        String type = request.get("type"); // "email" or "phone"
        String value = request.get("value");

        if (!principal.getName().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Unauthorized access."));
        }

        return adminUserService.findByUsername(username)
                .map(user -> {
                    // Check if email/phone already exists in another account
                    if ("email".equals(type)) {
                        if (adminUserService.findByEmail(value).isPresent()) {
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                    .body(Map.of("error", "Email already in use"));
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
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found")));
    }

    @PostMapping("/profile/contact-update/verify")
    public ResponseEntity<?> verifyContactUpdate(@RequestBody Map<String, String> request,
            java.security.Principal principal) {
        String username = request.get("username");
        String otp = request.get("otp");

        if (!principal.getName().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Unauthorized access."));
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
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body(Map.of("error", "Invalid or expired OTP"));
                    }
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found")));
    }
}
