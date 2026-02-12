package com.oceanlk.backend.service;

import com.oceanlk.backend.model.AdminUser;
import com.oceanlk.backend.repository.AdminUserRepository;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OtpServiceTest {

    @Mock
    private AdminUserRepository adminUserRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private OtpService otpService;

    private AdminUser user;

    @BeforeEach
    void setUp() {
        user = new AdminUser();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
    }

    @Test
    void generateOtp_ShouldSetOtpAndExpiry() {
        String otp = otpService.generateOtp(user);

        assertNotNull(otp);
        assertEquals(6, otp.length());
        assertEquals(otp, user.getOtp());
        assertNotNull(user.getOtpExpiry());
        assertTrue(user.getOtpExpiry().isAfter(LocalDateTime.now()));
        verify(adminUserRepository).save(user);
    }

    @Test
    void sendOtp_EmailMethod_ShouldCallEmailService() throws MessagingException {
        otpService.sendOtp(user, "email");

        verify(emailService).sendOtpEmail(eq(user.getEmail()), anyString(), eq(user.getUsername()));
        verify(adminUserRepository).save(user);
    }

    @Test
    void verifyOtp_ValidOtp_ShouldReturnTrueAndClearOtp() {
        user.setOtp("123456");
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));

        boolean result = otpService.verifyOtp(user, "123456");

        assertTrue(result);
        assertNull(user.getOtp());
        assertNull(user.getOtpExpiry());
        verify(adminUserRepository).save(user);
    }

    @Test
    void verifyOtp_ExpiredOtp_ShouldReturnFalse() {
        user.setOtp("123456");
        user.setOtpExpiry(LocalDateTime.now().minusMinutes(1));

        boolean result = otpService.verifyOtp(user, "123456");

        assertFalse(result);
        assertNotNull(user.getOtp());
        verify(adminUserRepository, never()).save(any());
    }

    @Test
    void verifyOtp_InvalidOtp_ShouldReturnFalse() {
        user.setOtp("123456");
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));

        boolean result = otpService.verifyOtp(user, "654321");

        assertFalse(result);
        assertNotNull(user.getOtp());
        verify(adminUserRepository, never()).save(any());
    }
}
