package com.oceanlk.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "media_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MediaItem {

    @Id
    private String id;

    private String title;
    private String description;
    private String excerpt; // Short summary for previews (News/Blog)
    private String imageUrl;
    private String videoUrl;
    private String category; // NEWS, BLOG, MEDIA, GALLERY, PRESS_RELEASE, EVENTS, LIFE_AT_OCH
    private String type; // ARTICLE, VIDEO, GALLERY, DOCUMENT (for MEDIA category)
    private String companyId; // Associated company ID (optional, required for GALLERY)
    private String company; // Company name for display
    private boolean featured;

    // Blog-specific fields
    private String author;
    private String readTime; // e.g., "5 min read"

    // Media-specific fields
    private String duration; // For videos, e.g., "12:45"
    private Integer photoCount; // For galleries
    private Integer pageCount; // For documents

    private LocalDateTime publishedDate;
    private String status; // PUBLISHED, DRAFT, ARCHIVED

    public MediaItem(String title, String description, String imageUrl,
            String videoUrl, String category, boolean featured) {
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.videoUrl = videoUrl;
        this.category = category;
        this.featured = featured;
        this.publishedDate = LocalDateTime.now();
        this.status = "PUBLISHED";
    }
}
