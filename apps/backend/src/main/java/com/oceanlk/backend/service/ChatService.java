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

import jakarta.annotation.PostConstruct;
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

    /**
     * Validate API configuration on startup
     */
    @PostConstruct
    public void init() {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            log.warn("****************************************************************");
            log.warn("WARNING: GEMINI_API_KEY environment variable is not set!");
            log.warn("Chat functionality will not work properly.");
            log.warn("Please set GEMINI_API_KEY to enable AI chat features.");
            log.warn("Get your API key from: https://aistudio.google.com/");
            log.warn("****************************************************************");
        } else {
            log.info("Gemini API initialized successfully");
            log.info("Using model endpoint: {}", apiUrl);
            log.debug("API key configured: {}****", apiKey.substring(0, Math.min(8, apiKey.length())));
        }
    }

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

            log.debug("Sending request to Gemini API: {}", apiUrl);

            // Call API with improved error handling
            GeminiResponse response = webClientBuilder.build()
                    .post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(GeminiResponse.class)
                    .retryWhen(Retry.backoff(3, Duration.ofSeconds(2))
                            .filter(throwable -> {
                                // Only retry on 5xx server errors and network issues
                                if (throwable instanceof WebClientResponseException) {
                                    WebClientResponseException webEx = (WebClientResponseException) throwable;
                                    int statusCode = webEx.getStatusCode().value();
                                    // Don't retry on 4xx client errors (bad request, auth, etc.)
                                    return statusCode >= 500;
                                }
                                // Retry on other exceptions (network issues, timeouts, etc.)
                                return true;
                            })
                            .doBeforeRetry(retrySignal -> log.warn("Retrying Gemini API call. Attempt: {}",
                                    retrySignal.totalRetries() + 1)))
                    .block();

            if (response != null && response.getCandidates() != null && !response.getCandidates().isEmpty()) {
                GeminiResponse.GeminiCandidate candidate = response.getCandidates().get(0);
                if (candidate.getContent() != null && candidate.getContent().getParts() != null
                        && !candidate.getContent().getParts().isEmpty()) {
                    String responseText = candidate.getContent().getParts().get(0).getText();
                    log.debug("Received response from Gemini API: {} characters", responseText.length());
                    return responseText;
                }
            }

            log.warn("Gemini API returned empty response");
            return "I apologize, I couldn't process your request at the moment. Please try again.";

        } catch (WebClientResponseException e) {
            int statusCode = e.getStatusCode().value();
            String errorBody = e.getResponseBodyAsString();

            log.error("Gemini API Error - Status: {}, Response: {}", statusCode, errorBody);

            // Return user-friendly error messages based on status code
            if (statusCode == 400) {
                log.error("Bad Request - Check API request format or model name");
                return "I'm having trouble understanding the request format. Please try again or contact support.";
            } else if (statusCode == 401 || statusCode == 403) {
                log.error("Authentication Error - Check API key validity and permissions");
                return "I'm experiencing authentication issues. Please contact support.";
            } else if (statusCode == 429) {
                log.error("Rate Limit Exceeded - Too many requests");
                return "I'm receiving too many requests right now. Please wait a moment and try again.";
            } else if (statusCode >= 500) {
                log.error("Server Error - Gemini API is experiencing issues");
                return "The AI service is temporarily unavailable. Please try again in a moment.";
            }

            return "I apologize, I'm experiencing technical difficulties. Please try again later.";

        } catch (Exception e) {
            log.error("Unexpected error calling Gemini API: {}", e.getMessage(), e);
            return "I apologize, an unexpected error occurred. Please try again or contact support.";
        }
    }
}
