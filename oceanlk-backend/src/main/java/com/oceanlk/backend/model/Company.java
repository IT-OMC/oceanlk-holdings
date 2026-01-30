package com.oceanlk.backend.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "companies")
public class Company {
    @Id
    private String id;
    @NotBlank(message = "Title is required")
    private String title;
    private String description; // Renamed from desc
    private String longDescription;
    private String logoUrl; // Renamed from logo
    private String website; // New
    private String industry; // New
    private String established; // Renamed from founded
    private String image;
    private String video;
    private String employees;
    private String revenue;
    private String category;
    private List<Stat> stats;

    @Data
    public static class Stat {
        private String label;
        private String value;
        private String icon; // Store icon name as string
    }
}
