package com.oceanlk.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "leadership_categories")
public class LeadershipCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String code; // BOARD, EXECUTIVE, SENIOR (immutable identifier)
    private String title; // Display name (editable)
    private String subtitle; // Subtitle for the section
    private Integer displayOrder;

    public LeadershipCategory(String code, String title, String subtitle, Integer displayOrder) {
        this.code = code;
        this.title = title;
        this.subtitle = subtitle;
        this.displayOrder = displayOrder;
    }
}
