package com.oceanlk.backend.service;

import com.oceanlk.backend.model.JobOpportunity;
import com.oceanlk.backend.repository.JobOpportunityRepository;
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
class JobOpportunityServiceTest {

    @Mock
    private JobOpportunityRepository jobOpportunityRepository;

    @InjectMocks
    private JobOpportunityService jobOpportunityService;

    private JobOpportunity testJob;

    @BeforeEach
    void setUp() {
        testJob = new JobOpportunity();
        testJob.setId("job-123");
        testJob.setTitle("Software Engineer");
        testJob.setCompany("OCEANLK");
        testJob.setLocation("Colombo");
        testJob.setStatus("ACTIVE");
    }

    @Test
    void getAllJobs_ShouldReturnAllJobs() {
        // Arrange
        List<JobOpportunity> jobs = Arrays.asList(testJob, new JobOpportunity());
        when(jobOpportunityRepository.findAll()).thenReturn(jobs);

        // Act
        List<JobOpportunity> result = jobOpportunityService.getAllJobs();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(jobOpportunityRepository, times(1)).findAll();
    }

    @Test
    void getActiveJobs_ShouldReturnOnlyActiveJobs() {
        // Arrange
        List<JobOpportunity> activeJobs = Arrays.asList(testJob);
        when(jobOpportunityRepository.findByStatus("ACTIVE")).thenReturn(activeJobs);

        // Act
        List<JobOpportunity> result = jobOpportunityService.getActiveJobs();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("ACTIVE", result.get(0).getStatus());
        verify(jobOpportunityRepository, times(1)).findByStatus("ACTIVE");
    }

    @Test
    void getJobById_ShouldReturnJob_WhenExists() {
        // Arrange
        when(jobOpportunityRepository.findById("job-123")).thenReturn(Optional.of(testJob));

        // Act
        Optional<JobOpportunity> result = jobOpportunityService.getJobById("job-123");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Software Engineer", result.get().getTitle());
        verify(jobOpportunityRepository, times(1)).findById("job-123");
    }

    @Test
    void createJob_ShouldSaveJob() {
        // Arrange
        when(jobOpportunityRepository.save(testJob)).thenReturn(testJob);

        // Act
        JobOpportunity result = jobOpportunityService.createJob(testJob);

        // Assert
        assertNotNull(result);
        assertEquals("Software Engineer", result.getTitle());
        verify(jobOpportunityRepository, times(1)).save(testJob);
    }

    @Test
    void updateJob_ShouldUpdateJob() {
        // Arrange
        JobOpportunity updates = new JobOpportunity();
        updates.setTitle("Senior Software Engineer");
        when(jobOpportunityRepository.findById("job-123")).thenReturn(Optional.of(testJob));
        when(jobOpportunityRepository.save(any(JobOpportunity.class))).thenReturn(testJob);

        // Act
        JobOpportunity result = jobOpportunityService.updateJob("job-123", updates);

        // Assert
        assertNotNull(result);
        verify(jobOpportunityRepository, times(1)).save(testJob);
    }

    @Test
    void deleteJob_ShouldCallRepository() {
        // Arrange
        doNothing().when(jobOpportunityRepository).deleteById("job-123");

        // Act
        jobOpportunityService.deleteJob("job-123");

        // Assert
        verify(jobOpportunityRepository, times(1)).deleteById("job-123");
    }
}
