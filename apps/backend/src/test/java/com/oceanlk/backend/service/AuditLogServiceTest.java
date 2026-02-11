package com.oceanlk.backend.service;

import com.oceanlk.backend.model.AuditLog;
import com.oceanlk.backend.repository.AuditLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuditLogServiceTest {

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private AuditLogService auditLogService;

    private AuditLog testLog;

    @BeforeEach
    void setUp() {
        testLog = new AuditLog("admin", "CREATE", "USER", "user-123", "Created user");
        testLog.setId("log-123");
        testLog.setTimestamp(LocalDateTime.now());
    }

    @Test
    void logAction_ShouldSaveLog() {
        // Arrange
        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(testLog);

        // Act
        auditLogService.logAction("admin", "CREATE", "USER", "user-123", "test details");

        // Assert
        verify(auditLogRepository, times(1)).save(any(AuditLog.class));
    }

    @Test
    void getRecentLogs_ShouldReturnTop10() {
        // Arrange
        List<AuditLog> logs = Arrays.asList(testLog);
        when(auditLogRepository.findTop10ByOrderByTimestampDesc()).thenReturn(logs);

        // Act
        List<AuditLog> result = auditLogService.getRecentLogs();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(auditLogRepository, times(1)).findTop10ByOrderByTimestampDesc();
    }

    @Test
    void getAllLogs_ShouldReturnAllLogs() {
        // Arrange
        List<AuditLog> logs = Arrays.asList(testLog);
        when(auditLogRepository.findAllByOrderByTimestampDesc()).thenReturn(logs);

        // Act
        List<AuditLog> result = auditLogService.getAllLogs();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(auditLogRepository, times(1)).findAllByOrderByTimestampDesc();
    }

    @Test
    void getLogsByUser_ShouldReturnUserLogs() {
        // Arrange
        List<AuditLog> logs = Arrays.asList(testLog);
        when(auditLogRepository.findByUsernameOrderByTimestampDesc("admin")).thenReturn(logs);

        // Act
        List<AuditLog> result = auditLogService.getLogsByUser("admin");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("admin", result.get(0).getUsername());
        verify(auditLogRepository, times(1)).findByUsernameOrderByTimestampDesc("admin");
    }

    @Test
    void exportLogs_ShouldReturnCsvString() {
        // Arrange
        List<AuditLog> logs = Arrays.asList(testLog);
        when(auditLogRepository.findAllByOrderByTimestampDesc()).thenReturn(logs);

        // Act
        String csv = auditLogService.exportLogs();

        // Assert
        assertNotNull(csv);
        assertTrue(csv.contains("Timestamp,User,Action,Entity Type,Entity ID,Details"));
        assertTrue(csv.contains("admin,CREATE,USER,user-123,Created user"));
        verify(auditLogRepository, times(1)).findAllByOrderByTimestampDesc();
    }

    @Test
    void exportLogs_ShouldEscapeSpecialCharacters() {
        // Arrange
        AuditLog complexLog = new AuditLog("admin", "UPDATE", "USER", "123", "Details, with comma");
        complexLog.setTimestamp(LocalDateTime.now());
        List<AuditLog> logs = Arrays.asList(complexLog);
        when(auditLogRepository.findAllByOrderByTimestampDesc()).thenReturn(logs);

        // Act
        String csv = auditLogService.exportLogs();

        // Assert
        assertTrue(csv.contains("\"Details, with comma\""));
    }

    @Test
    void deleteLog_ShouldCallRepository() {
        // Arrange
        doNothing().when(auditLogRepository).deleteById("log-123");

        // Act
        auditLogService.deleteLog("log-123");

        // Assert
        verify(auditLogRepository, times(1)).deleteById("log-123");
    }
}
