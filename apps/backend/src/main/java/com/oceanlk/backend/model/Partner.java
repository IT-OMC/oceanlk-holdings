package com.oceanlk.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "partners")
public class Partner {
    @Id
    private String id;

    private String name;
    private String logoUrl;
    private String websiteUrl;
    private String category; // "PARTNER", "MEMBERSHIP"
    private Integer displayOrder;

    public Partner(String name, String logoUrl, String websiteUrl) {
        this.name = name;
        this.logoUrl = logoUrl;
        this.websiteUrl = websiteUrl;
        this.category = "PARTNER"; // Default
        this.displayOrder = 0;
    }
}
