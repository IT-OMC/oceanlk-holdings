package com.oceanlk.backend.service;

import com.oceanlk.backend.model.TalentPoolApplication;
import com.oceanlk.backend.repository.TalentPoolApplicationRepository;
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
class TalentPoolServiceTest {

    @Mock
    private TalentPoolApplicationRepository talentPoolApplicationRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private TalentPoolService talentPoolService;

    private TalentPoolApplication testApplication;

    @BeforeEach
    void setUp() {
        testApplication = new TalentPoolApplication();
        testApplication.setId("app-123");
        testApplication.setFullName("Jane Doe");
        testApplication.setEmail("jane@example.com");
        testApplication.setPhone("+94771234567");
        testApplication.setStatus("PENDING");
    }

    @Test
    void getAllApplications_ShouldReturnAllApplications() {
        // Arrange
        List<TalentPoolApplication> applications = Arrays.asList(testApplication, new TalentPoolApplication());
        when(talentPoolApplicationRepository.findAll()).thenReturn(applications);

        // Act
        List<TalentPoolApplication> result = talentPoolService.getAllApplications();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(talentPoolApplicationRepository, times(1)).findAll();
    }

    @Test
    void getApplicationsByStatus_ShouldFilterByStatus() {
        // Arrange
        List<TalentPoolApplication> pendingApps = Arrays.asList(testApplication);
        when(talentPoolApplicationRepository.findByStatus("PENDING")).thenReturn(pendingApps);

        // Act
        List<TalentPoolApplication> result = talentPoolService.getApplicationsByStatus("PENDING");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("PENDING", result.get(0).getStatus());
        verify(talentPoolApplicationRepository, times(1)).findByStatus("PENDING");
    }

    @Test
    void getApplicationById_ShouldReturnApplication_WhenExists() {
        // Arrange
        when(talentPoolApplicationRepository.findById("app-123")).thenReturn(Optional.of(testApplication));

        // Act
        Optional<TalentPoolApplication> result = talentPoolService.getApplicationById("app-123");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Jane Doe", result.get().getFullName());
        verify(talentPoolApplicationRepository, times(1)).findById("app-123");
    }

    @Test
    void createApplication_ShouldSaveAndSendEmails() throws Exception {
        // Arrange
        when(talentPoolApplicationRepository.save(testApplication)).thenReturn(testApplication);
        doNothing().when(emailService).sendApplicantConfirmation(any(TalentPoolApplication.class));
        doNothing().when(emailService).sendHRNotification(any(TalentPoolApplication.class));

        // Act
        TalentPoolApplication result = talentPoolService.createApplication(testApplication);

        // Assert
        assertNotNull(result);
        verify(talentPoolApplicationRepository, times(1)).save(testApplication);
        verify(emailService, times(1)).sendApplicantConfirmation(testApplication);
        verify(emailService, times(1)).sendHRNotification(testApplication);
    }

    @Test
    void createApplication_ShouldSave_EvenIfEmailFails() throws Exception {
        // Arrange
        when(talentPoolApplicationRepository.save(testApplication)).thenReturn(testApplication);
        doThrow(new RuntimeException("Email service error"))
                .when(emailService).sendApplicantConfirmation(any(TalentPoolApplication.class));

        // Act
        TalentPoolApplication result = talentPoolService.createApplication(testApplication);

        // Assert
        assertNotNull(result);
        verify(talentPoolApplicationRepository, times(1)).save(testApplication);
    }

    @Test
    void updateApplicationStatus_ShouldUpdateStatus() {
        // Arrange
        when(talentPoolApplicationRepository.findById("app-123")).thenReturn(Optional.of(testApplication));
        when(talentPoolApplicationRepository.save(any(TalentPoolApplication.class))).thenReturn(testApplication);

        // Act
        TalentPoolApplication result = talentPoolService.updateApplicationStatus("app-123", "APPROVED");

        // Assert
        assertNotNull(result);
        assertEquals("APPROVED", testApplication.getStatus());
        verify(talentPoolApplicationRepository, times(1)).save(testApplication);
    }

    @Test
    void updateApplicationStatus_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(talentPoolApplicationRepository.findById("non-existent")).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            talentPoolService.updateApplicationStatus("non-existent", "APPROVED");
        });

        assertTrue(exception.getMessage().contains("Application not found"));
        verify(talentPoolApplicationRepository, never()).save(any(TalentPoolApplication.class));
    }

    @Test
    void deleteApplication_ShouldCallRepository() {
        // Arrange
        doNothing().when(talentPoolApplicationRepository).deleteById("app-123");

        // Act
        talentPoolService.deleteApplication("app-123");

        // Assert
        verify(talentPoolApplicationRepository, times(1)).deleteById("app-123");
    }
}
