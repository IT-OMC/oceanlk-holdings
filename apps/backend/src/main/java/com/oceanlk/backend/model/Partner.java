package com.oceanlk.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "partners")
public class Partner {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
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
