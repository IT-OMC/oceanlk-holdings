package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AuditLogRepository extends MongoRepository<AuditLog, String> {
    List<AuditLog> findAllByOrderByTimestampDesc();

    List<AuditLog> findByUsernameOrderByTimestampDesc(String username);

    List<AuditLog> findByEntityTypeOrderByTimestampDesc(String entityType);
}
