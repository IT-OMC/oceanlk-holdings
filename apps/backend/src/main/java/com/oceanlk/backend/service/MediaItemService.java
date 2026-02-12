package com.oceanlk.backend.service;

import com.oceanlk.backend.model.MediaItem;
import com.oceanlk.backend.repository.MediaItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MediaItemService {

    @Autowired
    private MediaItemRepository mediaItemRepository;

    @Autowired
    private FileStorageService fileStorageService;

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
}
