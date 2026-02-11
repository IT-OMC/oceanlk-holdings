package com.oceanlk.backend.service;

import com.oceanlk.backend.model.AdminUser;
import com.oceanlk.backend.repository.AdminUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminUserServiceTest {

    @Mock
    private AdminUserRepository adminUserRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AdminUserService adminUserService;

    private AdminUser testAdmin;

    @BeforeEach
    void setUp() {
        testAdmin = new AdminUser();
        testAdmin.setId("test-id-123");
        testAdmin.setUsername("testadmin");
        testAdmin.setEmail("test@oceanlk.com");
        testAdmin.setPassword("plainPassword");
        testAdmin.setRole("ADMIN");
    }

    @Test
    void getAllAdmins_ShouldReturnAllAdmins() {
        // Arrange
        AdminUser admin1 = new AdminUser();
        admin1.setUsername("admin1");
        AdminUser admin2 = new AdminUser();
        admin2.setUsername("admin2");
        List<AdminUser> expectedAdmins = Arrays.asList(admin1, admin2);

        when(adminUserRepository.findAll()).thenReturn(expectedAdmins);

        // Act
        List<AdminUser> result = adminUserService.getAllAdmins();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("admin1", result.get(0).getUsername());
        assertEquals("admin2", result.get(1).getUsername());
        verify(adminUserRepository, times(1)).findAll();
    }

    @Test
    void findById_ShouldReturnAdmin_WhenIdExists() {
        // Arrange
        when(adminUserRepository.findById("test-id-123")).thenReturn(Optional.of(testAdmin));

        // Act
        Optional<AdminUser> result = adminUserService.findById("test-id-123");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("testadmin", result.get().getUsername());
        verify(adminUserRepository, times(1)).findById("test-id-123");
    }

    @Test
    void findById_ShouldReturnEmpty_WhenIdNotExists() {
        // Arrange
        when(adminUserRepository.findById("non-existent-id")).thenReturn(Optional.empty());

        // Act
        Optional<AdminUser> result = adminUserService.findById("non-existent-id");

        // Assert
        assertFalse(result.isPresent());
        verify(adminUserRepository, times(1)).findById("non-existent-id");
    }

    @Test
    void findByUsername_ShouldReturnAdmin_WhenUsernameExists() {
        // Arrange
        when(adminUserRepository.findByUsername("testadmin")).thenReturn(Optional.of(testAdmin));

        // Act
        Optional<AdminUser> result = adminUserService.findByUsername("testadmin");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("testadmin", result.get().getUsername());
        verify(adminUserRepository, times(1)).findByUsername("testadmin");
    }

    @Test
    void findByUsername_ShouldReturnEmpty_WhenUsernameNotExists() {
        // Arrange
        when(adminUserRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // Act
        Optional<AdminUser> result = adminUserService.findByUsername("nonexistent");

        // Assert
        assertFalse(result.isPresent());
        verify(adminUserRepository, times(1)).findByUsername("nonexistent");
    }

    @Test
    void findByEmail_ShouldReturnAdmin_WhenEmailExists() {
        // Arrange
        when(adminUserRepository.findByEmail("test@oceanlk.com")).thenReturn(Optional.of(testAdmin));

        // Act
        Optional<AdminUser> result = adminUserService.findByEmail("test@oceanlk.com");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("test@oceanlk.com", result.get().getEmail());
        verify(adminUserRepository, times(1)).findByEmail("test@oceanlk.com");
    }

    @Test
    void findByEmail_ShouldReturnEmpty_WhenEmailNotExists() {
        // Arrange
        when(adminUserRepository.findByEmail("nonexistent@test.com")).thenReturn(Optional.empty());

        // Act
        Optional<AdminUser> result = adminUserService.findByEmail("nonexistent@test.com");

        // Assert
        assertFalse(result.isPresent());
        verify(adminUserRepository, times(1)).findByEmail("nonexistent@test.com");
    }

    @Test
    void createAdmin_ShouldEncodePassword_AndSaveAdmin() {
        // Arrange
        String encodedPassword = "encodedPassword123";
        when(passwordEncoder.encode("plainPassword")).thenReturn(encodedPassword);
        when(adminUserRepository.save(any(AdminUser.class))).thenReturn(testAdmin);

        // Act
        AdminUser result = adminUserService.createAdmin(testAdmin);

        // Assert
        assertNotNull(result);
        verify(passwordEncoder, times(1)).encode("plainPassword");
        verify(adminUserRepository, times(1)).save(testAdmin);
        assertEquals(encodedPassword, testAdmin.getPassword());
    }

    @Test
    void updateAdmin_ShouldSaveAdmin() {
        // Arrange
        testAdmin.setEmail("updated@oceanlk.com");
        when(adminUserRepository.save(testAdmin)).thenReturn(testAdmin);

        // Act
        AdminUser result = adminUserService.updateAdmin(testAdmin);

        // Assert
        assertNotNull(result);
        assertEquals("updated@oceanlk.com", result.getEmail());
        verify(adminUserRepository, times(1)).save(testAdmin);
    }

    @Test
    void deleteAdmin_ShouldCallRepositoryDelete() {
        // Arrange
        String adminId = "test-id-123";
        doNothing().when(adminUserRepository).deleteById(adminId);

        // Act
        adminUserService.deleteAdmin(adminId);

        // Assert
        verify(adminUserRepository, times(1)).deleteById(adminId);
    }

    @Test
    void changePassword_ShouldEncodeNewPassword_AndSaveUser() {
        // Arrange
        String newPassword = "newPassword456";
        String encodedNewPassword = "encodedNewPassword456";
        when(passwordEncoder.encode(newPassword)).thenReturn(encodedNewPassword);
        when(adminUserRepository.save(testAdmin)).thenReturn(testAdmin);

        // Act
        adminUserService.changePassword(testAdmin, newPassword);

        // Assert
        verify(passwordEncoder, times(1)).encode(newPassword);
        verify(adminUserRepository, times(1)).save(testAdmin);
        assertEquals(encodedNewPassword, testAdmin.getPassword());
    }
}
