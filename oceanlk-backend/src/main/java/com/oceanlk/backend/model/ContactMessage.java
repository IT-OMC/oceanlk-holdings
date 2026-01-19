package com.oceanlk.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "contact_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactMessage {

    @Id
    private String id;

    private String name;
    private String email;
    private String phone;
    private String subject;
    private String message;

    private LocalDateTime submittedDate;
    private String status; // NEW, READ, ARCHIVED
    private Boolean isRead;

    public ContactMessage(String name, String email, String phone, String subject, String message) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.subject = subject;
        this.message = message;
        this.submittedDate = LocalDateTime.now();
        this.status = "NEW";
        this.isRead = false;
    }
}
