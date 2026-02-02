package com.oceanlk.backend.service;

import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

@Service
public class FileStorageService {

    private final GridFsOperations gridFsOperations;

    // Allowed file types
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp");
    private static final List<String> ALLOWED_VIDEO_TYPES = Arrays.asList(
            "video/mp4", "video/webm", "video/quicktime");

    public FileStorageService(GridFsOperations gridFsOperations) {
        this.gridFsOperations = gridFsOperations;
    }

    /**
     * Save uploaded file to MongoDB GridFS
     *
     * @param file  MultipartFile to save
     * @param group Group name for metadata (e.g., MEDIA_PANEL, HR_PANEL)
     * @return URL path to retrieve the saved file (e.g., /api/files/{id})
     */
    public String saveFile(MultipartFile file, String group) throws IOException {
        // Validate file
        validateFile(file);

        String contentType = file.getContentType();
        String originalFilename = file.getOriginalFilename();

        // Store file in GridFS
        try (InputStream inputStream = file.getInputStream()) {
            ObjectId fileId = gridFsOperations.store(
                    inputStream,
                    originalFilename,
                    contentType,
                    new org.bson.Document("group", group));
            // Return a URL that the FileController will serve
            return "/api/files/" + fileId.toHexString();
        }
    }

    /**
     * Delete file from MongoDB GridFS
     *
     * @param fileUrl URL path to the file (e.g., /api/files/{id})
     */
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || !fileUrl.startsWith("/api/files/")) {
            // Might be an old local file or an external URL, ignore.
            return;
        }

        String fileId = fileUrl.substring("/api/files/".length());
        try {
            gridFsOperations.delete(new Query(Criteria.where("_id").is(new ObjectId(fileId))));
        } catch (IllegalArgumentException e) {
            // Invalid ObjectId format, ignore
        }
    }

    /**
     * Get a file from GridFS by its ID
     *
     * @param id The ObjectId string of the file
     * @return GridFsResource containing the file stream
     */
    public GridFsResource getFile(String id) {
        try {
            GridFSFile file = gridFsOperations.findOne(new Query(Criteria.where("_id").is(new ObjectId(id))));
            if (file == null) {
                return null;
            }
            return gridFsOperations.getResource(file);
        } catch (IllegalArgumentException e) {
            return null; // Invalid ObjectId
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
