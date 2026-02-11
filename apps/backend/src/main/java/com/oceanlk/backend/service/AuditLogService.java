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

    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop10ByOrderByTimestampDesc();
    }

    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }

    public String exportLogs() {
        List<AuditLog> logs = auditLogRepository.findAllByOrderByTimestampDesc();
        StringBuilder csv = new StringBuilder();
        csv.append("Timestamp,User,Action,Entity Type,Entity ID,Details\n");

        for (AuditLog log : logs) {
            csv.append(escapeSpecialCharacters(log.getTimestamp().toString())).append(",");
            csv.append(escapeSpecialCharacters(log.getUsername())).append(",");
            csv.append(escapeSpecialCharacters(log.getAction())).append(",");
            csv.append(escapeSpecialCharacters(log.getEntityType())).append(",");
            csv.append(escapeSpecialCharacters(log.getEntityId())).append(",");
            csv.append(escapeSpecialCharacters(log.getDetails())).append("\n");
        }
        return csv.toString();
    }

    private String escapeSpecialCharacters(String data) {
        if (data == null)
            return "";
        String escapedData = data.replaceAll("\\R", " ");
        if (data.contains(",") || data.contains("\"") || data.contains("'")) {
            data = data.replace("\"", "\"\"");
            escapedData = "\"" + data + "\"";
        }
        return escapedData;
    }

    public List<AuditLog> getLogsByUser(String username) {
        return auditLogRepository.findByUsernameOrderByTimestampDesc(username);
    }

    public void deleteLog(String id) {
        auditLogRepository.deleteById(id);
    }
}
