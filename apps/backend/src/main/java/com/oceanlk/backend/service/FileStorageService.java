package com.oceanlk.backend.service;

import com.oceanlk.backend.model.StoredFile;
import com.oceanlk.backend.repository.StoredFileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Service
public class FileStorageService {

    @Autowired
    private StoredFileRepository storedFileRepository;

    // Allowed file types
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp");
    private static final List<String> ALLOWED_VIDEO_TYPES = Arrays.asList(
            "video/mp4", "video/webm", "video/quicktime");
    private static final List<String> ALLOWED_DOCUMENT_TYPES = Arrays.asList(
            "application/pdf", "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

    /**
     * Save uploaded file to PostgreSQL stored_files table
     * 
     * @param file  MultipartFile to save
     * @param group Group name (stored as metadata)
     * @return relative URL path to the saved file (/api/files/{id})
     */
    public String saveFile(MultipartFile file, String group) throws IOException {
        validateFile(file);

        StoredFile storedFile = new StoredFile(
                file.getOriginalFilename(),
                file.getContentType(),
                group,
                file.getBytes()
        );

        StoredFile savedFile = storedFileRepository.save(storedFile);

        // Return URL to access the file
        return "/api/files/" + savedFile.getId();
    }

    /**
     * Save uploaded file and return the raw saved StoredFile entity
     */
    public StoredFile saveFileRaw(MultipartFile file, String group) throws IOException {
        validateFile(file);

        StoredFile storedFile = new StoredFile(
                file.getOriginalFilename(),
                file.getContentType(),
                group,
                file.getBytes()
        );

        return storedFileRepository.save(storedFile);
    }

    /**
     * Delete file from PostgreSQL
     * 
     * @param fileUrl URL path to the file (e.g., /api/files/{id})
     */
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || !fileUrl.contains("/api/files/")) {
            return;
        }

        try {
            String fileId = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            storedFileRepository.deleteById(fileId);
        } catch (Exception e) {
            // Log error but don't throw exception to avoid breaking flow
            System.err.println("Error deleting file: " + e.getMessage());
        }
    }

    /**
     * Delete file from PostgreSQL by raw ID
     */
    public void deleteFileRaw(String id) {
        if (id == null) {
            return;
        }
        try {
            storedFileRepository.deleteById(id);
        } catch (Exception e) {
            System.err.println("Error deleting file by raw ID: " + e.getMessage());
        }
    }

    /**
     * Retrieve file resource from PostgreSQL
     * 
     * @param id File UUID string
     * @return StoredFile
     */
    public StoredFile getFile(String id) {
        return storedFileRepository.findById(id).orElse(null);
    }

    /**
     * Validate file type and size
     */
    private void validateFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null) {
            throw new IOException("Could not determine file type");
        }

        // Check if file type is allowed
        boolean isAllowed = ALLOWED_IMAGE_TYPES.contains(contentType)
                || ALLOWED_VIDEO_TYPES.contains(contentType)
                || ALLOWED_DOCUMENT_TYPES.contains(contentType);

        if (!isAllowed) {
            throw new IOException(
                    "File type not allowed. Allowed types: images (jpg, png, gif, webp), videos (mp4, webm), and documents (pdf, doc, docx)");
        }

        // Check file size (max 50MB)
        long maxSize = 50 * 1024 * 1024; // 50MB
        if (file.getSize() > maxSize) {
            throw new IOException("File size exceeds maximum limit of 50MB");
        }
    }

    /**
     * Check if file is an image
     */
    public boolean isImage(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && ALLOWED_IMAGE_TYPES.contains(contentType);
    }

    /**
     * Check if file is a video
     */
    public boolean isVideo(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && ALLOWED_VIDEO_TYPES.contains(contentType);
    }

    /**
     * Check if file is a document
     */
    public boolean isDocument(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && ALLOWED_DOCUMENT_TYPES.contains(contentType);
    }
}
