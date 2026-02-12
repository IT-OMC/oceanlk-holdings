package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.PendingChange;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PendingChangeRepository extends MongoRepository<PendingChange, String> {

    List<PendingChange> findByStatus(String status);

    List<PendingChange> findByEntityTypeAndStatus(String entityType, String status);

    List<PendingChange> findBySubmittedByOrderBySubmittedAtDesc(String username);

    List<PendingChange> findBySubmittedByIgnoreCaseOrderBySubmittedAtDesc(String username);

    List<PendingChange> findBySubmittedByAndStatusOrderBySubmittedAtDesc(String username, String status);

    List<PendingChange> findBySubmittedByIgnoreCaseAndStatusOrderBySubmittedAtDesc(String username, String status);

    Optional<PendingChange> findByEntityIdAndStatus(String entityId, String status);

    List<PendingChange> findByStatusOrderBySubmittedAtDesc(String status);
}
