package com.oceanlk.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "media_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MediaItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String excerpt; // Short summary for previews (News/Blog)

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String videoUrl;

    private String category; // NEWS, BLOG, MEDIA, GALLERY, PRESS_RELEASE, EVENTS, LIFE_AT_OCH
    @Column(name = "media_group")
    private String group; // MEDIA_PANEL, HR_PANEL
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

    @ElementCollection
    @CollectionTable(name = "media_item_gallery_images", joinColumns = @JoinColumn(name = "media_item_id"))
    @Column(name = "image_url", columnDefinition = "TEXT")
    private java.util.List<String> galleryImages; // For ALBUM type

    private LocalDate publishedDate;
    private String status; // PUBLISHED, DRAFT, ARCHIVED

    @Embedded
    private SeoMetadata seoMetadata;

    public MediaItem(String title, String description, String imageUrl,
            String videoUrl, String category, boolean featured) {
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.videoUrl = videoUrl;
        this.category = category;
        this.featured = featured;
        this.publishedDate = LocalDate.now();
        this.status = "PUBLISHED";
        this.group = "MEDIA_PANEL";
    }
}
