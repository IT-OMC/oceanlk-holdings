package com.oceanlk.backend.controller;

import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import com.oceanlk.backend.model.TalentPoolApplication;
import com.oceanlk.backend.repository.TalentPoolApplicationRepository;
import com.oceanlk.backend.service.EmailService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/talent-pool")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:4173" })
public class TalentPoolController {

    private final TalentPoolApplicationRepository applicationRepository;
    private final EmailService emailService;
    private final GridFsTemplate gridFsTemplate;

    @PostMapping(value = "/submit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> submitApplication(
            @RequestParam("fullName") String fullName,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("position") String position,
            @RequestParam("experience") String experience,
            @RequestParam(value = "message", required = false) String message,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            // Create application
            TalentPoolApplication application = new TalentPoolApplication(
                    fullName, email, phone, position, experience, message);

            // Handle CV file upload if provided
            if (file != null && !file.isEmpty()) {
                String fileId = gridFsTemplate.store(
                        file.getInputStream(),
                        file.getOriginalFilename(),
                        file.getContentType()).toString();

                application.setCvFileId(fileId);
                application.setCvFilename(file.getOriginalFilename());
                application.setCvFileSize(file.getSize());
            }

            // Save to database
            TalentPoolApplication savedApplication = applicationRepository.save(application);

            // Send emails asynchronously (in a real app, use @Async)
            try {
                emailService.sendApplicantConfirmation(savedApplication);
                emailService.sendHRNotification(savedApplication);
            } catch (MessagingException e) {
                // Log error but don't fail the request
                System.err.println("Failed to send email: " + e.getMessage());
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Application submitted successfully");
            response.put("applicationId", savedApplication.getId());

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to upload CV file");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to submit application: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/applications")
    public ResponseEntity<List<TalentPoolApplication>> getAllApplications() {
        List<TalentPoolApplication> applications = applicationRepository.findAllByOrderBySubmittedDateDesc();
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/cv/{applicationId}")
    public ResponseEntity<?> downloadCV(@PathVariable String applicationId) {
        try {
            TalentPoolApplication application = applicationRepository.findById(applicationId)
                    .orElse(null);

            if (application == null || application.getCvFileId() == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "CV not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            GridFsResource resource = gridFsTemplate.getResource(application.getCvFileId());

            if (!resource.exists()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "CV file not found in storage");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + application.getCvFilename() + "\"")
                    .body(resource.getInputStream().readAllBytes());

        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to download CV");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PatchMapping("application/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable String id,
            @RequestParam String status) {
        TalentPoolApplication application = applicationRepository.findById(id).orElse(null);

        if (application == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Application not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        application.setStatus(status);
        applicationRepository.save(application);

        return ResponseEntity.ok(application);
    }

    @DeleteMapping("/application/{id}")
    public ResponseEntity<?> deleteApplication(@PathVariable String id) {
        try {
            TalentPoolApplication application = applicationRepository.findById(id).orElse(null);

            if (application == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Application not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            // Delete CV file from GridFS if it exists
            if (application.getCvFileId() != null) {
                try {
                    gridFsTemplate.delete(org.springframework.data.mongodb.core.query.Query.query(
                            org.springframework.data.mongodb.core.query.Criteria.where("_id")
                                    .is(application.getCvFileId())));
                } catch (Exception e) {
                    System.err.println("Failed to delete CV file from GridFS: " + e.getMessage());
                }
            }

            // Delete application record
            applicationRepository.deleteById(id);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Application deleted successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to delete application: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
