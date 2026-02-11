package com.oceanlk.backend.service;

import com.oceanlk.backend.model.AdminUser;
import com.oceanlk.backend.model.Notification;
import com.oceanlk.backend.repository.AdminUserRepository;
import com.oceanlk.backend.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private AdminUserRepository adminUserRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private NotificationService notificationService;

    private Notification testNotification;
    private AdminUser testAdmin;

    @BeforeEach
    void setUp() {
        testNotification = new Notification("Test Title", "Test Message", "INFO", "ROLE_ADMIN", "/link");
        testNotification.setId("notif-123");
        testNotification.setRead(false);

        testAdmin = new AdminUser();
        testAdmin.setId("admin-123");
        testAdmin.setUsername("admin");
        testAdmin.setEmail("admin@oceanlk.com");
        testAdmin.setRole("ADMIN");
    }

    @Test
    void createNotification_ShouldSaveAndSendEmails() throws Exception {
        // Arrange
        when(notificationRepository.save(any(Notification.class))).thenReturn(testNotification);
        when(adminUserRepository.findByRole("ADMIN")).thenReturn(Arrays.asList(testAdmin));

        // Act
        notificationService.createNotification("Test Title", "Test Message", "INFO", "ROLE_ADMIN", "/link");

        // Assert
        verify(notificationRepository, times(1)).save(any(Notification.class));
        verify(emailService, times(1)).sendAdminNotification(eq("admin@oceanlk.com"), eq("Test Title"),
                eq("Test Message"), eq("/link"));
    }

    @Test
    void createNotification_ShouldExcludeUser_WhenSpecified() throws Exception {
        // Arrange
        when(notificationRepository.save(any(Notification.class))).thenReturn(testNotification);
        when(adminUserRepository.findByRole("ADMIN")).thenReturn(Arrays.asList(testAdmin));

        // Act
        notificationService.createNotification("Test Title", "Test Message", "INFO", "ROLE_ADMIN", "/link", "admin");

        // Assert
        verify(notificationRepository, times(1)).save(any(Notification.class));
        verify(emailService, never()).sendAdminNotification(anyString(), anyString(), anyString(), anyString());
    }

    @Test
    void createNotification_ShouldHandleEmailFailure() throws Exception {
        // Arrange
        when(notificationRepository.save(any(Notification.class))).thenReturn(testNotification);
        when(adminUserRepository.findByRole("ADMIN")).thenReturn(Arrays.asList(testAdmin));
        doThrow(new RuntimeException("Email failed")).when(emailService).sendAdminNotification(anyString(), anyString(),
                anyString(), anyString());

        // Act & Assert (Should not throw exception)
        assertDoesNotThrow(() -> positionService());

        notificationService.createNotification("Test Title", "Test Message", "INFO", "ROLE_ADMIN", "/link");

        // Assert
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    private void positionService() {
    }

    @Test
    void createNotificationForSpecificUser_ShouldSaveAndSendEmail() throws Exception {
        // Arrange
        when(notificationRepository.save(any(Notification.class))).thenReturn(testNotification);
        when(adminUserRepository.findById("admin-123")).thenReturn(Optional.of(testAdmin));

        // Act
        notificationService.createNotificationForSpecificUser("Test Title", "Test Message", "INFO", "admin-123",
                "/link");

        // Assert
        verify(notificationRepository, times(1)).save(any(Notification.class));
        verify(emailService, times(1)).sendAdminNotification(eq("admin@oceanlk.com"), eq("Personal System Alert"),
                eq("Test Message"), eq("/link"));
    }

    @Test
    void getUnreadNotificationsForRole_ShouldReturnNotifications() {
        // Arrange
        List<Notification> notifications = Arrays.asList(testNotification);
        when(notificationRepository.findByRecipientRoleAndIsReadFalseOrderByCreatedAtDesc("ROLE_ADMIN"))
                .thenReturn(notifications);

        // Act
        List<Notification> result = notificationService.getUnreadNotificationsForRole("ROLE_ADMIN");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(notificationRepository, times(1)).findByRecipientRoleAndIsReadFalseOrderByCreatedAtDesc("ROLE_ADMIN");
    }

    @Test
    void getUnreadNotificationsForUser_ShouldReturnNotifications() {
        // Arrange
        List<Notification> notifications = Arrays.asList(testNotification);
        when(notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc("user-123"))
                .thenReturn(notifications);

        // Act
        List<Notification> result = notificationService.getUnreadNotificationsForUser("user-123");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(notificationRepository, times(1)).findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc("user-123");
    }

    @Test
    void markAsRead_ShouldUpdateNotification() {
        // Arrange
        when(notificationRepository.findById("notif-123")).thenReturn(Optional.of(testNotification));
        when(notificationRepository.save(any(Notification.class))).thenReturn(testNotification);

        // Act
        notificationService.markAsRead("notif-123");

        // Assert
        assertTrue(testNotification.isRead());
        verify(notificationRepository, times(1)).save(testNotification);
    }

    @Test
    void markAllAsReadForRole_ShouldUpdateAll() {
        // Arrange
        List<Notification> notifications = Arrays.asList(testNotification);
        when(notificationRepository.findByRecipientRoleAndIsReadFalseOrderByCreatedAtDesc("ROLE_ADMIN"))
                .thenReturn(notifications);
        when(notificationRepository.saveAll(anyList())).thenReturn(notifications);

        // Act
        notificationService.markAllAsReadForRole("ROLE_ADMIN");

        // Assert
        assertTrue(testNotification.isRead());
        verify(notificationRepository, times(1)).saveAll(notifications);
    }
}
