package com.oceanlk.backend.service;

import com.oceanlk.backend.model.ContactMessage;
import com.oceanlk.backend.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContactMessageService {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAll();
    }

    public Optional<ContactMessage> getMessageById(String id) {
        return contactMessageRepository.findById(id);
    }

    public ContactMessage createMessage(ContactMessage message) {
        // Note: Email notification can be added later if needed
        return contactMessageRepository.save(message);
    }

    public ContactMessage updateMessageStatus(String id, String status) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found with id: " + id));

        message.setStatus(status);
        message.setIsRead(true);
        return contactMessageRepository.save(message);
    }

    public void deleteMessage(String id) {
        contactMessageRepository.deleteById(id);
    }
}
