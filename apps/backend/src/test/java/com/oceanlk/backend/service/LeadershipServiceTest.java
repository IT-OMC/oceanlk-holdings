package com.oceanlk.backend.service;

import com.oceanlk.backend.model.CorporateLeader;
import com.oceanlk.backend.repository.CorporateLeaderRepository;
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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LeadershipServiceTest {

    @Mock
    private CorporateLeaderRepository corporateLeaderRepository;

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private LeadershipService leadershipService;

    private CorporateLeader testLeader;

    @BeforeEach
    void setUp() {
        testLeader = new CorporateLeader();
        testLeader.setId("leader-123");
        testLeader.setName("John Doe");
        testLeader.setPosition("CEO");
        testLeader.setDepartment("Executive");
        testLeader.setImage("https://example.com/leader.jpg");
        testLeader.setDisplayOrder(1);
    }

    @Test
    void getAllLeaders_ShouldReturnLeadersOrderedByDisplayOrder() {
        // Arrange
        List<CorporateLeader> leaders = Arrays.asList(testLeader, new CorporateLeader());
        when(corporateLeaderRepository.findAllByOrderByDisplayOrderAsc()).thenReturn(leaders);

        // Act
        List<CorporateLeader> result = leadershipService.getAllLeaders();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(corporateLeaderRepository, times(1)).findAllByOrderByDisplayOrderAsc();
    }

    @Test
    void getLeadersByDepartment_ShouldFilterByDepartment() {
        // Arrange
        List<CorporateLeader> executiveLeaders = Arrays.asList(testLeader);
        when(corporateLeaderRepository.findByDepartmentOrderByDisplayOrderAsc("Executive"))
                .thenReturn(executiveLeaders);

        // Act
        List<CorporateLeader> result = leadershipService.getLeadersByDepartment("Executive");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Executive", result.get(0).getDepartment());
        verify(corporateLeaderRepository, times(1)).findByDepartmentOrderByDisplayOrderAsc("Executive");
    }

    @Test
    void getLeaderById_ShouldReturnLeader_WhenExists() {
        // Arrange
        when(corporateLeaderRepository.findById("leader-123")).thenReturn(Optional.of(testLeader));

        // Act
        Optional<CorporateLeader> result = leadershipService.getLeaderById("leader-123");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("John Doe", result.get().getName());
        verify(corporateLeaderRepository, times(1)).findById("leader-123");
    }

    @Test
    void createLeader_ShouldSaveLeader() {
        // Arrange
        when(corporateLeaderRepository.save(testLeader)).thenReturn(testLeader);

        // Act
        CorporateLeader result = leadershipService.createLeader(testLeader);

        // Assert
        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        verify(corporateLeaderRepository, times(1)).save(testLeader);
    }

    @Test
    void updateLeader_ShouldUpdateLeaderAndDeleteOldImage() {
        // Arrange
        CorporateLeader updates = new CorporateLeader();
        updates.setName("Jane Doe");
        updates.setImage("https://example.com/new-leader.jpg");
        when(corporateLeaderRepository.findById("leader-123")).thenReturn(Optional.of(testLeader));
        when(corporateLeaderRepository.save(any(CorporateLeader.class))).thenReturn(testLeader);
        doNothing().when(fileStorageService).deleteFile(anyString());

        // Act
        CorporateLeader result = leadershipService.updateLeader("leader-123", updates);

        // Assert
        assertNotNull(result);
        verify(fileStorageService, times(1)).deleteFile("https://example.com/leader.jpg");
        verify(corporateLeaderRepository, times(1)).save(testLeader);
    }

    @Test
    void deleteLeader_ShouldDeleteLeaderAndImage() {
        // Arrange
        when(corporateLeaderRepository.findById("leader-123")).thenReturn(Optional.of(testLeader));
        doNothing().when(fileStorageService).deleteFile(anyString());
        doNothing().when(corporateLeaderRepository).deleteById(anyString());

        // Act
        leadershipService.deleteLeader("leader-123");

        // Assert
        verify(fileStorageService, times(1)).deleteFile("https://example.com/leader.jpg");
        verify(corporateLeaderRepository, times(1)).deleteById("leader-123");
    }
}
