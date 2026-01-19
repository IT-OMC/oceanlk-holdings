package com.oceanlk.backend.model;

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

    private String username;
    private String password; // BCrypt hashed
    private String role; // ADMIN, SUPER_ADMIN

    private LocalDateTime createdDate;
    private LocalDateTime lastLoginDate;
    private boolean active;

    public AdminUser(String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.createdDate = LocalDateTime.now();
        this.active = true;
    }
}
