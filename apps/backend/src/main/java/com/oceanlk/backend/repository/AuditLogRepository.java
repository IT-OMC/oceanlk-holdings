package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, String> {
    List<AuditLog> findAllByOrderByTimestampDesc();

    List<AuditLog> findTop10ByOrderByTimestampDesc();

    List<AuditLog> findByUsernameOrderByTimestampDesc(String username);

    List<AuditLog> findByEntityTypeOrderByTimestampDesc(String entityType);
}
