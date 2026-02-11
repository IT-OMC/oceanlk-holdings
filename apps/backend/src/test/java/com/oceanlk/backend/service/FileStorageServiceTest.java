package com.oceanlk.backend.service;

import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FileStorageServiceTest {

    @Mock
    private GridFsTemplate gridFsTemplate;

    @InjectMocks
    private FileStorageService fileStorageService;

    @Test
    void saveFile_ShouldSaveFile_WhenValid() throws IOException {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.jpg", "image/jpeg", "test data".getBytes());
        ObjectId fileId = new ObjectId();
        when(gridFsTemplate.store(any(InputStream.class), anyString(), anyString(), any(Object.class)))
                .thenReturn(fileId);

        // Act
        String result = fileStorageService.saveFile(file, "test-group");

        // Assert
        assertNotNull(result);
        assertTrue(result.contains(fileId.toString()));
        verify(gridFsTemplate, times(1)).store(any(InputStream.class), anyString(), anyString(), any(Object.class));
    }

    @Test
    void saveFile_ShouldThrowException_WhenFileIsEmpty() {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.jpg", "image/jpeg", new byte[0]);

        // Act & Assert
        IOException exception = assertThrows(IOException.class, () -> {
            fileStorageService.saveFile(file, "test-group");
        });
        assertEquals("File is empty", exception.getMessage());
    }

    @Test
    void saveFile_ShouldThrowException_WhenFileTypeNotAllowed() {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.exe", "application/x-msdownload", "test data".getBytes());

        // Act & Assert
        IOException exception = assertThrows(IOException.class, () -> {
            fileStorageService.saveFile(file, "test-group");
        });
        assertTrue(exception.getMessage().contains("File type not allowed"));
    }

    @Test
    void deleteFile_ShouldDeleteFile_WhenValidUrl() {
        // Arrange
        String fileUrl = "/api/files/" + new ObjectId().toString();
        doNothing().when(gridFsTemplate).delete(any(Query.class));

        // Act
        fileStorageService.deleteFile(fileUrl);

        // Assert
        verify(gridFsTemplate, times(1)).delete(any(Query.class));
    }

    @Test
    void deleteFile_ShouldDoNothing_WhenInvalidUrl() {
        // Act
        fileStorageService.deleteFile("invalid-url");

        // Assert
        verify(gridFsTemplate, never()).delete(any(Query.class));
    }

    @Test
    void getFile_ShouldReturnResource_WhenExists() {
        // Arrange
        ObjectId id = new ObjectId();
        GridFSFile gridFSFile = mock(GridFSFile.class);
        GridFsResource resource = mock(GridFsResource.class);

        when(gridFsTemplate.findOne(any(Query.class))).thenReturn(gridFSFile);
        when(gridFsTemplate.getResource(gridFSFile)).thenReturn(resource);

        // Act
        GridFsResource result = fileStorageService.getFile(id.toString());

        // Assert
        assertNotNull(result);
        verify(gridFsTemplate, times(1)).findOne(any(Query.class));
    }

    @Test
    void getFile_ShouldReturnNull_WhenNotExists() {
        // Arrange
        when(gridFsTemplate.findOne(any(Query.class))).thenReturn(null);

        // Act
        GridFsResource result = fileStorageService.getFile(new ObjectId().toString());

        // Assert
        assertNull(result);
    }

    @Test
    void isImage_ShouldReturnTrue_ForImage() {
        MockMultipartFile file = new MockMultipartFile("f", "f.jpg", "image/jpeg", "content".getBytes());
        assertTrue(fileStorageService.isImage(file));
    }

    @Test
    void isVideo_ShouldReturnTrue_ForVideo() {
        MockMultipartFile file = new MockMultipartFile("f", "f.mp4", "video/mp4", "content".getBytes());
        assertTrue(fileStorageService.isVideo(file));
    }
}
