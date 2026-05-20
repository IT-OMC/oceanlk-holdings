package com.oceanlk.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.TestPropertySource;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "GEMINI_API_KEY=test-key",
        "GEMINI_API_URL=http://test-url",
        "GEMINI_API_SYSTEM_PROMPT=test-prompt",
        "MONGODB_URI=mongodb+srv://dm_db_user:PHrM7yAtlXCx4i52@cluster0.xe161cj.mongodb.net/oceanlk",
        "JWT_SECRET=dGVzdC1zZWNyZXQta2V5LWZvci10ZXN0aW5nLW9ubHktZG8tbm90LXVzZS1pbi1wcm9kdWN0aW9u"
})
public class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private com.oceanlk.backend.service.AuditLogService auditLogService;

    @MockBean
    private com.oceanlk.backend.service.NotificationService notificationService;

    @MockBean
    private com.oceanlk.backend.service.ChatService chatService;

    @MockBean
    private com.oceanlk.backend.service.SearchService searchService;

    @Test
    void testPublicEndpoint_AccessDeniedToMessages() throws Exception {
        mockMvc.perform(get("/api/contact/messages"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testSearch_Accessible() throws Exception {
        mockMvc.perform(get("/api/search?q=test"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testAdminManagement_AccessibleWithAdminRole() throws Exception {
        mockMvc.perform(get("/api/admin/management/list"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "SUPER_ADMIN")
    void testAuditLogs_AccessibleWithSuperAdminRole() throws Exception {
        mockMvc.perform(get("/api/admin/audit-logs"))
                .andExpect(status().isOk());
    }
}
