package com.oceanlk.backend.service;

import com.oceanlk.backend.model.ContactMessage;
import com.oceanlk.backend.repository.ContactMessageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContactMessageServiceTest {

    @Mock
    private ContactMessageRepository contactMessageRepository;

    @InjectMocks
    private ContactMessageService contactMessageService;

    private ContactMessage testMessage;

    @BeforeEach
    void setUp() {
        testMessage = new ContactMessage();
        testMessage.setId("msg-123");
        testMessage.setName("John Doe");
        testMessage.setEmail("john@example.com");
        testMessage.setMessage("Test message");
        testMessage.setStatus("NEW");
        testMessage.setIsRead(false);
    }

    @Test
    void getAllMessages_ShouldReturnAllMessages() {
        // Arrange
        List<ContactMessage> messages = Arrays.asList(testMessage, new ContactMessage());
        when(contactMessageRepository.findAll()).thenReturn(messages);

        // Act
        List<ContactMessage> result = contactMessageService.getAllMessages();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(contactMessageRepository, times(1)).findAll();
    }

    @Test
    void getMessageById_ShouldReturnMessage_WhenExists() {
        // Arrange
        when(contactMessageRepository.findById("msg-123")).thenReturn(Optional.of(testMessage));

        // Act
        Optional<ContactMessage> result = contactMessageService.getMessageById("msg-123");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("John Doe", result.get().getName());
        verify(contactMessageRepository, times(1)).findById("msg-123");
    }

    @Test
    void createMessage_ShouldSaveMessage() {
        // Arrange
        when(contactMessageRepository.save(testMessage)).thenReturn(testMessage);

        // Act
        ContactMessage result = contactMessageService.createMessage(testMessage);

        // Assert
        assertNotNull(result);
        assertEquals("Test message", result.getMessage());
        verify(contactMessageRepository, times(1)).save(testMessage);
    }

    @Test
    void updateMessageStatus_ShouldUpdateStatusAndMarkAsRead() {
        // Arrange
        when(contactMessageRepository.findById("msg-123")).thenReturn(Optional.of(testMessage));
        when(contactMessageRepository.save(any(ContactMessage.class))).thenReturn(testMessage);

        // Act
        ContactMessage result = contactMessageService.updateMessageStatus("msg-123", "RESOLVED");

        // Assert
        assertNotNull(result);
        assertEquals("RESOLVED", testMessage.getStatus());
        assertTrue(testMessage.getIsRead());
        verify(contactMessageRepository, times(1)).save(testMessage);
    }

    @Test
    void updateMessageStatus_ShouldThrowException_WhenNotFound() {
        // Arrange
        when(contactMessageRepository.findById("non-existent")).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            contactMessageService.updateMessageStatus("non-existent", "RESOLVED");
        });

        assertTrue(exception.getMessage().contains("Message not found"));
        verify(contactMessageRepository, never()).save(any(ContactMessage.class));
    }

    @Test
    void deleteMessage_ShouldCallRepository() {
        // Arrange
        doNothing().when(contactMessageRepository).deleteById("msg-123");

        // Act
        contactMessageService.deleteMessage("msg-123");

        // Assert
        verify(contactMessageRepository, times(1)).deleteById("msg-123");
    }
}
