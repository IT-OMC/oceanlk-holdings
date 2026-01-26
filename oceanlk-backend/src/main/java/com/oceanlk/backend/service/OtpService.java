package com.oceanlk.backend.service;

import com.oceanlk.backend.model.AdminUser;
import com.oceanlk.backend.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final AdminUserRepository adminUserRepository;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    public String generateOtp(AdminUser user) {
        String otp = String.format("%06d", secureRandom.nextInt(1000000));
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10)); // 10 minutes expiry
        adminUserRepository.save(user);
        return otp;
    }

    public void sendOtp(AdminUser user, String method) {
        String otp = generateOtp(user);
        if ("email".equalsIgnoreCase(method)) {
            try {
                emailService.sendOtpEmail(user.getEmail(), otp, user.getUsername());
            } catch (Exception e) {
                throw new RuntimeException("Failed to send OTP email", e);
            }
        } else if ("phone".equalsIgnoreCase(method)) {
            // Placeholder for SMS integration
            System.out.println("OTP for " + user.getPhone() + ": " + otp);
        }
    }

    public String generateTempOtp(AdminUser user) {
        String otp = String.format("%06d", secureRandom.nextInt(1000000));
        user.setTempOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10)); // Shared expiry for simplicity
        adminUserRepository.save(user);
        return otp;
    }

    public void sendOtpToTarget(AdminUser user, String method, String target) {
        String otp = generateTempOtp(user);
        if ("email".equalsIgnoreCase(method)) {
            try {
                // We assume target is the new email address
                emailService.sendOtpEmail(target, otp, user.getUsername());
            } catch (Exception e) {
                throw new RuntimeException("Failed to send OTP to new email", e);
            }
        } else if ("phone".equalsIgnoreCase(method)) {
            // Placeholder for SMS integration to new phone
            System.out.println("OTP for new phone " + target + ": " + otp);
        }
    }

    public boolean verifyOtp(AdminUser user, String otp) {
        if (user.getOtp() == null || user.getOtpExpiry() == null) {
            return false;
        }

        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            return false;
        }

        boolean isValid = user.getOtp().equals(otp);
        if (isValid) {
            // Clear OTP after successful verification
            user.setOtp(null);
            user.setOtpExpiry(null);
            adminUserRepository.save(user);
        }
        return isValid;
    }

    public boolean verifyTempOtp(AdminUser user, String otp) {
        if (user.getTempOtp() == null || user.getOtpExpiry() == null) {
            return false;
        }

        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            return false;
        }

        boolean isValid = user.getTempOtp().equals(otp);
        if (isValid) {
            // Clear Temp OTP after successful verification
            user.setTempOtp(null);
            user.setOtpExpiry(null);
            // Note: Caller is responsible for saving user with new contact info
            // We don't save here to allow atomic update in controller
        }
        return isValid;
    }
}
