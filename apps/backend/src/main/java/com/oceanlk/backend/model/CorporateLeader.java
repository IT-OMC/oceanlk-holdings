package com.oceanlk.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "corporate_leaders")
public class CorporateLeader {
    @Id
    private String id;

    private String name;
    private String position;
    private String department; // "BOARD", "EXECUTIVE", "SENIOR"

    private String image;
    private String bio; // For the "Read More" section
    private String shortDescription; // For the card view

    private String linkedin;
    private String email;

    private Integer displayOrder;

    public CorporateLeader(String name, String position, String department, String image, String bio,
            String shortDescription) {
        this.name = name;
        this.position = position;
        this.department = department;
        this.image = image;
        this.bio = bio;
        this.shortDescription = shortDescription;
        this.displayOrder = 0;
    }
}
