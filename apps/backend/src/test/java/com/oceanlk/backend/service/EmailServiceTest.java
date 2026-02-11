package com.oceanlk.backend.service;

import com.oceanlk.backend.model.AdminUser;
import com.oceanlk.backend.model.ContactMessage;
import com.oceanlk.backend.model.TalentPoolApplication;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(emailService, "fromEmail", "noreply@oceanlk.com");
        ReflectionTestUtils.setField(emailService, "hrEmail", "hr@oceanlk.com");
        ReflectionTestUtils.setField(emailService, "emailEnabled", true);

        lenient().when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
    }

    @Test
    void sendApplicantConfirmation_ShouldSendEmail() {
        // Arrange
        TalentPoolApplication app = new TalentPoolApplication();
        app.setEmail("test@example.com");
        app.setFullName("Test User");
        app.setPosition("Developer");
        app.setSubmittedDate(java.time.LocalDateTime.now());

        // Act
        emailService.sendApplicantConfirmation(app);

        // Assert
        verify(mailSender, times(1)).send(mimeMessage);
    }

    @Test
    void sendHRNotification_ShouldSendEmail() {
        // Arrange
        TalentPoolApplication app = new TalentPoolApplication();
        app.setEmail("test@example.com");
        app.setFullName("Test User");
        app.setSubmittedDate(java.time.LocalDateTime.now());

        // Act
        emailService.sendHRNotification(app);

        // Assert
        verify(mailSender, times(1)).send(mimeMessage);
    }

    @Test
    void sendContactConfirmation_ShouldSendEmail() {
        // Arrange
        ContactMessage msg = new ContactMessage();
        msg.setEmail("test@example.com");
        msg.setName("Test User");
        msg.setSubmittedDate(java.time.LocalDateTime.now());

        // Act
        emailService.sendContactConfirmation(msg);

        // Assert
        verify(mailSender, times(1)).send(mimeMessage);
    }

    @Test
    void sendContactNotificationToHR_ShouldSendEmail() {
        // Arrange
        ContactMessage msg = new ContactMessage();
        msg.setEmail("test@example.com");
        msg.setName("Test User");
        msg.setMessage("Hello");
        msg.setSubmittedDate(java.time.LocalDateTime.now());

        // Act
        emailService.sendContactNotificationToHR(msg);

        // Assert
        verify(mailSender, times(1)).send(mimeMessage);
    }

    @Test
    void sendAdminNotification_ShouldSendEmail() {
        // Act
        emailService.sendAdminNotification("admin@oceanlk.com", "Test Subject", "Test Message", "/link");

        // Assert
        verify(mailSender, times(1)).send(mimeMessage);
    }

    @Test
    void sendOtpEmail_ShouldSendEmail() {
        // Act
        emailService.sendOtpEmail("admin@oceanlk.com", "123456", "admin");

        // Assert
        verify(mailSender, times(1)).send(mimeMessage);
    }

    @Test
    void sendAdminWelcomeEmail_ShouldSendEmail() {
        // Arrange
        AdminUser admin = new AdminUser();
        admin.setEmail("newadmin@oceanlk.com");
        admin.setUsername("newadmin");

        // Act
        emailService.sendAdminWelcomeEmail(admin, "password123");

        // Assert
        verify(mailSender, times(1)).send(mimeMessage);
    }

    @Test
    void sendEmail_ShouldNotThrow_WhenExceptionOccurs() {
        // Arrange
        TalentPoolApplication app = new TalentPoolApplication();
        app.setEmail("test@example.com");
        app.setSubmittedDate(java.time.LocalDateTime.now());

        doThrow(new RuntimeException("Mail server error")).when(mailSender).send(any(MimeMessage.class));

        // Act & Assert
        assertDoesNotThrow(() -> emailService.sendApplicantConfirmation(app));
    }

    @Test
    void sendEmail_ShouldSkip_WhenDisabled() {
        // Arrange
        ReflectionTestUtils.setField(emailService, "emailEnabled", false);
        TalentPoolApplication app = new TalentPoolApplication();

        // Act
        emailService.sendApplicantConfirmation(app);

        // Assert
        verify(mailSender, never()).createMimeMessage();
    }
}
