package com.oceanlk.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "job_opportunities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobOpportunity {

    @Id
    private String id;

    private String title;
    private String company;
    private String location;
    private String type; // Full-time, Part-time, Contract, etc.
    private String category; // Engineering, Hospitality, Technology, etc.
    private String description;
    private boolean featured;
    private String level; // Junior, Mid-Senior, Senior, Manager, etc.

    private LocalDateTime postedDate;
    private String status; // ACTIVE, INACTIVE, CLOSED

    public JobOpportunity(String title, String company, String location, String type,
            String category, String description, boolean featured, String level) {
        this.title = title;
        this.company = company;
        this.location = location;
        this.type = type;
        this.category = category;
        this.description = description;
        this.featured = featured;
        this.level = level;
        this.postedDate = LocalDateTime.now();
        this.status = "ACTIVE";
    }
}
