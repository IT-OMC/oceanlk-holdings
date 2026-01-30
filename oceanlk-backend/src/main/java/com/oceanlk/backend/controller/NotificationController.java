package com.oceanlk.backend.controller;

import com.oceanlk.backend.dto.NotificationRequest;
import com.oceanlk.backend.model.Notification;
import com.oceanlk.backend.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> createNotification(@Valid @RequestBody NotificationRequest request) {
        notificationService.createNotification(
                request.getTitle(),
                request.getMessage(),
                request.getType(),
                request.getRecipientRole(),
                request.getLink());
        return ResponseEntity.ok(Map.of("message", "Notification created successfully"));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<Notification>> getMyNotifications(Authentication authentication) {
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(auth -> auth.getAuthority())
                .orElse("ROLE_ADMIN");

        // Fetch notifications for the role
        List<Notification> notifications = notificationService.getUnreadNotificationsForRole(role);

        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/{id}/mark-read")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> markAsRead(@PathVariable String id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }

    @PatchMapping("/mark-all-read")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> markAllAsRead(Authentication authentication) {
        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(auth -> auth.getAuthority())
                .orElse("ROLE_ADMIN");

        notificationService.markAllAsReadForRole(role);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }
}
