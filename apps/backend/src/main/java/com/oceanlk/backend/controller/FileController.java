package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.StoredFile;
import com.oceanlk.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:4173" })
public class FileController {

    private final FileStorageService fileStorageService;

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getFile(@PathVariable String id) throws IOException {
        StoredFile storedFile = fileStorageService.getFile(id);

        if (storedFile == null) {
            return ResponseEntity.notFound().build();
        }

        ByteArrayResource resource = new ByteArrayResource(storedFile.getData());

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(storedFile.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + storedFile.getFilename() + "\"")
                .body(resource);
    }
}
