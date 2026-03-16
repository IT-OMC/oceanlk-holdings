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
        "GEMINI_API_KEY=AIzaSyCxzSeTQyk652Zok8c1RQv5o1_7C65BEUc",
        "GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        "GEMINI_API_SYSTEM_PROMPT=test-prompt",
        "MONGODB_URI=mongodb+srv://dm_db_user:PHrM7yAtlXCx4i52@cluster0.xe161cj.mongodb.net/oceanlk",
        "JWT_SECRET=dGVzdC1zZWNyZXQta2V5LWZvci10ZXN0aW5nLW9ubHktZG8tbm90LXVzZS1pbi1wcm9kdWN0aW9u"
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
