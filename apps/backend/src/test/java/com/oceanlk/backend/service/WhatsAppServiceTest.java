package com.oceanlk.backend.service;

import com.oceanlk.backend.model.WhatsAppConfig;
import com.oceanlk.backend.repository.WhatsAppRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WhatsAppServiceTest {

    @Mock
    private WhatsAppRepository whatsAppRepository;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private WhatsAppService whatsAppService;

    private WhatsAppConfig testConfig;

    @BeforeEach
    void setUp() {
        testConfig = new WhatsAppConfig();
        testConfig.setId("config-123");
        testConfig.setPhoneNumber("+1234567890");
        testConfig.setAgentName("Support Agent");
        testConfig.setActive(true);
        testConfig.setWelcomeMessage("Hello!");
    }

    @Test
    void getConfig_ShouldReturnExistingConfig() {
        // Arrange
        when(whatsAppRepository.findFirstBy()).thenReturn(Optional.of(testConfig));

        // Act
        WhatsAppConfig result = whatsAppService.getConfig();

        // Assert
        assertEquals("+1234567890", result.getPhoneNumber());
        verify(whatsAppRepository, times(1)).findFirstBy();
    }

    @Test
    void getConfig_ShouldCreateDefault_WhenNoneExists() {
        // Arrange
        when(whatsAppRepository.findFirstBy()).thenReturn(Optional.empty());
        when(whatsAppRepository.save(any(WhatsAppConfig.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act
        WhatsAppConfig result = whatsAppService.getConfig();

        // Assert
        assertNotNull(result);
        assertEquals("", result.getPhoneNumber()); // Default
        verify(whatsAppRepository, times(1)).findFirstBy();
        verify(whatsAppRepository, times(1)).save(any(WhatsAppConfig.class));
    }

    @Test
    void updateConfig_ShouldUpdateAndLog() {
        // Arrange
        WhatsAppConfig newConfig = new WhatsAppConfig();
        newConfig.setPhoneNumber("+0987654321");
        newConfig.setAgentName("New Agent");
        newConfig.setActive(false);
        newConfig.setWelcomeMessage("Hi!");

        when(whatsAppRepository.findFirstBy()).thenReturn(Optional.of(testConfig));
        when(whatsAppRepository.save(any(WhatsAppConfig.class))).thenReturn(testConfig);
        doNothing().when(auditLogService).logAction(anyString(), anyString(), anyString(), anyString(), anyString());

        // Act
        WhatsAppConfig result = whatsAppService.updateConfig(newConfig, "admin");

        // Assert
        assertEquals("+0987654321", result.getPhoneNumber());
        assertFalse(result.isActive());
        verify(whatsAppRepository, times(1)).save(testConfig);
        verify(auditLogService, times(1)).logAction(eq("admin"), eq("UPDATE_WHATSAPP_CONFIG"), anyString(), anyString(),
                anyString());
    }
}
