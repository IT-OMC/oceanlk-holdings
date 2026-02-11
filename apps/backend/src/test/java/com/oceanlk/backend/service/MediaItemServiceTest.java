package com.oceanlk.backend.service;

import com.oceanlk.backend.model.MediaItem;
import com.oceanlk.backend.repository.MediaItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MediaItemServiceTest {

    @Mock
    private MediaItemRepository mediaItemRepository;

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private MediaItemService mediaItemService;

    private MediaItem testMedia;

    @BeforeEach
    void setUp() {
        testMedia = new MediaItem();
        testMedia.setId("media-123");
        testMedia.setTitle("Test Media");
        testMedia.setDescription("Test Description");
        testMedia.setCategory("news");
        testMedia.setImageUrl("https://example.com/image.jpg");
        testMedia.setVideoUrl("https://example.com/video.mp4");
        testMedia.setPublishedDate(LocalDate.now());
        testMedia.setStatus("PUBLISHED");
    }

    @Test
    void getAllMediaItems_ShouldReturnAllItems() {
        // Arrange
        MediaItem media1 = new MediaItem();
        media1.setTitle("Media 1");
        MediaItem media2 = new MediaItem();
        media2.setTitle("Media 2");
        List<MediaItem> expectedMedia = Arrays.asList(media1, media2);

        when(mediaItemRepository.findAll()).thenReturn(expectedMedia);

        // Act
        List<MediaItem> result = mediaItemService.getAllMediaItems();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Media 1", result.get(0).getTitle());
        assertEquals("Media 2", result.get(1).getTitle());
        verify(mediaItemRepository, times(1)).findAll();
    }

    @Test
    void getMediaItemsByCategory_ShouldFilterByCategory() {
        // Arrange
        MediaItem news1 = new MediaItem();
        news1.setCategory("news");
        MediaItem news2 = new MediaItem();
        news2.setCategory("news");
        List<MediaItem> newsItems = Arrays.asList(news1, news2);

        when(mediaItemRepository.findByCategory("news")).thenReturn(newsItems);

        // Act
        List<MediaItem> result = mediaItemService.getMediaItemsByCategory("news");

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("news", result.get(0).getCategory());
        verify(mediaItemRepository, times(1)).findByCategory("news");
    }

    @Test
    void getMediaItemById_ShouldReturnMedia_WhenIdExists() {
        // Arrange
        when(mediaItemRepository.findById("media-123")).thenReturn(Optional.of(testMedia));

        // Act
        Optional<MediaItem> result = mediaItemService.getMediaItemById("media-123");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Test Media", result.get().getTitle());
        verify(mediaItemRepository, times(1)).findById("media-123");
    }

    @Test
    void getMediaItemById_ShouldReturnEmpty_WhenIdNotExists() {
        // Arrange
        when(mediaItemRepository.findById("non-existent")).thenReturn(Optional.empty());

        // Act
        Optional<MediaItem> result = mediaItemService.getMediaItemById("non-existent");

        // Assert
        assertFalse(result.isPresent());
        verify(mediaItemRepository, times(1)).findById("non-existent");
    }

    @Test
    void createMediaItem_ShouldSaveAndReturnMedia() {
        // Arrange
        when(mediaItemRepository.save(testMedia)).thenReturn(testMedia);

        // Act
        MediaItem result = mediaItemService.createMediaItem(testMedia);

        // Assert
        assertNotNull(result);
        assertEquals("Test Media", result.getTitle());
        verify(mediaItemRepository, times(1)).save(testMedia);
    }

    @Test
    void updateMediaItem_ShouldUpdateAllFields() {
        // Arrange
        MediaItem updatedDetails = new MediaItem();
        updatedDetails.setTitle("Updated Title");
        updatedDetails.setDescription("Updated Description");
        updatedDetails.setCategory("blog");
        updatedDetails.setImageUrl("https://example.com/new-image.jpg");
        updatedDetails.setStatus("DRAFT");

        when(mediaItemRepository.findById("media-123")).thenReturn(Optional.of(testMedia));
        when(mediaItemRepository.save(any(MediaItem.class))).thenReturn(testMedia);

        // Act
        MediaItem result = mediaItemService.updateMediaItem("media-123", updatedDetails);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Title", testMedia.getTitle());
        assertEquals("Updated Description", testMedia.getDescription());
        assertEquals("blog", testMedia.getCategory());
        assertEquals("DRAFT", testMedia.getStatus());
        verify(mediaItemRepository, times(1)).findById("media-123");
        verify(mediaItemRepository, times(1)).save(testMedia);
    }

    @Test
    void updateMediaItem_ShouldThrowException_WhenNotFound() {
        // Arrange
        MediaItem updatedDetails = new MediaItem();
        when(mediaItemRepository.findById("non-existent")).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            mediaItemService.updateMediaItem("non-existent", updatedDetails);
        });

        assertTrue(exception.getMessage().contains("Media item not found"));
        verify(mediaItemRepository, times(1)).findById("non-existent");
        verify(mediaItemRepository, never()).save(any(MediaItem.class));
    }

    @Test
    void deleteMediaItem_ShouldDeleteMediaAndAssociatedFiles() {
        // Arrange
        when(mediaItemRepository.findById("media-123")).thenReturn(Optional.of(testMedia));
        doNothing().when(fileStorageService).deleteFile(anyString());
        doNothing().when(mediaItemRepository).deleteById(anyString());

        // Act
        mediaItemService.deleteMediaItem("media-123");

        // Assert
        verify(mediaItemRepository, times(1)).findById("media-123");
        verify(fileStorageService, times(1)).deleteFile("https://example.com/image.jpg");
        verify(fileStorageService, times(1)).deleteFile("https://example.com/video.mp4");
        verify(mediaItemRepository, times(1)).deleteById("media-123");
    }

    @Test
    void deleteMediaItem_ShouldDeleteMedia_EvenIfFilesDontExist() {
        // Arrange
        testMedia.setImageUrl(null);
        testMedia.setVideoUrl(null);
        when(mediaItemRepository.findById("media-123")).thenReturn(Optional.of(testMedia));
        doNothing().when(mediaItemRepository).deleteById(anyString());

        // Act
        mediaItemService.deleteMediaItem("media-123");

        // Assert
        verify(mediaItemRepository, times(1)).findById("media-123");
        verify(fileStorageService, never()).deleteFile(anyString());
        verify(mediaItemRepository, times(1)).deleteById("media-123");
    }

    @Test
    void deleteMediaItem_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(mediaItemRepository.findById("non-existent")).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            mediaItemService.deleteMediaItem("non-existent");
        });

        assertTrue(exception.getMessage().contains("Media item not found"));
        verify(mediaItemRepository, times(1)).findById("non-existent");
        verify(fileStorageService, never()).deleteFile(anyString());
        verify(mediaItemRepository, never()).deleteById(anyString());
    }
}
