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

    @ElementCollection(fetch = jakarta.persistence.FetchType.EAGER)
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

    /**
     * Defensive defaulting so items never end up with a NULL status/group.
     * Several creation paths (admin CREATE via pending-change approval,
     * direct SUPER_ADMIN create, the "add" forms in the admin UI) build a
     * MediaItem without ever setting "group" explicitly. The public
     * endpoints (/api/media/news, /api/media/blogs, ...) filter with an
     * exact match on group, so a NULL group silently makes the item
     * invisible on the public site even though status=PUBLISHED and it's
     * sitting right there in the media_items table.
     *
     * Runs on both INSERT and UPDATE: MediaController#updateMediaItem does
     * mediaItem.setGroup(updatedItem.getGroup()) unconditionally, so an
     * edit made through an admin form that also doesn't send "group"
     * (e.g. NewsManagement's edit dialog) would otherwise null out a
     * previously-correct group and make an already-visible article
     * disappear again after being edited.
     */
    @PrePersist
    @PreUpdate
    public void applyDefaultsBeforeSave() {
        if (this.status == null || this.status.isEmpty()) {
            this.status = "PUBLISHED";
        }
        if (this.group == null || this.group.isEmpty()) {
            this.group = "LIFE_AT_OCH".equalsIgnoreCase(this.category) ? "HR_PANEL" : "MEDIA_PANEL";
        }
    }
}
