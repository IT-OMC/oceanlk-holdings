package com.oceanlk.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "whatsapp_config")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WhatsAppConfig {
    @Id
    private String id;
    private String phoneNumber;
    private String agentName;
    private boolean isActive;
    private String welcomeMessage;
}
