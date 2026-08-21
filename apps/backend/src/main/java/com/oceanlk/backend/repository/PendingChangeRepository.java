package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.PendingChange;
import com.oceanlk.backend.model.PendingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PendingChangeRepository extends JpaRepository<PendingChange, UUID> {

    List<PendingChange> findByStatus(PendingStatus status);

    List<PendingChange> findByEntityTypeAndStatus(String entityType, PendingStatus status);

    List<PendingChange> findBySubmittedByOrderBySubmittedAtDesc(UUID submittedBy);

    List<PendingChange> findBySubmittedByAndStatusOrderBySubmittedAtDesc(UUID submittedBy, PendingStatus status);

    Optional<PendingChange> findByEntityIdAndStatus(UUID entityId, PendingStatus status);

    List<PendingChange> findByStatusOrderBySubmittedAtDesc(PendingStatus status);
}
