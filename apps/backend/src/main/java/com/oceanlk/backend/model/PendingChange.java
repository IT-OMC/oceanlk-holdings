package com.oceanlk.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "pending_changes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PendingChange {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String entityType; // "Event", "PageContent", "Company", etc.
    
    @Column(columnDefinition = "UUID")
    private UUID entityId; // ID of the entity (null for new entities)
    
    private String action; // "CREATE", "UPDATE", "DELETE"
    
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", columnDefinition = "pending_status")
    private PendingStatus status; // "PENDING", "APPROVED", "REJECTED"

    @Column(name = "submitted_by", columnDefinition = "UUID")
    private UUID submittedBy; // Admin ID
    private LocalDateTime submittedAt;

    @Column(name = "reviewed_by", columnDefinition = "UUID")
    private UUID reviewedBy; // Superadmin ID (null if pending)
    private LocalDateTime reviewedAt;

    @Column(columnDefinition = "TEXT")
    private String reviewComments; // Optional feedback from superadmin

    @Column(columnDefinition = "TEXT")
    private String changeData; // JSON string of the new/updated entity

    @Column(columnDefinition = "TEXT")
    private String originalData; // JSON string of original entity (for updates)

    public PendingChange(String entityType, UUID entityId, String action,
            UUID submittedBy, String changeData, String originalData) {
        this.entityType = entityType;
        this.entityId = entityId;
        this.action = action;
        this.status = PendingStatus.PENDING;
        this.submittedBy = submittedBy;
        this.submittedAt = LocalDateTime.now();
        this.changeData = changeData;
        this.originalData = originalData;
    }
}
