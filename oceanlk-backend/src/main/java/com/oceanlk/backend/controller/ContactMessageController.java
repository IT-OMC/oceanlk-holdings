package com.oceanlk.backend.controller;

import com.oceanlk.backend.dto.ContactMessageDTO;
import com.oceanlk.backend.model.ContactMessage;
import com.oceanlk.backend.repository.ContactMessageRepository;
import com.oceanlk.backend.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ContactMessageController {

    private final ContactMessageRepository contactMessageRepository;
    private final EmailService emailService;
    private final com.oceanlk.backend.service.AuditLogService auditLogService;

    // Public endpoint - Submit contact form
    @PostMapping
    public ResponseEntity<?> submitContactForm(@Valid @RequestBody ContactMessageDTO dto) {
        try {
            // Create and save contact message
            ContactMessage message = new ContactMessage(
                    dto.getName(),
                    dto.getEmail(),
                    dto.getPhone(),
                    dto.getSubject(),
                    dto.getMessage());

            ContactMessage savedMessage = contactMessageRepository.save(message);

            // Send email notifications
            try {
                emailService.sendContactConfirmation(savedMessage);
                emailService.sendContactNotificationToHR(savedMessage);
            } catch (Exception emailException) {
                // Log email error but don't fail the request
                System.err.println("Failed to send email notifications: " + emailException.getMessage());
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Your message has been received. We'll get back to you soon!");
            response.put("id", savedMessage.getId());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to submit your message. Please try again later.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Admin endpoints - require authentication
    @GetMapping("/messages")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ContactMessage>> getAllMessages(
            @RequestParam(required = false) Boolean isRead) {

        List<ContactMessage> messages;

        if (isRead != null) {
            messages = contactMessageRepository.findByIsReadOrderBySubmittedDateDesc(isRead);
        } else {
            messages = contactMessageRepository.findAllByOrderBySubmittedDateDesc();
        }

        return ResponseEntity.ok(messages);
    }

    @GetMapping("/messages/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getMessageById(@PathVariable @NonNull String id) {
        Optional<ContactMessage> message = contactMessageRepository.findById(id);

        if (message.isPresent()) {
            return ResponseEntity.ok(message.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/messages/{id}/read")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> markAsRead(@PathVariable @NonNull String id) {
        Optional<ContactMessage> messageOpt = contactMessageRepository.findById(id);

        if (messageOpt.isPresent()) {
            ContactMessage message = messageOpt.get();
            message.setIsRead(true);
            message.setStatus("READ");
            contactMessageRepository.save(message);

            // Log Action
            auditLogService.logAction("admin", "UPDATE", "ContactMessage", id,
                    "Marked message from " + message.getName() + " as READ");

            return ResponseEntity.ok(message);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/messages/{id}/unread")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> markAsUnread(@PathVariable @NonNull String id) {
        Optional<ContactMessage> messageOpt = contactMessageRepository.findById(id);

        if (messageOpt.isPresent()) {
            ContactMessage message = messageOpt.get();
            message.setIsRead(false);
            message.setStatus("NEW");
            contactMessageRepository.save(message);

            // Log Action
            auditLogService.logAction("admin", "UPDATE", "ContactMessage", id,
                    "Marked message from " + message.getName() + " as UNREAD");

            return ResponseEntity.ok(message);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/messages/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteMessage(@PathVariable @NonNull String id) {
        if (contactMessageRepository.existsById(id)) {
            contactMessageRepository.deleteById(id);

            // Log Action
            auditLogService.logAction("admin", "DELETE", "ContactMessage", id, "Deleted contact message ID: " + id);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Message deleted successfully");
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getStats() {
        long totalMessages = contactMessageRepository.count();
        long unreadMessages = contactMessageRepository.countByIsRead(false);

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", totalMessages);
        stats.put("unread", unreadMessages);
        stats.put("read", totalMessages - unreadMessages);

        return ResponseEntity.ok(stats);
    }
}
