package com.oceanlk.backend.service;

import com.oceanlk.backend.dto.gemini.GeminiRequest;
import com.oceanlk.backend.dto.gemini.GeminiResponse;
import com.oceanlk.backend.dto.gemini.GeminiRequest.GeminiContent;
import com.oceanlk.backend.dto.gemini.GeminiRequest.GeminiPart;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.ArrayList;
import java.util.List;
import java.time.Duration;
import reactor.util.retry.Retry;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatService {

    private final WebClient.Builder webClientBuilder;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    @Value("${gemini.api.system-prompt}")
    private String systemPrompt;

    public String processMessage(String userMessage) {
        log.info("Processing chat message: {}", userMessage);

        try {
            // Construct the request
            GeminiRequest request = new GeminiRequest();
            List<GeminiContent> contents = new ArrayList<>();

            // Prepend system prompt to the user message
            String fullPrompt = systemPrompt + "\n\nUser Question: " + userMessage;

            GeminiPart part = new GeminiPart(fullPrompt);
            GeminiContent content = new GeminiContent();
            content.setRole("user");
            content.setParts(Collections.singletonList(part));

            request.setContents(Collections.singletonList(content));

            // Call API
            // Using the URL from application.properties which should be set to
            // gemini-2.0-flash
            GeminiResponse response = webClientBuilder.build()
                    .post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(GeminiResponse.class)
                    .retryWhen(Retry.backoff(3, Duration.ofSeconds(2))
                            .filter(throwable -> throwable instanceof Exception)) // Retry on any exception for now,
                                                                                  // ideally filter for 429/5xx
                    .block();

            if (response != null && response.getCandidates() != null && !response.getCandidates().isEmpty()) {
                GeminiResponse.GeminiCandidate candidate = response.getCandidates().get(0);
                if (candidate.getContent() != null && candidate.getContent().getParts() != null
                        && !candidate.getContent().getParts().isEmpty()) {
                    return candidate.getContent().getParts().get(0).getText();
                }
            }

            return "I apologize, I couldn't process your request at the moment.";

        } catch (WebClientResponseException e) {
            log.error("Gemini API Error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return "Error from Gemini: " + e.getResponseBodyAsString();
        } catch (Exception e) {
            log.error("Error calling Gemini API", e);
            return "Error: " + e.getMessage();
        }
    }
}
