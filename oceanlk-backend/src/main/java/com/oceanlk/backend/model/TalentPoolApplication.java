package com.oceanlk.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "talent_pool_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TalentPoolApplication {

    @Id
    private String id;

    private String fullName;
    private String email;
    private String phone;
    private String position;
    private String experience;
    private String message;

    // CV file storage (GridFS)
    private String cvFilename;
    private String cvFileId; // GridFS file ID
    private Long cvFileSize;

    private LocalDateTime submittedDate;
    private String status; // PENDING, REVIEWED, CONTACTED, REJECTED

    public TalentPoolApplication(String fullName, String email, String phone,
            String position, String experience, String message) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.position = position;
        this.experience = experience;
        this.message = message;
        this.submittedDate = LocalDateTime.now();
        this.status = "PENDING";
    }
}
