package com.oceanlk.backend.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "gallery")
public class GalleryItem {
    @Id
    private Integer id;
    @NotBlank
    private String image;
    private String video;
    @NotBlank
    private String title;
    private String category;
}
