package com.oceanlk.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    private String id;
    private String title;
    private String message;
    private String type; // "INFO", "WARNING", "ERROR", "SUCCESS"
    private boolean isRead;
    private LocalDateTime createdAt;
    private String link; // Optional URL (e.g., "/admin/approvals")
    private String recipientRole; // "ROLE_ADMIN", "ROLE_SUPER_ADMIN"
    private String recipientId; // Optional: target a specific admin
    private String relatedEntity;
    private String relatedId;

    public Notification(String title, String message, String type, String recipientRole, String link) {
        this.title = title;
        this.message = message;
        this.type = type;
        this.recipientRole = recipientRole;
        this.link = link;
        this.isRead = false;
        this.createdAt = LocalDateTime.now();
    }
}
