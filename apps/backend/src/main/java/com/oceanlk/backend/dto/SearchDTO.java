package com.oceanlk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

public class SearchDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SearchRequest {
        private String query;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SearchResponse {
        private String query;
        private Map<String, List<SearchResultItem>> results;
        private int totalResults;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SearchResultItem {
        private String type; // e.g., "company", "job", "media", "event"
        private String id;
        private String title;
        private String description;
        private String url; // Frontend URL to navigate to
        private String imageUrl; // Optional image/logo
        private String category; // Optional additional categorization
    }
}
