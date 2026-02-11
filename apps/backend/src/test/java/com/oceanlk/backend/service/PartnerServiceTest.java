package com.oceanlk.backend.service;

import com.oceanlk.backend.model.Partner;
import com.oceanlk.backend.repository.PartnerRepository;
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
class PartnerServiceTest {

    @Mock
    private PartnerRepository partnerRepository;

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private PartnerService partnerService;

    private Partner testPartner;

    @BeforeEach
    void setUp() {
        testPartner = new Partner();
        testPartner.setId("partner-123");
        testPartner.setName("Test Partner");
        testPartner.setLogoUrl("https://example.com/partner-logo.png");
        testPartner.setWebsiteUrl("https://partner.com");
        testPartner.setCategory("Technology");
    }

    @Test
    void getAllPartners_ShouldReturnAllPartners() {
        // Arrange
        List<Partner> partners = Arrays.asList(testPartner, new Partner());
        when(partnerRepository.findAll()).thenReturn(partners);

        // Act
        List<Partner> result = partnerService.getAllPartners();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(partnerRepository, times(1)).findAll();
    }

    @Test
    void getPartnerById_ShouldReturnPartner_WhenExists() {
        // Arrange
        when(partnerRepository.findById("partner-123")).thenReturn(Optional.of(testPartner));

        // Act
        Optional<Partner> result = partnerService.getPartnerById("partner-123");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Test Partner", result.get().getName());
        verify(partnerRepository, times(1)).findById("partner-123");
    }

    @Test
    void createPartner_ShouldSavePartner() {
        // Arrange
        when(partnerRepository.save(testPartner)).thenReturn(testPartner);

        // Act
        Partner result = partnerService.createPartner(testPartner);

        // Assert
        assertNotNull(result);
        assertEquals("Test Partner", result.getName());
        verify(partnerRepository, times(1)).save(testPartner);
    }

    @Test
    void deletePartner_ShouldDeletePartnerAndLogo() {
        // Arrange
        when(partnerRepository.findById("partner-123")).thenReturn(Optional.of(testPartner));
        doNothing().when(fileStorageService).deleteFile(anyString());
        doNothing().when(partnerRepository).deleteById(anyString());

        // Act
        partnerService.deletePartner("partner-123");

        // Assert
        verify(fileStorageService, times(1)).deleteFile("https://example.com/partner-logo.png");
        verify(partnerRepository, times(1)).deleteById("partner-123");
    }

    @Test
    void updatePartner_ShouldUpdateFieldsAndReplaceLogo() {
        // Arrange
        Partner existingPartner = new Partner();
        existingPartner.setId("partner-123");
        existingPartner.setLogoUrl("old-logo.png");

        Partner updateDetails = new Partner();
        updateDetails.setLogoUrl("new-logo.png");
        updateDetails.setName("New Name");

        when(partnerRepository.findById("partner-123")).thenReturn(Optional.of(existingPartner));
        when(partnerRepository.save(any(Partner.class))).thenAnswer(invocation -> invocation.getArgument(0));
        doNothing().when(fileStorageService).deleteFile(anyString());

        // Act
        Partner result = partnerService.updatePartner("partner-123", updateDetails);

        // Assert
        assertEquals("new-logo.png", result.getLogoUrl());
        assertEquals("New Name", result.getName());
        verify(fileStorageService, times(1)).deleteFile("old-logo.png");
        verify(partnerRepository, times(1)).save(existingPartner);
    }

    @Test
    void updatePartner_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(partnerRepository.findById("non-existent")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> partnerService.updatePartner("non-existent", new Partner()));
    }

    @Test
    void deletePartner_ShouldHandleFileDeletionError() {
        // Arrange
        when(partnerRepository.findById("partner-123")).thenReturn(Optional.of(testPartner));
        doThrow(new RuntimeException("Delete failed")).when(fileStorageService).deleteFile(anyString());
        doNothing().when(partnerRepository).deleteById(anyString());

        // Act & Assert
        assertDoesNotThrow(() -> partnerService.deletePartner("partner-123"));

    }
}
