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
    private String desc;
    private String longDescription;
    private String logo;
    private String image;
    private String video;
    private String founded;
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
