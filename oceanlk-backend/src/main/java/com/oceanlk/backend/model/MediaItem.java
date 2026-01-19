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
    private String imageUrl;
    private String videoUrl;
    private String category; // NEWS, EVENTS, AWARDS, etc.
    private boolean featured;

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
