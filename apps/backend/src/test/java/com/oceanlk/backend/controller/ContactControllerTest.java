package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.ContactMessage;
import com.oceanlk.backend.service.EmailService;
import com.oceanlk.backend.repository.ContactMessageRepository;
import com.oceanlk.backend.service.NotificationService;
import com.oceanlk.backend.service.AuditLogService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.TestPropertySource;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "GEMINI_API_KEY=test-key",
        "GEMINI_API_URL=http://test-url",
        "GEMINI_API_SYSTEM_PROMPT=test-prompt"
})
public class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EmailService emailService;

    @MockBean
    private ContactMessageRepository contactMessageRepository;

    @MockBean
    private NotificationService notificationService;

    @MockBean
    private AuditLogService auditLogService;

    @Test
    void testSubmitContactForm_Success() throws Exception {
        String json = "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"phone\":\"123456789\",\"subject\":\"Inquiry\",\"message\":\"Hello\"}";

        ContactMessage mockSaved = new ContactMessage();
        mockSaved.setId("test-id");
        mockSaved.setName("John Doe");
        mockSaved.setSubject("Inquiry");

        when(contactMessageRepository.save(any(ContactMessage.class))).thenReturn(mockSaved);

        mockMvc.perform(post("/api/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());

        verify(contactMessageRepository).save(any(ContactMessage.class));
    }
}
