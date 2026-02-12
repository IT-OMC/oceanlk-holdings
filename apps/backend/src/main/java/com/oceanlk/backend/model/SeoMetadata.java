package com.oceanlk.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeoMetadata {
    private String metaTitle;
    private String metaDescription;
    private String keywords;
    private String ogImage; // Open Graph Image URL
    private String canonicalUrl;
}
