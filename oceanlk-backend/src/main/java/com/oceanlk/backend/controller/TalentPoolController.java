package com.oceanlk.backend.controller;

import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import com.oceanlk.backend.model.TalentPoolApplication;
import com.oceanlk.backend.repository.TalentPoolApplicationRepository;
import com.oceanlk.backend.service.EmailService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
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
@Slf4j
public class TalentPoolController {

    private final TalentPoolApplicationRepository applicationRepository;
    private final EmailService emailService;
    private final GridFsTemplate gridFsTemplate;
    private final com.oceanlk.backend.service.AuditLogService auditLogService;
    private final com.oceanlk.backend.service.NotificationService notificationService;

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
                // Security: Validate file size (max 5MB)
                if (file.getSize() > 5 * 1024 * 1024) {
                    Map<String, String> error = new HashMap<>();
                    error.put("error", "File too large. Maximum size is 5MB.");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
                }

                // Security: Validate MIME types
                String contentType = file.getContentType();
                if (contentType == null || (!contentType.equals("application/pdf") &&
                        !contentType.equals("application/msword") &&
                        !contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                        &&
                        !contentType.startsWith("image/"))) {
                    Map<String, String> error = new HashMap<>();
                    error.put("error", "Invalid file type. Only PDF, DOCX, and images are allowed.");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
                }

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
                log.error("Failed to send email: {}", e.getMessage());
            }

            // Create Notification for Admin
            notificationService.createNotification(
                    "New Talent Pool application from " + fullName,
                    "INFO",
                    "ROLE_ADMIN",
                    "/admin/talent-pool");

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
            var applicationOpt = applicationRepository.findById(applicationId);

            if (applicationOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Application not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            TalentPoolApplication application = applicationOpt.get();

            if (application.getCvFileId() == null) {
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

    @PatchMapping("/application/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable @NonNull String id,
            @RequestParam String status) {
        var applicationOpt = applicationRepository.findById(id);

        if (applicationOpt.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Application not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        TalentPoolApplication application = applicationOpt.get();
        application.setStatus(status);
        applicationRepository.save(application);

        // Log Action
        auditLogService.logAction("admin", "UPDATE", "TalentPoolApplication", id,
                "Updated application status for " + application.getFullName() + " to " + status);

        return ResponseEntity.ok(application);
    }

    @DeleteMapping("/application/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> deleteApplication(@PathVariable @NonNull String id) {
        try {
            var applicationOpt = applicationRepository.findById(id);

            if (applicationOpt.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Application not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }

            TalentPoolApplication application = applicationOpt.get();

            // Delete CV file from GridFS if it exists
            if (application.getCvFileId() != null) {
                try {
                    gridFsTemplate.delete(Query.query(Criteria.where("_id").is(application.getCvFileId())));
                } catch (Exception e) {
                    log.error("Failed to delete CV file from GridFS: {}", e.getMessage());
                }
            }

            // Delete application record
            applicationRepository.deleteById(id);

            // Log Action
            auditLogService.logAction("admin", "DELETE", "TalentPoolApplication", id,
                    "Deleted application from " + application.getFullName());

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
