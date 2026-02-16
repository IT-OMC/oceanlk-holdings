package com.oceanlk.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "admin_users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUser {

    @Id
    private String id;

    private String name;
    private String username;

    @JsonIgnore
    private String password;

    private String email;
    private String phone;
    private String role;
    private LocalDateTime createdDate;
    private LocalDateTime lastLoginDate;
    private boolean active;
    private boolean verified;
    private String avatar;
    private java.util.Map<String, Boolean> emailPreferences;

    // OTP fields
    @JsonIgnore
    private String otp;

    private LocalDateTime otpExpiry;

    // Temporary fields for contact update verification
    private String tempEmail;
    private String tempPhone;

    @JsonIgnore
    private String tempOtp;

    public AdminUser(String name, String username, String password, String email, String phone, String role) {
        this.name = name;
        this.username = username;
        this.password = password;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.createdDate = LocalDateTime.now();
        this.active = true;
        this.verified = false;
    }
}
