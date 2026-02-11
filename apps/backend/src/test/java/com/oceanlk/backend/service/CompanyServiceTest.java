package com.oceanlk.backend.service;

import com.oceanlk.backend.model.Company;
import com.oceanlk.backend.repository.CompanyRepository;
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
class CompanyServiceTest {

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private CompanyService companyService;

    private Company testCompany;

    @BeforeEach
    void setUp() {
        testCompany = new Company();
        testCompany.setId("company-123");
        testCompany.setTitle("Test Company");
        testCompany.setDescription("Test Description");
        testCompany.setLogoUrl("https://example.com/logo.png");
        testCompany.setWebsite("https://testcompany.com");
    }

    @Test
    void getAllCompanies_ShouldReturnAllCompanies() {
        // Arrange
        List<Company> companies = Arrays.asList(testCompany, new Company());
        when(companyRepository.findAll()).thenReturn(companies);

        // Act
        List<Company> result = companyService.getAllCompanies();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(companyRepository, times(1)).findAll();
    }

    @Test
    void getCompanyById_ShouldReturnCompany_WhenExists() {
        // Arrange
        when(companyRepository.findById("company-123")).thenReturn(Optional.of(testCompany));

        // Act
        Optional<Company> result = companyService.getCompanyById("company-123");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Test Company", result.get().getTitle());
        verify(companyRepository, times(1)).findById("company-123");
    }

    @Test
    void createCompany_ShouldSaveCompany() {
        // Arrange
        when(companyRepository.save(testCompany)).thenReturn(testCompany);

        // Act
        Company result = companyService.createCompany(testCompany);

        // Assert
        assertNotNull(result);
        assertEquals("Test Company", result.getTitle());
        verify(companyRepository, times(1)).save(testCompany);
    }

    @Test
    void updateCompany_ShouldUpdateCompany() {
        // Arrange
        Company updates = new Company();
        updates.setTitle("Updated Company");
        when(companyRepository.findById("company-123")).thenReturn(Optional.of(testCompany));
        when(companyRepository.save(any(Company.class))).thenReturn(testCompany);

        // Act
        Company result = companyService.updateCompany("company-123", updates);

        // Assert
        assertNotNull(result);
        verify(companyRepository, times(1)).save(testCompany);
    }

    @Test
    void deleteCompany_ShouldDeleteCompanyAndFiles() {
        // Arrange
        when(companyRepository.findById("company-123")).thenReturn(Optional.of(testCompany));
        doNothing().when(fileStorageService).deleteFile(anyString());
        doNothing().when(companyRepository).deleteById(anyString());

        // Act
        companyService.deleteCompany("company-123");

        // Assert
        verify(fileStorageService, times(1)).deleteFile("https://example.com/logo.png");
        verify(companyRepository, times(1)).deleteById("company-123");
    }
}
