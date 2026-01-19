package com.oceanlk.backend.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "updates")
public class NewsUpdate {
    @Id
    private Integer id; // keeping as Integer to match current frontend ID style, or could change to
                        // String UUID
    @NotBlank(message = "Company ID is required")
    private String companyId;
    @NotBlank
    private String companyName;
    private String companyLogo;
    private String image;
    @NotBlank
    private String caption;
    private int likes;
    private String date;
    private String size; // "large", "medium", "small"
}
