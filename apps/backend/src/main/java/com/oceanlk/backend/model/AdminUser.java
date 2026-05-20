package com.oceanlk.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUser {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
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

    @Column(columnDefinition = "TEXT")
    private String avatar;

    @ElementCollection
    @CollectionTable(name = "admin_user_email_preferences", joinColumns = @JoinColumn(name = "admin_user_id"))
    @MapKeyColumn(name = "preference_key")
    @Column(name = "preference_value")
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
