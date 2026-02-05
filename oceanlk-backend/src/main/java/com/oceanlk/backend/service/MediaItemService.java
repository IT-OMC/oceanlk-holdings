package com.oceanlk.backend.service;

import com.oceanlk.backend.model.MediaItem;
import com.oceanlk.backend.repository.CompanyRepository;
import com.oceanlk.backend.repository.MediaItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MediaItemService {

    private final MediaItemRepository mediaItemRepository;
    private final FileStorageService fileStorageService;
    private final CompanyRepository companyRepository;

    public List<MediaItem> getAllMediaItems() {
        return mediaItemRepository.findAll();
    }

    public List<MediaItem> getMediaItemsByCategory(String category) {
        return mediaItemRepository.findByCategory(category);
    }

    public Optional<MediaItem> getMediaItemById(String id) {
        return mediaItemRepository.findById(id);
    }

    public MediaItem createMediaItem(MediaItem mediaItem) {
        return mediaItemRepository.save(mediaItem);
    }

    public MediaItem updateMediaItem(String id, MediaItem mediaItemDetails) {
        MediaItem mediaItem = mediaItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Media item not found with id: " + id));

        mediaItem.setTitle(mediaItemDetails.getTitle());
        mediaItem.setDescription(mediaItemDetails.getDescription());
        mediaItem.setExcerpt(mediaItemDetails.getExcerpt());
        mediaItem.setImageUrl(mediaItemDetails.getImageUrl());
        mediaItem.setVideoUrl(mediaItemDetails.getVideoUrl());
        mediaItem.setCategory(mediaItemDetails.getCategory());
        mediaItem.setGroup(mediaItemDetails.getGroup());
        mediaItem.setType(mediaItemDetails.getType());
        mediaItem.setCompanyId(mediaItemDetails.getCompanyId());
        mediaItem.setCompany(mediaItemDetails.getCompany());
        mediaItem.setFeatured(mediaItemDetails.isFeatured());
        mediaItem.setAuthor(mediaItemDetails.getAuthor());
        mediaItem.setReadTime(mediaItemDetails.getReadTime());
        mediaItem.setDuration(mediaItemDetails.getDuration());
        mediaItem.setPhotoCount(mediaItemDetails.getPhotoCount());
        mediaItem.setPageCount(mediaItemDetails.getPageCount());
        mediaItem.setGalleryImages(mediaItemDetails.getGalleryImages());
        mediaItem.setPublishedDate(mediaItemDetails.getPublishedDate());
        mediaItem.setStatus(mediaItemDetails.getStatus());

        return mediaItemRepository.save(mediaItem);
    }

    public void deleteMediaItem(String id) {
        MediaItem mediaItem = mediaItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Media item not found with id: " + id));

        // Delete associated files if they exist
        try {
            if (mediaItem.getImageUrl() != null) {
                fileStorageService.deleteFile(mediaItem.getImageUrl());
            }
            if (mediaItem.getVideoUrl() != null) {
                fileStorageService.deleteFile(mediaItem.getVideoUrl());
            }
        } catch (Exception e) {
            System.err.println("Error deleting media files: " + e.getMessage());
        }

        mediaItemRepository.deleteById(id);
    }

    public List<MediaItem> getPublishedMedia() {
        return mediaItemRepository.findByStatusOrderByPublishedDateDesc("PUBLISHED");
    }

    public List<Map<String, Object>> getEnrichedGalleryMedia() {
        List<MediaItem> mediaItems = getPublishedMedia();

        List<MediaItem> filteredItems = mediaItems.stream()
                .filter(item -> "Gallery".equalsIgnoreCase(item.getCategory())
                        && "MEDIA_PANEL".equalsIgnoreCase(item.getGroup()))
                .collect(Collectors.toList());

        // Optimization: Fetch all companies in one go
        java.util.Set<String> companyIds = filteredItems.stream()
                .map(MediaItem::getCompanyId)
                .filter(id -> id != null && !id.isEmpty())
                .collect(Collectors.toSet());

        Map<String, com.oceanlk.backend.model.Company> companyMap = companyRepository.findAllById(companyIds).stream()
                .collect(Collectors.toMap(com.oceanlk.backend.model.Company::getId, c -> c));

        return filteredItems.stream()
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
                    if (companyId != null && companyMap.containsKey(companyId)) {
                        com.oceanlk.backend.model.Company company = companyMap.get(companyId);
                        enriched.put("company", company.getTitle());
                        enriched.put("companyId", company.getId());
                    }

                    return enriched;
                })
                .collect(Collectors.toList());
    }

    public List<MediaItem> getNewsArticles() {
        return mediaItemRepository.findByCategoryAndGroupAndStatusOrderByPublishedDateDesc("NEWS", "MEDIA_PANEL",
                "PUBLISHED");
    }

    public List<MediaItem> getBlogPosts() {
        return mediaItemRepository.findByCategoryAndGroupAndStatusOrderByPublishedDateDesc("BLOG", "MEDIA_PANEL",
                "PUBLISHED");
    }

    public List<MediaItem> getMediaItems() {
        List<MediaItem> media = mediaItemRepository.findByCategoryInAndGroupAndStatusOrderByPublishedDateDesc(
                java.util.Arrays.asList("MEDIA", "GALLERY"), "MEDIA_PANEL", "PUBLISHED");

        // Optimization: Fetch all companies in one go
        java.util.Set<String> companyIds = media.stream()
                .map(MediaItem::getCompanyId)
                .filter(id -> id != null && !id.isEmpty())
                .collect(Collectors.toSet());

        Map<String, com.oceanlk.backend.model.Company> companyMap = companyRepository.findAllById(companyIds).stream()
                .collect(Collectors.toMap(com.oceanlk.backend.model.Company::getId, c -> c));

        // Enrich with company name if companyId is present
        media.forEach(item -> {
            if (item.getCompanyId() != null && !item.getCompanyId().isEmpty()
                    && companyMap.containsKey(item.getCompanyId())) {
                item.setCompany(companyMap.get(item.getCompanyId()).getTitle());
            }
        });
        return media;
    }

    public List<MediaItem> getAdminMedia(String group) {
        if (group != null && !group.isEmpty()) {
            return mediaItemRepository.findByGroupOrderByPublishedDateDesc(group);
        } else {
            return mediaItemRepository.findAll();
        }
    }
}
