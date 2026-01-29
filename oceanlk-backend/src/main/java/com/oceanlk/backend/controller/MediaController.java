package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.MediaItem;
import com.oceanlk.backend.repository.CompanyRepository;
import com.oceanlk.backend.repository.MediaItemRepository;
import com.oceanlk.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.lang.NonNull;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:4173" })
@Slf4j
public class MediaController {

    private final MediaItemRepository mediaRepository;
    private final FileStorageService fileStorageService;
    private final CompanyRepository companyRepository;
    private final com.oceanlk.backend.service.AuditLogService auditLogService;

    private final com.oceanlk.backend.service.PendingChangeService pendingChangeService;

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
                        String companyId = item.getCompanyId();
                        if (companyId != null) {
                            companyRepository.findById(companyId)
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
    public ResponseEntity<?> getMediaItemById(@PathVariable @NonNull String id) {
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
            // Security: Scaleable size limit
            long maxSize = 20 * 1024 * 1024; // 20MB
            if (file.getSize() > maxSize) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "File too large. Maximum size is 20MB."));
            }

            // Security: Basic type validation
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.startsWith("image/") && !contentType.startsWith("video/"))) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid file type. Only images and videos are allowed."));
            }

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
    public ResponseEntity<?> createMediaItem(@RequestBody MediaItem mediaItem,
            java.security.Principal principal,
            org.springframework.security.core.Authentication authentication) {
        try {
            if (mediaItem.getStatus() == null || mediaItem.getStatus().isEmpty()) {
                mediaItem.setStatus("PUBLISHED"); // Default
            } else {
                mediaItem.setStatus(mediaItem.getStatus().toUpperCase());
            }

            // Check if user is superadmin
            boolean isSuperAdmin = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

            if (isSuperAdmin) {
                MediaItem savedItem = mediaRepository.save(mediaItem);

                // Record in history for Super Admin
                pendingChangeService.createApprovedChange(
                        "MediaItem", savedItem.getId(), "CREATE", principal.getName(), savedItem, null);

                // Log Action
                auditLogService.logAction(principal.getName(), "CREATE", "MediaItem", savedItem.getId(),
                        "Created media item: " + savedItem.getTitle() + " (Category: " + savedItem.getCategory() + ")");

                return ResponseEntity.status(HttpStatus.CREATED).body(savedItem);
            } else {
                // Admin: Create pending change
                com.oceanlk.backend.model.PendingChange pendingChange = pendingChangeService.createPendingChange(
                        "MediaItem", null, "CREATE", principal.getName(), mediaItem, null);
                auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL", "MediaItem", null,
                        "Submitted new media item for approval: " + mediaItem.getTitle());
                return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                        "message", "Media item submitted for approval",
                        "pendingChange", pendingChange));
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create media item: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/admin/media/{id}")
    public ResponseEntity<?> updateMediaItem(@PathVariable @NonNull String id,
            @RequestBody MediaItem updatedItem,
            java.security.Principal principal,
            org.springframework.security.core.Authentication authentication) {
        MediaItem mediaItem = mediaRepository.findById(id).orElse(null);

        if (mediaItem == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Media item not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        // Check availability of pending changes logic
        // Check if user is superadmin
        boolean isSuperAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

        if (!isSuperAdmin) {
            // Check for existing pending change
            if (pendingChangeService.hasPendingChange(id)) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "This item already has a pending change awaiting approval"));
            }

            // Prepare updated object for pending change (create a copy or just use
            // updatedItem)
            // updatedItem might miss ID, ensuring it has it
            updatedItem.setId(id);

            // Admin: Create pending change
            com.oceanlk.backend.model.PendingChange pendingChange = pendingChangeService.createPendingChange(
                    "MediaItem", id, "UPDATE", principal.getName(), updatedItem, mediaItem);
            auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL", "MediaItem", id,
                    "Submitted media update for approval: " + updatedItem.getTitle());
            return ResponseEntity.ok(Map.of(
                    "message", "Media update submitted for approval",
                    "pendingChange", pendingChange));
        }

        // Super Admin - Proceed with update
        // Capture original state for history tracking
        MediaItem existingOriginal = mediaRepository.findById(id).orElse(null);

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

        // Record in history for Super Admin
        pendingChangeService.createApprovedChange(
                "MediaItem", id, "UPDATE", principal.getName(), savedItem, existingOriginal);

        // Log Action
        auditLogService.logAction(principal.getName(), "UPDATE", "MediaItem", savedItem.getId(),
                "Updated media item: " + savedItem.getTitle() + " (Category: " + savedItem.getCategory() + ")");

        return ResponseEntity.ok(savedItem);
    }

    @DeleteMapping("/admin/media/{id}")
    public ResponseEntity<?> deleteMediaItem(@PathVariable @NonNull String id,
            java.security.Principal principal,
            org.springframework.security.core.Authentication authentication) {
        MediaItem mediaItem = mediaRepository.findById(id).orElse(null);

        if (mediaItem == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Media item not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        // Check if user is superadmin
        boolean isSuperAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

        if (!isSuperAdmin) {
            // Check for existing pending change
            if (pendingChangeService.hasPendingChange(id)) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "This item already has a pending change awaiting approval"));
            }

            // Admin: Create pending change for deletion
            com.oceanlk.backend.model.PendingChange pendingChange = pendingChangeService.createPendingChange(
                    "MediaItem", id, "DELETE", principal.getName(), mediaItem, mediaItem);
            auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL", "MediaItem", id,
                    "Submitted media deletion for approval");
            return ResponseEntity.ok(Map.of(
                    "message", "Media deletion submitted for approval",
                    "pendingChange", pendingChange));
        }

        // Super Admin: Direct Delete
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
            log.error("Failed to delete associated files: {}", e.getMessage());
        }

        mediaRepository.deleteById(id);

        // Record in history for Super Admin
        pendingChangeService.createApprovedChange(
                "MediaItem", id, "DELETE", principal.getName(), mediaItem, mediaItem);

        // Log Action
        auditLogService.logAction(principal.getName(), "DELETE", "MediaItem", id,
                "Deleted media item: " + mediaItem.getTitle() + " (Category: " + mediaItem.getCategory() + ")");

        Map<String, String> response = new HashMap<>();
        response.put("message", "Media item deleted successfully");
        return ResponseEntity.ok(response);
    }
}
