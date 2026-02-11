package com.oceanlk.backend.service;

import com.oceanlk.backend.model.PendingChange;
import com.oceanlk.backend.repository.PendingChangeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PendingChangeServiceTest {

    @Mock
    private PendingChangeRepository pendingChangeRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private PendingChangeService pendingChangeService;

    private PendingChange testChange;

    @BeforeEach
    void setUp() {
        testChange = new PendingChange();
        testChange.setId("change-123");
        testChange.setEntityType("USER");
        testChange.setEntityId("user-123");
        testChange.setAction("UPDATE");
        testChange.setStatus("PENDING");
        testChange.setSubmittedBy("admin");
        testChange.setChangeData("{\"name\":\"Test\"}");
    }

    @Test
    void createPendingChange_ShouldSaveAndNotify() {
        // Arrange
        when(pendingChangeRepository.save(any(PendingChange.class))).thenReturn(testChange);
        doNothing().when(notificationService).createNotification(anyString(), anyString(), anyString(), anyString(),
                anyString());

        // Act
        PendingChange result = pendingChangeService.createPendingChange(
                "USER", "user-123", "UPDATE", "admin", java.util.Collections.singletonMap("key", "value"), null);

        // Assert
        assertNotNull(result);
        verify(pendingChangeRepository, times(1)).save(any(PendingChange.class));
        verify(notificationService, times(1)).createNotification(anyString(), anyString(), anyString(), anyString(),
                anyString());
    }

    @Test
    void createApprovedChange_ShouldSaveApproved() {
        // Arrange
        when(pendingChangeRepository.save(any(PendingChange.class))).thenReturn(testChange);

        // Act
        PendingChange result = pendingChangeService.createApprovedChange(
                "USER", "user-123", "UPDATE", "admin", java.util.Collections.singletonMap("key", "value"), null);

        // Assert
        assertNotNull(result);
        verify(pendingChangeRepository, times(1)).save(any(PendingChange.class));
        verify(notificationService, times(1)).createNotification(
                anyString(), anyString(), anyString(), anyString(), any(), anyString());
    }

    @Test
    void getAllPendingChanges_ShouldReturnPending() {
        // Arrange
        List<PendingChange> changes = Arrays.asList(testChange);
        when(pendingChangeRepository.findByStatusOrderBySubmittedAtDesc("PENDING")).thenReturn(changes);

        // Act
        List<PendingChange> result = pendingChangeService.getAllPendingChanges();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(pendingChangeRepository, times(1)).findByStatusOrderBySubmittedAtDesc("PENDING");
    }

    @Test
    void approvePendingChange_ShouldUpdateStatus() {
        // Arrange
        when(pendingChangeRepository.findById("change-123")).thenReturn(Optional.of(testChange));
        when(pendingChangeRepository.save(any(PendingChange.class))).thenReturn(testChange);

        // Act
        PendingChange result = pendingChangeService.approvePendingChange("change-123", "reviewer", "Approved");

        // Assert
        assertEquals("APPROVED", testChange.getStatus());
        assertEquals("reviewer", testChange.getReviewedBy());
        assertEquals("Approved", testChange.getReviewComments());
        assertNotNull(testChange.getReviewedAt());
        verify(pendingChangeRepository, times(1)).save(testChange);
    }

    @Test
    void approvePendingChange_ShouldThrowException_WhenAlreadyReviewed() {
        // Arrange
        testChange.setStatus("APPROVED");
        when(pendingChangeRepository.findById("change-123")).thenReturn(Optional.of(testChange));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            pendingChangeService.approvePendingChange("change-123", "reviewer", "Approved");
        });

        verify(pendingChangeRepository, never()).save(any(PendingChange.class));
    }

    @Test
    void rejectPendingChange_ShouldUpdateStatus() {
        // Arrange
        when(pendingChangeRepository.findById("change-123")).thenReturn(Optional.of(testChange));
        when(pendingChangeRepository.save(any(PendingChange.class))).thenReturn(testChange);

        // Act
        PendingChange result = pendingChangeService.rejectPendingChange("change-123", "reviewer", "Rejected");

        // Assert
        assertEquals("REJECTED", testChange.getStatus());
        assertEquals("reviewer", testChange.getReviewedBy());
        verify(pendingChangeRepository, times(1)).save(testChange);
    }

    @Test
    void deletePendingChange_ShouldCallRepository() {
        // Arrange
        doNothing().when(pendingChangeRepository).deleteById("change-123");

        // Act
        pendingChangeService.deletePendingChange("change-123");

        // Assert
        verify(pendingChangeRepository, times(1)).deleteById("change-123");
    }
}
