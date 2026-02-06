package com.oceanlk.backend.service;

import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Service
public class FileStorageService {

    @Autowired
    private GridFsTemplate gridFsTemplate;

    // Allowed file types
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp");
    private static final List<String> ALLOWED_VIDEO_TYPES = Arrays.asList(
            "video/mp4", "video/webm", "video/quicktime");
    private static final List<String> ALLOWED_DOCUMENT_TYPES = Arrays.asList(
            "application/pdf", "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

    /**
     * Save uploaded file to MongoDB GridFS
     * 
     * @param file  MultipartFile to save
     * @param group Group name (stored as metadata)
     * @return relative URL path to the saved file (/api/files/{id})
     */
    public String saveFile(MultipartFile file, String group) throws IOException {
        validateFile(file);

        // Store file with metadata
        ObjectId fileId = gridFsTemplate.store(
                file.getInputStream(),
                file.getOriginalFilename(),
                file.getContentType(),
                new com.mongodb.BasicDBObject("group", group));

        // Return URL to access the file
        return "/api/files/" + fileId.toString();
    }

    /**
     * Delete file from GridFS
     * 
     * @param fileUrl URL path to the file (e.g., /api/files/{id})
     */
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || !fileUrl.contains("/api/files/")) {
            return;
        }

        try {
            String fileId = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            gridFsTemplate.delete(new Query(Criteria.where("_id").is(fileId)));
        } catch (Exception e) {
            // Log error but don't throw exception to avoid breaking flow
            System.err.println("Error deleting file: " + e.getMessage());
        }
    }

    /**
     * Retrieve file resource from GridFS
     * 
     * @param id File ObjectId string
     * @return GridFsResource
     */
    public GridFsResource getFile(String id) {
        GridFSFile gridFSFile = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(id)));
        if (gridFSFile == null) {
            return null;
        }
        return gridFsTemplate.getResource(gridFSFile);
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
