package com.oceanlk.backend.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import jakarta.persistence.*;
import java.util.List;
import java.util.Map;

@Data
@Entity
@Table(name = "companies")
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank(message = "Title is required")
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description; // Renamed from desc

    @Column(columnDefinition = "TEXT")
    private String longDescription;

    private String logoUrl; // Renamed from logo
    private String website; // New
    private String industry; // New
    private String established; // Renamed from founded

    @Column(columnDefinition = "TEXT")
    private String image;

    private String video;
    private String employees;
    private String revenue;
    private String category;

    @ElementCollection(fetch = jakarta.persistence.FetchType.EAGER)
    @CollectionTable(name = "company_stats", joinColumns = @JoinColumn(name = "company_id"))
    private List<Stat> stats;

    // Keyed by platform: "facebook", "x", "linkedin", "instagram". Missing/absent
    // key means the platform isn't shown for this company.
    @ElementCollection(fetch = jakarta.persistence.FetchType.EAGER)
    @CollectionTable(name = "company_social_links", joinColumns = @JoinColumn(name = "company_id"))
    @MapKeyColumn(name = "platform")
    @Column(name = "url", columnDefinition = "TEXT")
    private Map<String, String> socialLinks;

    @Data
    @Embeddable
    public static class Stat {
        private String label;
        private String value;
        private String icon; // Store icon name as string
    }
}
