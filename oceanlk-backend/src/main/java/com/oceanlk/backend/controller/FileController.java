package com.oceanlk.backend.controller;

import com.oceanlk.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    /**
     * Serve a file from GridFS by its ID.
     * This is a public endpoint to allow images/videos to be displayed on the
     * frontend.
     *
     * @param id The GridFS file ObjectId as a hex string
     * @return The file content with appropriate headers
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getFile(@PathVariable String id) {
        GridFsResource resource = fileStorageService.getFile(id);

        if (resource == null || !resource.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(java.util.Collections.singletonMap("error", "File not found"));
        }

        try {
            String contentType = resource.getContentType();
            if (contentType == null) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=86400, public") // Cache for 1 day
                    .body(new InputStreamResource(resource.getInputStream()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Collections.singletonMap("error", "Failed to read file: " + e.getMessage()));
        }
    }
}
