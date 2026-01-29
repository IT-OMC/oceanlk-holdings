package com.oceanlk.backend.service;

import com.oceanlk.backend.model.Notification;
import com.oceanlk.backend.repository.AdminUserRepository;
import com.oceanlk.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final AdminUserRepository adminUserRepository;
    private final EmailService emailService;

    public void createNotification(String message, String type, String recipientRole, String link) {
        try {
            if (message == null || type == null || recipientRole == null) {
                log.warn("Attempted to create notification with null required fields");
                return;
            }
            Notification notification = new Notification(message, type, recipientRole, link);
            notificationRepository.save(notification);

            // Send Email to all admins with this role
            String roleForQuery = recipientRole.startsWith("ROLE_") ? recipientRole.substring(5) : recipientRole;
            var admins = adminUserRepository.findByRole(roleForQuery);
            for (var admin : admins) {
                if (admin.getEmail() != null) {
                    try {
                        emailService.sendAdminNotification(admin.getEmail(), "New System Alert", message, link);
                    } catch (Exception emailEx) {
                        log.error("Failed to send email alert to {}: {}", admin.getEmail(), emailEx.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            // Log error but don't break the main flow
            log.error("Failed to create notification: {}", e.getMessage());
        }
    }

    public void createNotificationForSpecificUser(String message, String type, String recipientId, String link) {
        try {
            if (message == null || type == null || recipientId == null) {
                log.warn("Attempted to create user notification with null required fields");
                return;
            }
            Notification notification = new Notification(message, type, null, link);
            notification.setRecipientId(recipientId);
            notificationRepository.save(notification);

            // Send Email to the specific user
            adminUserRepository.findById(recipientId).ifPresent(admin -> {
                String email = admin.getEmail();
                if (email != null) {
                    try {
                        emailService.sendAdminNotification(email, "Personal System Alert", message, link);
                    } catch (Exception emailEx) {
                        log.error("Failed to send individual email alert to {}: {}", email,
                                emailEx.getMessage());
                    }
                }
            });
        } catch (Exception e) {
            log.error("Failed to create user notification: {}", e.getMessage());
        }
    }

    public List<Notification> getUnreadNotificationsForRole(String role) {
        return notificationRepository.findByRecipientRoleAndIsReadFalseOrderByCreatedAtDesc(role);
    }

    public List<Notification> getUnreadNotificationsForUser(String userId) {
        return notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }

    public void markAllAsReadForRole(String role) {
        List<Notification> notifications = notificationRepository
                .findByRecipientRoleAndIsReadFalseOrderByCreatedAtDesc(role);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }
}
