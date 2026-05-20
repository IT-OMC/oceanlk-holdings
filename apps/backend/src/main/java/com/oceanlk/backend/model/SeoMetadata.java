package com.oceanlk.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Embeddable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class SeoMetadata {
    private String metaTitle;
    private String metaDescription;
    private String keywords;
    private String ogImage; // Open Graph Image URL
    private String canonicalUrl;
}
