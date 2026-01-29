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

@Service
@RequiredArgsConstructor
public class PendingChangeService {

    private final PendingChangeRepository pendingChangeRepository;
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    /**
     * Create a new pending change
     */
    public PendingChange createPendingChange(String entityType, String entityId, String action,
            String submittedBy, Object changeData, Object originalData) {
        try {
            String changeDataJson = objectMapper.writeValueAsString(changeData);
            String originalDataJson = originalData != null ? objectMapper.writeValueAsString(originalData) : null;

            PendingChange pendingChange = new PendingChange(
                    entityType, entityId, action, submittedBy, changeDataJson, originalDataJson);

            return pendingChangeRepository.save(pendingChange);
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
            String changeDataJson = objectMapper.writeValueAsString(changeData);
            String originalDataJson = originalData != null ? objectMapper.writeValueAsString(originalData) : null;

            PendingChange pendingChange = new PendingChange(
                    entityType, entityId, action, submittedBy, changeDataJson, originalDataJson);

            pendingChange.setStatus("APPROVED");
            pendingChange.setReviewedBy(submittedBy);
            pendingChange.setReviewedAt(LocalDateTime.now());
            pendingChange.setReviewComments("Automatically approved for Super Admin");

            return pendingChangeRepository.save(pendingChange);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error serializing change data", e);
        }
    }

    /**
     * Get all pending changes with PENDING status
     */
    public List<PendingChange> getAllPendingChanges() {
        return pendingChangeRepository.findByStatusOrderBySubmittedAtDesc("PENDING");
    }

    /**
     * Get pending changes by entity type
     */
    public List<PendingChange> getPendingChangesByEntityType(String entityType) {
        return pendingChangeRepository.findByEntityTypeAndStatus(entityType, "PENDING");
    }

    /**
     * Get all pending changes submitted by a specific admin
     */
    public List<PendingChange> getPendingChangesForAdmin(String username) {
        return pendingChangeRepository.findBySubmittedBy(username);
    }

    /**
     * Get pending changes for a specific admin with specific status
     */
    public List<PendingChange> getPendingChangesForAdminByStatus(String username, String status) {
        return pendingChangeRepository.findBySubmittedByAndStatus(username, status);
    }

    /**
     * Get a specific pending change by ID
     */
    public Optional<PendingChange> getPendingChangeById(String id) {
        return pendingChangeRepository.findById(id);
    }

    /**
     * Check if there's already a pending change for an entity
     */
    public boolean hasPendingChange(String entityId) {
        return pendingChangeRepository.findByEntityIdAndStatus(entityId, "PENDING").isPresent();
    }

    /**
     * Approve a pending change
     */
    public PendingChange approvePendingChange(String id, String reviewedBy, String comments) {
        Optional<PendingChange> optionalChange = pendingChangeRepository.findById(id);

        if (optionalChange.isEmpty()) {
            throw new RuntimeException("Pending change not found");
        }

        PendingChange pendingChange = optionalChange.get();

        if (!"PENDING".equals(pendingChange.getStatus())) {
            throw new RuntimeException("Change has already been reviewed");
        }

        pendingChange.setStatus("APPROVED");
        pendingChange.setReviewedBy(reviewedBy);
        pendingChange.setReviewedAt(LocalDateTime.now());
        pendingChange.setReviewComments(comments);

        return pendingChangeRepository.save(pendingChange);
    }

    /**
     * Reject a pending change
     */
    public PendingChange rejectPendingChange(String id, String reviewedBy, String comments) {
        Optional<PendingChange> optionalChange = pendingChangeRepository.findById(id);

        if (optionalChange.isEmpty()) {
            throw new RuntimeException("Pending change not found");
        }

        PendingChange pendingChange = optionalChange.get();

        if (!"PENDING".equals(pendingChange.getStatus())) {
            throw new RuntimeException("Change has already been reviewed");
        }

        pendingChange.setStatus("REJECTED");
        pendingChange.setReviewedBy(reviewedBy);
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
        pendingChangeRepository.deleteById(id);
    }
}
