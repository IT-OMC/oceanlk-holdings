package com.oceanlk.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {

    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    private String type; // "INFO", "WARNING", "ERROR", "SUCCESS"

    private String recipientId;

    private String recipientRole;

    private String link;

    private String relatedEntity;

    private String relatedId;
}
