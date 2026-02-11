package com.oceanlk.backend.service;

import com.oceanlk.backend.model.PageContent;
import com.oceanlk.backend.repository.PageContentRepository;
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
class PageContentServiceTest {

    @Mock
    private PageContentRepository pageContentRepository;

    @InjectMocks
    private PageContentService pageContentService;

    private PageContent testContent;

    @BeforeEach
    void setUp() {
        testContent = new PageContent();
        testContent.setId("content-123");
        testContent.setPageIdentifier("home");
        testContent.setSectionIdentifier("hero");
        testContent.setTitle("Welcome");
        testContent.setContent("Welcome to OceanLK");
    }

    @Test
    void getAllPageContent_ShouldReturnAllContent() {
        // Arrange
        List<PageContent> contentList = Arrays.asList(testContent, new PageContent());
        when(pageContentRepository.findAll()).thenReturn(contentList);

        // Act
        List<PageContent> result = pageContentService.getAllPageContent();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(pageContentRepository, times(1)).findAll();
    }

    @Test
    void getContentByPageAndSection_ShouldReturnContent_WhenExists() {
        // Arrange
        when(pageContentRepository.findByPageIdentifierAndSectionIdentifier("home", "hero"))
                .thenReturn(Optional.of(testContent));

        // Act
        Optional<PageContent> result = pageContentService.getContentByPageAndSection("home", "hero");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Welcome", result.get().getTitle());
        verify(pageContentRepository, times(1))
                .findByPageIdentifierAndSectionIdentifier("home", "hero");
    }

    @Test
    void getContentById_ShouldReturnContent_WhenExists() {
        // Arrange
        when(pageContentRepository.findById("content-123")).thenReturn(Optional.of(testContent));

        // Act
        Optional<PageContent> result = pageContentService.getContentById("content-123");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Welcome", result.get().getTitle());
        verify(pageContentRepository, times(1)).findById("content-123");
    }

    @Test
    void createOrUpdateContent_ShouldCreatenew_WhenNotExists() {
        // Arrange
        when(pageContentRepository.findByPageIdentifierAndSectionIdentifier("home", "hero"))
                .thenReturn(Optional.empty());
        when(pageContentRepository.save(any(PageContent.class))).thenReturn(testContent);

        // Act
        PageContent result = pageContentService.createOrUpdateContent(testContent);

        // Assert
        assertNotNull(result);
        verify(pageContentRepository, times(1)).save(testContent);
    }

    @Test
    void createOrUpdateContent_ShouldUpdateExisting_WhenExists() {
        // Arrange
        PageContent existing = new PageContent();
        existing.setId("existing-123");
        existing.setTitle("Old Title");

        PageContent update = new PageContent();
        update.setPageIdentifier("home");
        update.setSectionIdentifier("hero");
        update.setTitle("New Title");

        when(pageContentRepository.findByPageIdentifierAndSectionIdentifier("home", "hero"))
                .thenReturn(Optional.of(existing));
        when(pageContentRepository.save(any(PageContent.class))).thenReturn(existing);

        // Act
        PageContent result = pageContentService.createOrUpdateContent(update);

        // Assert
        assertNotNull(result);
        assertEquals("New Title", existing.getTitle());
        verify(pageContentRepository, times(1)).save(existing);
    }

    @Test
    void deleteContent_ShouldCallRepository() {
        // Arrange
        doNothing().when(pageContentRepository).deleteById("content-123");

        // Act
        pageContentService.deleteContent("content-123");

        // Assert
        verify(pageContentRepository, times(1)).deleteById("content-123");
    }
}
