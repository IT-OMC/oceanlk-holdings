package com.oceanlk.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "pending_changes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PendingChange {

    @Id
    private String id;

    private String entityType; // "Event", "PageContent", "Company", etc.
    private String entityId; // ID of the entity (null for new entities)
    private String action; // "CREATE", "UPDATE", "DELETE"
    private String status; // "PENDING", "APPROVED", "REJECTED"

    private String submittedBy; // Admin username
    private LocalDateTime submittedAt;

    private String reviewedBy; // Superadmin username (null if pending)
    private LocalDateTime reviewedAt;
    private String reviewComments; // Optional feedback from superadmin

    private String changeData; // JSON string of the new/updated entity
    private String originalData; // JSON string of original entity (for updates)

    public PendingChange(String entityType, String entityId, String action,
            String submittedBy, String changeData, String originalData) {
        this.entityType = entityType;
        this.entityId = entityId;
        this.action = action;
        this.status = "PENDING";
        this.submittedBy = submittedBy;
        this.submittedAt = LocalDateTime.now();
        this.changeData = changeData;
        this.originalData = originalData;
    }
}
