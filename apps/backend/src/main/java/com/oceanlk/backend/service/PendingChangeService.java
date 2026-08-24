package com.oceanlk.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.oceanlk.backend.model.PendingChange;
import com.oceanlk.backend.repository.PendingChangeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.oceanlk.backend.model.AdminUser;
import com.oceanlk.backend.model.PendingStatus;
import com.oceanlk.backend.repository.AdminUserRepository;
import jakarta.persistence.EntityNotFoundException;

@Service
@RequiredArgsConstructor
public class PendingChangeService {

    private final PendingChangeRepository pendingChangeRepository;
    private final NotificationService notificationService;
    private final AdminUserRepository adminUserRepository;
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    /**
     * Create a new pending change
     */
    public PendingChange createPendingChange(String entityType, String entityId, String action,
            String submittedBy, Object changeData, Object originalData) {
        try {
            AdminUser admin = adminUserRepository.findByUsername(submittedBy)
                .orElseThrow(() -> new EntityNotFoundException("Admin not found: " + submittedBy));

            String changeDataJson = objectMapper.writeValueAsString(changeData);
            String originalDataJson = originalData != null ? objectMapper.writeValueAsString(originalData) : null;
            
            UUID entityUuid = entityId != null ? UUID.fromString(entityId) : null;
            UUID submittedUuid = UUID.fromString(admin.getId());

            PendingChange pendingChange = new PendingChange(
                    entityType, entityUuid, action, submittedUuid, changeDataJson, originalDataJson);

            PendingChange saved = pendingChangeRepository.save(pendingChange);

            // Create Notification for Super Admin
            notificationService.createNotification(
                    "Pending Change Request",
                    "A new " + saved.getEntityType() + " change requires approval.",
                    "WARNING",
                    "ROLE_SUPER_ADMIN",
                    "/admin/pending-changes");

            return saved;
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing change data", e);
        }
    }

    /**
     * Create an automatically approved change for Super Admin history tracking
     */
    public PendingChange createApprovedChange(String entityType, String entityId, String action,
            String submittedBy, Object changeData, Object originalData) {
        try {
            AdminUser admin = adminUserRepository.findByUsername(submittedBy)
                .orElseThrow(() -> new EntityNotFoundException("Admin not found: " + submittedBy));

            String changeDataJson = objectMapper.writeValueAsString(changeData);
            String originalDataJson = originalData != null ? objectMapper.writeValueAsString(originalData) : null;

            UUID entityUuid = entityId != null ? UUID.fromString(entityId) : null;
            UUID submittedUuid = UUID.fromString(admin.getId());

            PendingChange pendingChange = new PendingChange(
                    entityType, entityUuid, action, submittedUuid, changeDataJson, originalDataJson);

            pendingChange.setStatus(PendingStatus.APPROVED);
            pendingChange.setReviewedBy(submittedUuid);
            pendingChange.setReviewedAt(LocalDateTime.now());
            pendingChange.setReviewComments("Automatically approved for Super Admin");

            PendingChange saved = pendingChangeRepository.save(pendingChange);

            // Notify other Super Admins about this direct action
            notificationService.createNotification(
                    "Super Admin Action",
                    submittedBy + " performed a " + action + " on " + entityType,
                    "INFO",
                    "ROLE_SUPER_ADMIN",
                    null, // No specific link for approved changes usually, but could be added
                    submittedBy // Exclude the person who did it
            );

            return saved;
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing change data", e);
        }
    }

    /**
     * Get all pending changes with PENDING status
     */
    public List<PendingChange> getAllPendingChanges() {
        return pendingChangeRepository.findByStatusOrderBySubmittedAtDesc(PendingStatus.PENDING);
    }

    /**
     * Get pending changes by entity type
     */
    public List<PendingChange> getPendingChangesByEntityType(String entityType) {
        return pendingChangeRepository.findByEntityTypeAndStatus(entityType, PendingStatus.PENDING);
    }

    /**
     * Get all pending changes submitted by a specific admin
     */
    public List<PendingChange> getPendingChangesForAdmin(String username) {
        AdminUser admin = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Admin not found: " + username));
        return pendingChangeRepository.findBySubmittedByOrderBySubmittedAtDesc(UUID.fromString(admin.getId()));
    }

    /**
     * Get pending changes for a specific admin with specific status
     */
    public List<PendingChange> getPendingChangesForAdminByStatus(String username, String status) {
        AdminUser admin = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Admin not found: " + username));
        return pendingChangeRepository.findBySubmittedByAndStatusOrderBySubmittedAtDesc(UUID.fromString(admin.getId()), PendingStatus.valueOf(status.toUpperCase()));
    }

    /**
     * Get a specific pending change by ID
     */
    public Optional<PendingChange> getPendingChangeById(String id) {
        return pendingChangeRepository.findById(UUID.fromString(id));
    }

    /**
     * Check if there's already a pending change for an entity
     */
    public boolean hasPendingChange(String entityId) {
        return pendingChangeRepository.findByEntityIdAndStatus(UUID.fromString(entityId), PendingStatus.PENDING).isPresent();
    }

    /**
     * Approve a pending change
     */
    public PendingChange approvePendingChange(String id, String reviewedBy, String comments) {
        Optional<PendingChange> optionalChange = pendingChangeRepository.findById(UUID.fromString(id));

        if (optionalChange.isEmpty()) {
            throw new RuntimeException("Pending change not found");
        }

        PendingChange pendingChange = optionalChange.get();

        if (pendingChange.getStatus() != PendingStatus.PENDING) {
            throw new RuntimeException("Change has already been reviewed");
        }

        AdminUser reviewer = adminUserRepository.findByUsername(reviewedBy)
                .orElseThrow(() -> new EntityNotFoundException("Reviewer not found: " + reviewedBy));

        pendingChange.setStatus(PendingStatus.APPROVED);
        pendingChange.setReviewedBy(UUID.fromString(reviewer.getId()));
        pendingChange.setReviewedAt(LocalDateTime.now());
        pendingChange.setReviewComments(comments);

        return pendingChangeRepository.save(pendingChange);
    }

    /**
     * Reject a pending change
     */
    public PendingChange rejectPendingChange(String id, String reviewedBy, String comments) {
        Optional<PendingChange> optionalChange = pendingChangeRepository.findById(UUID.fromString(id));

        if (optionalChange.isEmpty()) {
            throw new RuntimeException("Pending change not found");
        }

        PendingChange pendingChange = optionalChange.get();

        if (pendingChange.getStatus() != PendingStatus.PENDING) {
            throw new RuntimeException("Change has already been reviewed");
        }

        AdminUser reviewer = adminUserRepository.findByUsername(reviewedBy)
                .orElseThrow(() -> new EntityNotFoundException("Reviewer not found: " + reviewedBy));

        pendingChange.setStatus(PendingStatus.REJECTED);
        pendingChange.setReviewedBy(UUID.fromString(reviewer.getId()));
        pendingChange.setReviewedAt(LocalDateTime.now());
        pendingChange.setReviewComments(comments);

        return pendingChangeRepository.save(pendingChange);
    }

    /**
     * Parse change data JSON to a specific class
     */
    public <T> T parseChangeData(String changeDataJson, Class<T> clazz) {
        try {
            return objectMapper.readValue(changeDataJson, clazz);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error parsing change data", e);
        }
    }

    /**
     * Delete a pending change
     */
    public void deletePendingChange(String id) {
        pendingChangeRepository.deleteById(UUID.fromString(id));
    }
}
