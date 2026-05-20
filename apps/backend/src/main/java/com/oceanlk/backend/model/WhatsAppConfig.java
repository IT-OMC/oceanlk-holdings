package com.oceanlk.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

@Entity
@Table(name = "whatsapp_config")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WhatsAppConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String phoneNumber;
    private String agentName;
    private boolean isActive;
    @Column(columnDefinition = "TEXT")
    private String welcomeMessage;
}
