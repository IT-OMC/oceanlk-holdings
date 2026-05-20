package com.oceanlk.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "page_content")
public class PageContent {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String pageIdentifier; // e.g., "HOME", "ABOUT", "CONTACT"
    private String sectionIdentifier; // e.g., "HERO", "MISSION", "VISION"

    private String title;
    private String subtitle;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String imageUrl;

    private String ctaText;
    private String ctaLink;
}
