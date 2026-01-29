package com.oceanlk.backend.service;

import com.oceanlk.backend.model.WhatsAppConfig;
import com.oceanlk.backend.repository.WhatsAppRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WhatsAppService {

    private final WhatsAppRepository whatsAppRepository;
    private final AuditLogService auditLogService;

    public WhatsAppConfig getConfig() {
        return whatsAppRepository.findFirstBy().orElseGet(() -> {
            WhatsAppConfig defaultConfig = new WhatsAppConfig();
            defaultConfig.setPhoneNumber("");
            defaultConfig.setAgentName("Customer Support");
            defaultConfig.setActive(false);
            defaultConfig.setWelcomeMessage("Hello! How can we help you today?");
            return whatsAppRepository.save(defaultConfig);
        });
    }

    public WhatsAppConfig updateConfig(WhatsAppConfig newConfig, String adminUsername) {
        WhatsAppConfig existingConfig = getConfig();

        String oldDetails = String.format("Phone: %s, Agent: %s, Active: %b",
                existingConfig.getPhoneNumber(), existingConfig.getAgentName(), existingConfig.isActive());

        existingConfig.setPhoneNumber(newConfig.getPhoneNumber());
        existingConfig.setAgentName(newConfig.getAgentName());
        existingConfig.setActive(newConfig.isActive());
        existingConfig.setWelcomeMessage(newConfig.getWelcomeMessage());

        WhatsAppConfig savedConfig = whatsAppRepository.save(existingConfig);

        String newDetails = String.format("Phone: %s, Agent: %s, Active: %b",
                savedConfig.getPhoneNumber(), savedConfig.getAgentName(), savedConfig.isActive());

        auditLogService.logAction(
                adminUsername,
                "UPDATE_WHATSAPP_CONFIG",
                "WhatsAppConfig",
                savedConfig.getId(),
                String.format("Updated WhatsApp configuration. Before: [%s], After: [%s]", oldDetails, newDetails));

        return savedConfig;
    }
}
