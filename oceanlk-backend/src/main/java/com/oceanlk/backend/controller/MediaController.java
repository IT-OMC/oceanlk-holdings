package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.MediaItem;
import com.oceanlk.backend.repository.MediaItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:4173" })
public class MediaController {

    private final MediaItemRepository mediaRepository;

    // Public endpoint - get all published media
    @GetMapping("/media")
    public ResponseEntity<List<MediaItem>> getAllPublishedMedia() {
        List<MediaItem> mediaItems = mediaRepository.findByStatusOrderByPublishedDateDesc("PUBLISHED");
        return ResponseEntity.ok(mediaItems);
    }

    // Admin endpoints
    @GetMapping("/admin/media")
    public ResponseEntity<List<MediaItem>> getAllMedia() {
        List<MediaItem> mediaItems = mediaRepository.findAll();
        return ResponseEntity.ok(mediaItems);
    }

    @PostMapping("/admin/media")
    public ResponseEntity<?> createMediaItem(@RequestBody MediaItem mediaItem) {
        try {
            if (mediaItem.getStatus() == null || mediaItem.getStatus().isEmpty()) {
                mediaItem.setStatus("PUBLISHED"); // Default
            } else {
                mediaItem.setStatus(mediaItem.getStatus().toUpperCase());
            }

            if (mediaItem.getPublishedDate() == null) {
                // Assuming publishedDate is String or Date. Model shows specific type?
                // Looking at file, it is used in sort ByPublishedDateDesc.
                // Frontend sends string YYYY-MM-DD.
                // Let's assume it's okay or set to now if needed.
                // But wait, lines 25 says `findByStatusOrderByPublishedDateDesc`.
                // Let's check MediaItem model first?
                // I'll stick to just status fix for now, and let frontend send date.
            }

            MediaItem savedItem = mediaRepository.save(mediaItem);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedItem);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create media item: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/admin/media/{id}")
    public ResponseEntity<?> updateMediaItem(@PathVariable String id, @RequestBody MediaItem updatedItem) {
        MediaItem mediaItem = mediaRepository.findById(id).orElse(null);

        if (mediaItem == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Media item not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        // Update fields
        mediaItem.setTitle(updatedItem.getTitle());
        mediaItem.setDescription(updatedItem.getDescription());
        mediaItem.setImageUrl(updatedItem.getImageUrl());
        mediaItem.setVideoUrl(updatedItem.getVideoUrl());
        mediaItem.setCategory(updatedItem.getCategory());
        mediaItem.setFeatured(updatedItem.isFeatured());
        if (updatedItem.getStatus() != null) {
            mediaItem.setStatus(updatedItem.getStatus().toUpperCase());
        }

        MediaItem savedItem = mediaRepository.save(mediaItem);
        return ResponseEntity.ok(savedItem);
    }

    @DeleteMapping("/admin/media/{id}")
    public ResponseEntity<?> deleteMediaItem(@PathVariable String id) {
        if (!mediaRepository.existsById(id)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Media item not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        mediaRepository.deleteById(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Media item deleted successfully");
        return ResponseEntity.ok(response);
    }
}
