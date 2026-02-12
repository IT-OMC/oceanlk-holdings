package com.oceanlk.backend.dto.gemini;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeminiResponse {
    private List<GeminiCandidate> candidates;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GeminiCandidate {
        private GeminiContent content;
        private String finishReason;
        private int index;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GeminiContent {
        private String role;
        private List<GeminiPart> parts;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GeminiPart {
        private String text;
    }
}
