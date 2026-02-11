package com.oceanlk.backend.service;

import com.oceanlk.backend.model.LeadershipCategory;
import com.oceanlk.backend.repository.LeadershipCategoryRepository;
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
class LeadershipCategoryServiceTest {

    @Mock
    private LeadershipCategoryRepository leadershipCategoryRepository;

    @InjectMocks
    private LeadershipCategoryService leadershipCategoryService;

    private LeadershipCategory testCategory;

    @BeforeEach
    void setUp() {
        testCategory = new LeadershipCategory();
        testCategory.setId("cat-123");
        testCategory.setCode("EXEC");
        testCategory.setTitle("Executive Team");
        testCategory.setDisplayOrder(1);
    }

    @Test
    void getAllCategories_ShouldReturnAllCategories() {
        // Arrange
        List<LeadershipCategory> categories = Arrays.asList(testCategory, new LeadershipCategory());
        when(leadershipCategoryRepository.findAll()).thenReturn(categories);

        // Act
        List<LeadershipCategory> result = leadershipCategoryService.getAllCategories();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(leadershipCategoryRepository, times(1)).findAll();
    }

    @Test
    void getCategoryById_ShouldReturnCategory_WhenExists() {
        // Arrange
        when(leadershipCategoryRepository.findById("cat-123")).thenReturn(Optional.of(testCategory));

        // Act
        Optional<LeadershipCategory> result = leadershipCategoryService.getCategoryById("cat-123");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Executive Team", result.get().getTitle());
        verify(leadershipCategoryRepository, times(1)).findById("cat-123");
    }

    @Test
    void createCategory_ShouldSaveCategory() {
        // Arrange
        when(leadershipCategoryRepository.save(testCategory)).thenReturn(testCategory);

        // Act
        LeadershipCategory result = leadershipCategoryService.createCategory(testCategory);

        // Assert
        assertNotNull(result);
        assertEquals("Executive Team", result.getTitle());
        verify(leadershipCategoryRepository, times(1)).save(testCategory);
    }

    @Test
    void updateCategory_ShouldUpdateCategory() {
        // Arrange
        LeadershipCategory updates = new LeadershipCategory();
        updates.setTitle("Updated Team");

        when(leadershipCategoryRepository.findById("cat-123")).thenReturn(Optional.of(testCategory));
        when(leadershipCategoryRepository.save(any(LeadershipCategory.class))).thenReturn(testCategory);

        // Act
        LeadershipCategory result = leadershipCategoryService.updateCategory("cat-123", updates);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Team", testCategory.getTitle());
        verify(leadershipCategoryRepository, times(1)).save(testCategory);
    }

    @Test
    void updateCategory_ShouldThrowException_WhenNotFound() {
        // Arrange
        LeadershipCategory updates = new LeadershipCategory();
        when(leadershipCategoryRepository.findById("non-existent")).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            leadershipCategoryService.updateCategory("non-existent", updates);
        });

        assertTrue(exception.getMessage().contains("Category not found"));
        verify(leadershipCategoryRepository, never()).save(any(LeadershipCategory.class));
    }

    @Test
    void deleteCategory_ShouldCallRepository() {
        // Arrange
        doNothing().when(leadershipCategoryRepository).deleteById("cat-123");

        // Act
        leadershipCategoryService.deleteCategory("cat-123");

        // Assert
        verify(leadershipCategoryRepository, times(1)).deleteById("cat-123");
    }
}
