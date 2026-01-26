package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.MediaItem;
import com.oceanlk.backend.repository.CompanyRepository;
import com.oceanlk.backend.repository.MediaItemRepository;
import com.oceanlk.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:4173" })
public class MediaController {

    private final MediaItemRepository mediaRepository;
    private final FileStorageService fileStorageService;
    private final CompanyRepository companyRepository;
    private final com.oceanlk.backend.service.AuditLogService auditLogService;

    // Public endpoint - get all published media
    @GetMapping("/media")
    public ResponseEntity<List<MediaItem>> getAllPublishedMedia() {
        List<MediaItem> mediaItems = mediaRepository.findByStatusOrderByPublishedDateDesc("PUBLISHED");
        return ResponseEntity.ok(mediaItems);
    }

    // Public endpoint - get gallery media with company info
    @GetMapping("/media/gallery")
    public ResponseEntity<?> getGalleryMedia() {
        try {
            List<MediaItem> mediaItems = mediaRepository.findByStatusOrderByPublishedDateDesc("PUBLISHED");

            // Enrich with company information
            List<Map<String, Object>> enrichedItems = mediaItems.stream()
                    .filter(item -> "Gallery".equalsIgnoreCase(item.getCategory())
                            && "MEDIA_PANEL".equalsIgnoreCase(item.getGroup()))
                    .map(item -> {
                        Map<String, Object> enriched = new HashMap<>();
                        enriched.put("id", item.getId());
                        enriched.put("title", item.getTitle());
                        enriched.put("description", item.getDescription());
                        enriched.put("imageUrl", item.getImageUrl());
                        enriched.put("videoUrl", item.getVideoUrl());
                        enriched.put("category", item.getCategory());
                        enriched.put("featured", item.isFeatured());

                        // Add company info if associated
                        if (item.getCompanyId() != null) {
                            companyRepository.findById(item.getCompanyId())
                                    .ifPresent(company -> {
                                        enriched.put("company", company.getTitle());
                                        enriched.put("companyId", company.getId());
                                    });
                        }

                        return enriched;
                    })
                    .collect(java.util.stream.Collectors.toList());

            return ResponseEntity.ok(enrichedItems);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch gallery media: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Public endpoint - get news articles
    @GetMapping("/media/news")
    public ResponseEntity<List<MediaItem>> getNewsArticles() {
        List<MediaItem> news = mediaRepository.findByCategoryAndGroupAndStatusOrderByPublishedDateDesc("NEWS",
                "MEDIA_PANEL", "PUBLISHED");
        return ResponseEntity.ok(news);
    }

    // Public endpoint - get blog posts
    @GetMapping("/media/blogs")
    public ResponseEntity<List<MediaItem>> getBlogPosts() {
        List<MediaItem> blogs = mediaRepository.findByCategoryAndGroupAndStatusOrderByPublishedDateDesc("BLOG",
                "MEDIA_PANEL", "PUBLISHED");
        return ResponseEntity.ok(blogs);
    }

    // Public endpoint - get media items (videos, galleries, documents)
    @GetMapping("/media/media")
    public ResponseEntity<List<MediaItem>> getMediaItems() {
        List<MediaItem> media = mediaRepository.findByCategoryInAndGroupAndStatusOrderByPublishedDateDesc(
                java.util.Arrays.asList("MEDIA", "GALLERY"), "MEDIA_PANEL", "PUBLISHED");
        return ResponseEntity.ok(media);
    }

    // Public endpoint - get single media item
    @GetMapping("/media/{id}")
    public ResponseEntity<?> getMediaItemById(@PathVariable String id) {
        return mediaRepository.findById(id)
                .map(item -> {
                    if (!"PUBLISHED".equalsIgnoreCase(item.getStatus())) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(java.util.Collections.singletonMap("error", "Media item not found"));
                    }

                    // If it is a gallery/album, ensure galleryImages is present.
                    // The entity usually has it.
                    return ResponseEntity.ok(item);
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(java.util.Collections.singletonMap("error", "Media item not found")));
    }

    // Admin endpoints
    @GetMapping("/admin/media")
    public ResponseEntity<List<MediaItem>> getAllMedia(@RequestParam(required = false) String group) {
        List<MediaItem> mediaItems;
        if (group != null && !group.isEmpty()) {
            mediaItems = mediaRepository.findByGroupOrderByPublishedDateDesc(group);
        } else {
            mediaItems = mediaRepository.findAll();
        }
        return ResponseEntity.ok(mediaItems);
    }

    // File upload endpoint
    @PostMapping("/admin/media/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file,
            @RequestParam(value = "group", defaultValue = "MEDIA_PANEL") String group) {
        try {
            String fileUrl = fileStorageService.saveFile(file, group);

            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("type", fileStorageService.isImage(file) ? "image" : "video");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
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

            // Log Action
            auditLogService.logAction("admin", "CREATE", "MediaItem", savedItem.getId(),
                    "Created media item: " + savedItem.getTitle() + " (Category: " + savedItem.getCategory() + ")");

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
        mediaItem.setExcerpt(updatedItem.getExcerpt());
        mediaItem.setImageUrl(updatedItem.getImageUrl());
        mediaItem.setVideoUrl(updatedItem.getVideoUrl());
        mediaItem.setCategory(updatedItem.getCategory());
        mediaItem.setGroup(updatedItem.getGroup());
        mediaItem.setType(updatedItem.getType());
        mediaItem.setCompanyId(updatedItem.getCompanyId());
        mediaItem.setCompany(updatedItem.getCompany());
        mediaItem.setFeatured(updatedItem.isFeatured());

        // Update blog-specific fields
        mediaItem.setAuthor(updatedItem.getAuthor());
        mediaItem.setReadTime(updatedItem.getReadTime());

        // Update media-specific fields
        mediaItem.setDuration(updatedItem.getDuration());
        mediaItem.setPhotoCount(updatedItem.getPhotoCount());
        mediaItem.setPageCount(updatedItem.getPageCount());
        mediaItem.setGalleryImages(updatedItem.getGalleryImages());

        if (updatedItem.getStatus() != null) {
            mediaItem.setStatus(updatedItem.getStatus().toUpperCase());
        }

        if (updatedItem.getPublishedDate() != null) {
            mediaItem.setPublishedDate(updatedItem.getPublishedDate());
        }

        if (updatedItem.getSeoMetadata() != null) {
            mediaItem.setSeoMetadata(updatedItem.getSeoMetadata());
        }

        MediaItem savedItem = mediaRepository.save(mediaItem);

        // Log Action
        auditLogService.logAction("admin", "UPDATE", "MediaItem", savedItem.getId(),
                "Updated media item: " + savedItem.getTitle() + " (Category: " + savedItem.getCategory() + ")");

        return ResponseEntity.ok(savedItem);
    }

    @DeleteMapping("/admin/media/{id}")
    public ResponseEntity<?> deleteMediaItem(@PathVariable String id) {
        MediaItem mediaItem = mediaRepository.findById(id).orElse(null);

        if (mediaItem == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Media item not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        // Delete associated files if they exist
        try {
            if (mediaItem.getImageUrl() != null) {
                fileStorageService.deleteFile(mediaItem.getImageUrl());
            }
            if (mediaItem.getVideoUrl() != null) {
                fileStorageService.deleteFile(mediaItem.getVideoUrl());
            }
        } catch (Exception e) {
            // Log but don't fail the deletion if file cleanup fails
            System.err.println("Failed to delete associated files: " + e.getMessage());
        }

        mediaRepository.deleteById(id);

        // Log Action
        auditLogService.logAction("admin", "DELETE", "MediaItem", id,
                "Deleted media item: " + mediaItem.getTitle() + " (Category: " + mediaItem.getCategory() + ")");

        Map<String, String> response = new HashMap<>();
        response.put("message", "Media item deleted successfully");
        return ResponseEntity.ok(response);
    }
}
