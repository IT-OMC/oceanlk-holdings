package com.oceanlk.backend.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import jakarta.persistence.*;

@Data
@Entity
@Table(name = "testimonials")
public class Testimonial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @NotBlank(message = "Name is required")
    private String name;
    private String position;
    @NotBlank(message = "Company is required")
    private String company;
    private String image;
    @Column(columnDefinition = "TEXT")
    private String quote;
    @Min(1)
    @Max(5)
    private int rating;
}
