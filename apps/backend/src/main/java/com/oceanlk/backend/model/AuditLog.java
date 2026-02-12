package com.oceanlk.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    @Id
    private String id;

    private String username; // The admin who performed the action
    private String action; // CREATE, UPDATE, DELETE, LOGIN
    private String entityType; // JobOpportunity, MediaItem, etc.
    private String entityId; // ID of the affected entity
    private String details; // Optional description or change diff

    private LocalDateTime timestamp;

    public AuditLog(String username, String action, String entityType, String entityId, String details) {
        this.username = username;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }
}
