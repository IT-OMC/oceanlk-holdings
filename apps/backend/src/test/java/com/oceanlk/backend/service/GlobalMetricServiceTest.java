package com.oceanlk.backend.service;

import com.oceanlk.backend.model.GlobalMetric;
import com.oceanlk.backend.repository.GlobalMetricRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GlobalMetricServiceTest {

    @Mock
    private GlobalMetricRepository globalMetricRepository;

    @InjectMocks
    private GlobalMetricService globalMetricService;

    private GlobalMetric testMetric;

    @BeforeEach
    void setUp() {
        testMetric = new GlobalMetric();
        testMetric.setId("metric-123");
        testMetric.setLabel("Total Users");
        testMetric.setValue("1000+");
        testMetric.setIcon("users");
        testMetric.setDisplayOrder(1);
    }

    @Test
    void getAllMetrics_ShouldReturnAllMetrics() {
        // Arrange
        List<GlobalMetric> metrics = Arrays.asList(testMetric, new GlobalMetric());
        when(globalMetricRepository.findAll()).thenReturn(metrics);

        // Act
        List<GlobalMetric> result = globalMetricService.getAllMetrics();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(globalMetricRepository, times(1)).findAll();
    }

    @Test
    void getMetricById_ShouldReturnMetric_WhenExists() {
        // Arrange
        when(globalMetricRepository.findById("metric-123")).thenReturn(Optional.of(testMetric));

        // Act
        Optional<GlobalMetric> result = globalMetricService.getMetricById("metric-123");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Total Users", result.get().getLabel());
        verify(globalMetricRepository, times(1)).findById("metric-123");
    }

    @Test
    void createMetric_ShouldSaveMetric() {
        // Arrange
        when(globalMetricRepository.save(testMetric)).thenReturn(testMetric);

        // Act
        GlobalMetric result = globalMetricService.createMetric(testMetric);

        // Assert
        assertNotNull(result);
        assertEquals("Total Users", result.getLabel());
        verify(globalMetricRepository, times(1)).save(testMetric);
    }

    @Test
    void updateMetric_ShouldUpdateMetric() {
        // Arrange
        GlobalMetric updates = new GlobalMetric();
        updates.setLabel("Active Users");
        updates.setValue("500+");

        when(globalMetricRepository.findById("metric-123")).thenReturn(Optional.of(testMetric));
        when(globalMetricRepository.save(any(GlobalMetric.class))).thenReturn(testMetric);

        // Act
        GlobalMetric result = globalMetricService.updateMetric("metric-123", updates);

        // Assert
        assertNotNull(result);
        assertEquals("Active Users", testMetric.getLabel());
        assertEquals("500+", testMetric.getValue());
        verify(globalMetricRepository, times(1)).save(testMetric);
    }

    @Test
    void updateMetric_ShouldThrowException_WhenNotFound() {
        // Arrange
        GlobalMetric updates = new GlobalMetric();
        when(globalMetricRepository.findById("non-existent")).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            globalMetricService.updateMetric("non-existent", updates);
        });

        assertTrue(exception.getMessage().contains("Metric not found"));
        verify(globalMetricRepository, never()).save(any(GlobalMetric.class));
    }

    @Test
    void deleteMetric_ShouldCallRepository() {
        // Arrange
        doNothing().when(globalMetricRepository).deleteById("metric-123");

        // Act
        globalMetricService.deleteMetric("metric-123");

        // Assert
        verify(globalMetricRepository, times(1)).deleteById("metric-123");
    }
}
