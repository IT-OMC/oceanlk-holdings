package com.oceanlk.backend.service;

import com.oceanlk.backend.model.AuditLog;
import com.oceanlk.backend.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void logAction(String username, String action, String entityType, String entityId, String details) {
        AuditLog log = new AuditLog(username, action, entityType, entityId, details);
        auditLogRepository.save(log);
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }

    public List<AuditLog> getLogsByUser(String username) {
        return auditLogRepository.findByUsernameOrderByTimestampDesc(username);
    }

    public void deleteLog(String id) {
        auditLogRepository.deleteById(id);
    }
}
