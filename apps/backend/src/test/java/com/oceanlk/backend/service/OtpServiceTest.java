package com.oceanlk.backend.service;

import com.oceanlk.backend.model.AdminUser;
import com.oceanlk.backend.repository.AdminUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OtpServiceTest {

    @Mock
    private AdminUserRepository adminUserRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private OtpService otpService;

    private AdminUser testUser;

    @BeforeEach
    void setUp() {
        testUser = new AdminUser();
        testUser.setId("user-123");
        testUser.setUsername("testuser");
        testUser.setEmail("test@oceanlk.com");
        testUser.setPhone("+94771234567");
    }

    @Test
    void generateOtp_ShouldCreateSixDigitOtp() {
        // Arrange
        when(adminUserRepository.save(any(AdminUser.class))).thenReturn(testUser);

        // Act
        String otp = otpService.generateOtp(testUser);

        // Assert
        assertNotNull(otp);
        assertEquals(6, otp.length());
        assertTrue(otp.matches("\\d{6}")); // Verify it's 6 digits
        verify(adminUserRepository, times(1)).save(testUser);
    }

    @Test
    void generateOtp_ShouldSetExpiryToTenMinutes() {
        // Arrange
        when(adminUserRepository.save(any(AdminUser.class))).thenReturn(testUser);
        LocalDateTime beforeGeneration = LocalDateTime.now().plusMinutes(9);

        // Act
        otpService.generateOtp(testUser);

        // Assert
        assertNotNull(testUser.getOtpExpiry());
        assertTrue(testUser.getOtpExpiry().isAfter(beforeGeneration));
        assertTrue(testUser.getOtpExpiry().isBefore(LocalDateTime.now().plusMinutes(11)));
        verify(adminUserRepository, times(1)).save(testUser);
    }

    @Test
    void generateOtp_ShouldSetOtpOnUser() {
        // Arrange
        when(adminUserRepository.save(any(AdminUser.class))).thenReturn(testUser);

        // Act
        String otp = otpService.generateOtp(testUser);

        // Assert
        assertEquals(otp, testUser.getOtp());
        verify(adminUserRepository, times(1)).save(testUser);
    }

    @Test
    void sendOtp_ShouldCallEmailService_WhenMethodIsEmail() throws Exception {
        // Arrange
        when(adminUserRepository.save(any(AdminUser.class))).thenReturn(testUser);
        doNothing().when(emailService).sendOtpEmail(anyString(), anyString(), anyString());

        // Act
        otpService.sendOtp(testUser, "email");

        // Assert
        verify(emailService, times(1)).sendOtpEmail(
                eq("test@oceanlk.com"),
                anyString(),
                eq("testuser"));
        verify(adminUserRepository, times(1)).save(testUser);
    }

    @Test
    void sendOtp_ShouldThrowException_WhenEmailFails() throws Exception {
        // Arrange
        when(adminUserRepository.save(any(AdminUser.class))).thenReturn(testUser);
        doThrow(new RuntimeException("Email service error"))
                .when(emailService).sendOtpEmail(anyString(), anyString(), anyString());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            otpService.sendOtp(testUser, "email");
        });

        assertTrue(exception.getMessage().contains("Failed to send OTP email"));
    }

    @Test
    void generateTempOtp_ShouldCreateSixDigitOtp() {
        // Arrange
        when(adminUserRepository.save(any(AdminUser.class))).thenReturn(testUser);

        // Act
        String tempOtp = otpService.generateTempOtp(testUser);

        // Assert
        assertNotNull(tempOtp);
        assertEquals(6, tempOtp.length());
        assertTrue(tempOtp.matches("\\d{6}"));
        assertEquals(tempOtp, testUser.getTempOtp());
        verify(adminUserRepository, times(1)).save(testUser);
    }

    @Test
    void sendOtpToTarget_ShouldSendToNewEmail() throws Exception {
        // Arrange
        String newEmail = "newemail@oceanlk.com";
        when(adminUserRepository.save(any(AdminUser.class))).thenReturn(testUser);
        doNothing().when(emailService).sendOtpEmail(anyString(), anyString(), anyString());

        // Act
        otpService.sendOtpToTarget(testUser, "email", newEmail);

        // Assert
        verify(emailService, times(1)).sendOtpEmail(
                eq(newEmail),
                anyString(),
                eq("testuser"));
        assertNotNull(testUser.getTempOtp());
        verify(adminUserRepository, times(1)).save(testUser);
    }

    @Test
    void verifyOtp_ShouldReturnTrue_WhenOtpValidAndNotExpired() {
        // Arrange
        testUser.setOtp("123456");
        testUser.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        when(adminUserRepository.save(any(AdminUser.class))).thenReturn(testUser);

        // Act
        boolean result = otpService.verifyOtp(testUser, "123456");

        // Assert
        assertTrue(result);
        assertNull(testUser.getOtp()); // OTP should be cleared
        assertNull(testUser.getOtpExpiry()); // Expiry should be cleared
        verify(adminUserRepository, times(1)).save(testUser);
    }

    @Test
    void verifyOtp_ShouldReturnFalse_WhenOtpExpired() {
        // Arrange
        testUser.setOtp("123456");
        testUser.setOtpExpiry(LocalDateTime.now().minusMinutes(1)); // Expired

        // Act
        boolean result = otpService.verifyOtp(testUser, "123456");

        // Assert
        assertFalse(result);
        verify(adminUserRepository, never()).save(any(AdminUser.class));
    }

    @Test
    void verifyOtp_ShouldReturnFalse_WhenOtpIncorrect() {
        // Arrange
        testUser.setOtp("123456");
        testUser.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        // Act
        boolean result = otpService.verifyOtp(testUser, "654321"); // Wrong OTP

        // Assert
        assertFalse(result);
        assertNotNull(testUser.getOtp()); // OTP should not be cleared
        verify(adminUserRepository, never()).save(any(AdminUser.class));
    }

    @Test
    void verifyOtp_ShouldReturnFalse_WhenOtpIsNull() {
        // Arrange
        testUser.setOtp(null);
        testUser.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        // Act
        boolean result = otpService.verifyOtp(testUser, "123456");

        // Assert
        assertFalse(result);
        verify(adminUserRepository, never()).save(any(AdminUser.class));
    }

    @Test
    void verifyOtp_ShouldReturnFalse_WhenExpiryIsNull() {
        // Arrange
        testUser.setOtp("123456");
        testUser.setOtpExpiry(null);

        // Act
        boolean result = otpService.verifyOtp(testUser, "123456");

        // Assert
        assertFalse(result);
        verify(adminUserRepository, never()).save(any(AdminUser.class));
    }

    @Test
    void verifyTempOtp_ShouldReturnTrue_WhenTempOtpValidAndNotExpired() {
        // Arrange
        testUser.setTempOtp("789012");
        testUser.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        // Act
        boolean result = otpService.verifyTempOtp(testUser, "789012");

        // Assert
        assertTrue(result);
        assertNull(testUser.getTempOtp()); // Temp OTP should be cleared
        assertNull(testUser.getOtpExpiry()); // Expiry should be cleared
        // Note: Service doesn't save for temp OTP - caller is responsible
        verify(adminUserRepository, never()).save(any(AdminUser.class));
    }

    @Test
    void verifyTempOtp_ShouldReturnFalse_WhenTempOtpExpired() {
        // Arrange
        testUser.setTempOtp("789012");
        testUser.setOtpExpiry(LocalDateTime.now().minusMinutes(1)); // Expired

        // Act
        boolean result = otpService.verifyTempOtp(testUser, "789012");

        // Assert
        assertFalse(result);
        verify(adminUserRepository, never()).save(any(AdminUser.class));
    }

    @Test
    void verifyTempOtp_ShouldReturnFalse_WhenTempOtpIncorrect() {
        // Arrange
        testUser.setTempOtp("789012");
        testUser.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        // Act
        boolean result = otpService.verifyTempOtp(testUser, "210987"); // Wrong OTP

        // Assert
        assertFalse(result);
        assertNotNull(testUser.getTempOtp()); // Temp OTP should not be cleared
        verify(adminUserRepository, never()).save(any(AdminUser.class));
    }
}
