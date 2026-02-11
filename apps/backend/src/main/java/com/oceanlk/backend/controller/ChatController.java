package com.oceanlk.backend.controller;

import com.oceanlk.backend.dto.ChatRequest;
import com.oceanlk.backend.dto.ChatResponse;
import com.oceanlk.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/message")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        String responseText = chatService.processMessage(request.getMessage());
        return ResponseEntity.ok(new ChatResponse(responseText));
    }
}
