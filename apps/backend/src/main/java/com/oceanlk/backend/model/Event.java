package com.oceanlk.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank(message = "Title is required")
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private LocalTime time;

    private String location;

    private String imageUrl;

    @NotBlank(message = "Category is required")
    private String category; // SOCIAL, LEARNING, CELEBRATION, etc.

    private String status; // UPCOMING, ONGOING, COMPLETED

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
