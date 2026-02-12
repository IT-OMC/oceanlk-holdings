package com.oceanlk.backend.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "testimonials")
public class Testimonial {
    @Id
    private Integer id;
    @NotBlank(message = "Name is required")
    private String name;
    private String position;
    @NotBlank(message = "Company is required")
    private String company;
    private String image;
    private String quote;
    @Min(1)
    @Max(5)
    private int rating;
}
