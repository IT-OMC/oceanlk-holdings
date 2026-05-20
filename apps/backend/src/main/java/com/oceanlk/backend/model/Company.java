package com.oceanlk.backend.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import jakarta.persistence.*;
import java.util.List;

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

    @ElementCollection
    @CollectionTable(name = "company_stats", joinColumns = @JoinColumn(name = "company_id"))
    private List<Stat> stats;

    @Data
    @Embeddable
    public static class Stat {
        private String label;
        private String value;
        private String icon; // Store icon name as string
    }
}
