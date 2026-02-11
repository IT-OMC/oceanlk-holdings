package com.oceanlk.backend.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.reactive.function.client.WebClient;

import com.oceanlk.backend.dto.gemini.GeminiRequest;
import com.oceanlk.backend.dto.gemini.GeminiResponse;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Mock
    private WebClient.Builder webClientBuilder;

    @InjectMocks
    private ChatService chatService;

    @Mock
    private WebClient webClient;

    @Mock
    private WebClient.RequestBodyUriSpec requestBodyUriSpec;

    @Mock
    private WebClient.RequestBodySpec requestBodySpec;

    @Mock
    private WebClient.RequestHeadersSpec requestHeadersSpec;

    @Mock
    private WebClient.ResponseSpec responseSpec;

    @Test
    void init_ShouldThrowException_WhenApiKeyIsMissing() {
        // Arrange
        ReflectionTestUtils.setField(chatService, "apiKey", "");

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> chatService.init());
    }

    @Test
    void init_ShouldSucceed_WhenApiKeyIsPresent() {
        // Arrange
        ReflectionTestUtils.setField(chatService, "apiKey", "test-key");

        // Act & Assert
        assertDoesNotThrow(() -> chatService.init());
    }

    @Test
    void processMessage_ShouldReturnResponse_WhenApiCallSucceeds() {
        // Arrange
        ReflectionTestUtils.setField(chatService, "apiKey", "test-key");
        ReflectionTestUtils.setField(chatService, "apiUrl", "https://api.example.com");

        GeminiResponse mockResponse = new GeminiResponse();
        GeminiResponse.GeminiCandidate candidate = new GeminiResponse.GeminiCandidate();
        GeminiResponse.GeminiContent content = new GeminiResponse.GeminiContent();
        GeminiResponse.GeminiPart part = new GeminiResponse.GeminiPart("AI Response");
        content.setParts(java.util.Collections.singletonList(part));
        candidate.setContent(content);
        mockResponse.setCandidates(java.util.Collections.singletonList(candidate));

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri(anyString())).thenReturn(requestBodySpec);
        when(requestBodySpec.bodyValue(any())).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(GeminiResponse.class)).thenReturn(reactor.core.publisher.Mono.just(mockResponse));

        // Act
        String result = chatService.processMessage("Hello");

        // Assert
        assertEquals("AI Response", result);
    }

    @Test
    void processMessage_ShouldReturnError_WhenApiCallFails() {
        // Arrange
        ReflectionTestUtils.setField(chatService, "apiKey", "test-key");
        ReflectionTestUtils.setField(chatService, "apiUrl", "https://api.example.com");

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri(anyString())).thenReturn(requestBodySpec);
        when(requestBodySpec.bodyValue(any())).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);

        // Mock 401 Unauthorized
        when(responseSpec.bodyToMono(GeminiResponse.class)).thenReturn(reactor.core.publisher.Mono.error(
                new org.springframework.web.reactive.function.client.WebClientResponseException(
                        401, "Unauthorized", null, null, null)));

        // Act
        String result = chatService.processMessage("Hello");

        // Assert
        assertTrue(result.contains("authentication issues"));
    }

    @Test
    void processMessage_ShouldReturnFallback_WhenResponseIsInvalid() {
        // Arrange
        ReflectionTestUtils.setField(chatService, "apiKey", "test-key");
        ReflectionTestUtils.setField(chatService, "apiUrl", "https://api.example.com");

        // Empty response
        GeminiResponse mockResponse = new GeminiResponse();

        when(webClientBuilder.build()).thenReturn(webClient);
        when(webClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri(anyString())).thenReturn(requestBodySpec);
        when(requestBodySpec.bodyValue(any())).thenReturn(requestHeadersSpec);
        when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.bodyToMono(GeminiResponse.class)).thenReturn(reactor.core.publisher.Mono.just(mockResponse));

        // Act
        String result = chatService.processMessage("Hello");

        // Assert
        assertTrue(result.contains("couldn't process your request"));
    }
}
