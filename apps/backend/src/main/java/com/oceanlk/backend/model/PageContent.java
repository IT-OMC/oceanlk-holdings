package com.oceanlk.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "page_content")
public class PageContent {
    @Id
    private String id;

    private String pageIdentifier; // e.g., "HOME", "ABOUT", "CONTACT"
    private String sectionIdentifier; // e.g., "HERO", "MISSION", "VISION"

    private String title;
    private String subtitle;
    private String content;

    private String imageUrl;

    private String ctaText;
    private String ctaLink;
}
