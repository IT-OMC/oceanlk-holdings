package com.oceanlk.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadDir = Paths.get("uploads/media");

    // Allowed file types
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp");
    private static final List<String> ALLOWED_VIDEO_TYPES = Arrays.asList(
            "video/mp4", "video/webm", "video/quicktime");

    public FileStorageService() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    /**
     * Save uploaded file to the server
     * 
     * @param file MultipartFile to save
     * @return relative URL path to the saved file
     */
    public String saveFile(MultipartFile file) throws IOException {
        // Validate file
        validateFile(file);

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String uniqueFilename = UUID.randomUUID().toString() + extension;

        // Save file
        Path targetLocation = uploadDir.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        // Return relative URL
        return "/uploads/media/" + uniqueFilename;
    }

    /**
     * Delete file from server
     * 
     * @param fileUrl URL path to the file (e.g., /uploads/media/filename.jpg)
     */
    public void deleteFile(String fileUrl) throws IOException {
        if (fileUrl == null || !fileUrl.startsWith("/uploads/media/")) {
            return; // Not a local file or invalid path
        }

        String filename = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
        Path filePath = uploadDir.resolve(filename);

        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }
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
                || ALLOWED_VIDEO_TYPES.contains(contentType);

        if (!isAllowed) {
            throw new IOException(
                    "File type not allowed. Allowed types: images (jpg, png, gif, webp) and videos (mp4, webm)");
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
}
