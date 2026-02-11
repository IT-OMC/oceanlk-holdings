package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.WhatsAppConfig;
import com.oceanlk.backend.service.WhatsAppService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:4173" }, allowCredentials = "true")
public class WhatsAppController {

    private final WhatsAppService whatsAppService;

    @GetMapping("/api/public/whatsapp")
    public ResponseEntity<WhatsAppConfig> getPublicConfig() {
        WhatsAppConfig config = whatsAppService.getConfig();
        // Mask ID for public exposure if needed, but here we return the whole object as
        // requested
        return ResponseEntity.ok(config);
    }

    @PutMapping("/api/admin/whatsapp")
    public ResponseEntity<WhatsAppConfig> updateConfig(@RequestBody WhatsAppConfig config, Principal principal) {
        // Basic phone number validation (digits and optional + sign, length 10-15)
        if (config.getPhoneNumber() != null && !config.getPhoneNumber().matches("^\\+?[0-9]{10,15}$")) {
            return ResponseEntity.badRequest().build();
        }

        WhatsAppConfig updated = whatsAppService.updateConfig(config, principal.getName());
        return ResponseEntity.ok(updated);
    }
}
