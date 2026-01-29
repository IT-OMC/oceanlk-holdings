package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.JobOpportunity;
import com.oceanlk.backend.repository.JobOpportunityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:4173" })
@Slf4j
public class JobOpportunityController {

    private final JobOpportunityRepository jobRepository;
    private final com.oceanlk.backend.service.AuditLogService auditLogService;
    private final com.oceanlk.backend.service.PendingChangeService pendingChangeService;

    // Public endpoint - get all active jobs
    @GetMapping("/jobs")
    public ResponseEntity<List<JobOpportunity>> getAllActiveJobs() {
        List<JobOpportunity> jobs = jobRepository.findByStatusOrderByPostedDateDesc("ACTIVE");
        return ResponseEntity.ok(jobs);
    }

    // Admin endpoints
    @GetMapping("/admin/jobs")
    public ResponseEntity<List<JobOpportunity>> getAllJobs() {
        List<JobOpportunity> jobs = jobRepository.findAll();
        return ResponseEntity.ok(jobs);
    }

    @PostMapping("/admin/jobs")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> createJob(@RequestBody JobOpportunity job, Principal principal,
            Authentication authentication) {
        try {
            if (job.getPostedDate() == null) {
                job.setPostedDate(java.time.LocalDateTime.now());
            }
            if (job.getStatus() != null) {
                job.setStatus(job.getStatus().toUpperCase());
            } else {
                job.setStatus("ACTIVE"); // Default
            }

            boolean isSuperAdmin = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

            if (isSuperAdmin) {
                JobOpportunity savedJob = jobRepository.save(job);

                // Record in history for Super Admin
                pendingChangeService.createApprovedChange(
                        "JobOpportunity", savedJob.getId(), "CREATE", principal.getName(), savedJob, null);

                auditLogService.logAction(principal.getName(), "CREATE", "JobOpportunity", savedJob.getId(),
                        "Created job: " + savedJob.getTitle());
                return ResponseEntity.status(HttpStatus.CREATED).body(savedJob);
            } else {
                com.oceanlk.backend.model.PendingChange pendingChange = pendingChangeService.createPendingChange(
                        "JobOpportunity", null, "CREATE", principal.getName(), job, null);
                auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL", "JobOpportunity", null,
                        "Submitted new job for approval: " + job.getTitle());
                return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                        "message", "Job submitted for approval",
                        "pendingChange", pendingChange));
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create job: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/admin/jobs/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> updateJob(@PathVariable @NonNull String id, @RequestBody JobOpportunity updatedJob,
            Principal principal, Authentication authentication) {
        JobOpportunity job = jobRepository.findById(id).orElse(null);

        if (job == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Job not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        boolean isSuperAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

        if (isSuperAdmin) {
            // Capture original state for history tracking
            JobOpportunity existingOriginal = jobRepository.findById(id).orElse(null);

            // Update fields
            job.setTitle(updatedJob.getTitle());
            job.setCompany(updatedJob.getCompany());
            job.setLocation(updatedJob.getLocation());
            job.setType(updatedJob.getType());
            job.setCategory(updatedJob.getCategory());
            job.setDescription(updatedJob.getDescription());
            job.setFeatured(updatedJob.isFeatured());
            job.setLevel(updatedJob.getLevel());
            if (updatedJob.getStatus() != null) {
                job.setStatus(updatedJob.getStatus().toUpperCase());
            }

            JobOpportunity savedJob = jobRepository.save(job);

            // Record in history for Super Admin
            pendingChangeService.createApprovedChange(
                    "JobOpportunity", id, "UPDATE", principal.getName(), savedJob, existingOriginal);

            auditLogService.logAction(principal.getName(), "UPDATE", "JobOpportunity", savedJob.getId(),
                    "Updated job: " + savedJob.getTitle());
            return ResponseEntity.ok(savedJob);
        } else {
            if (pendingChangeService.hasPendingChange(id)) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "This job already has a pending change awaiting approval"));
            }

            updatedJob.setId(id);
            com.oceanlk.backend.model.PendingChange pendingChange = pendingChangeService.createPendingChange(
                    "JobOpportunity", id, "UPDATE", principal.getName(), updatedJob, job);
            auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL", "JobOpportunity", id,
                    "Submitted job update for approval: " + updatedJob.getTitle());
            return ResponseEntity.ok(Map.of(
                    "message", "Job update submitted for approval",
                    "pendingChange", pendingChange));
        }
    }

    @DeleteMapping("/admin/jobs/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> deleteJob(@PathVariable @NonNull String id, Principal principal,
            Authentication authentication) {
        if (!jobRepository.existsById(id)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Job not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        JobOpportunity existing = jobRepository.findById(id).get();

        boolean isSuperAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

        if (isSuperAdmin) {
            jobRepository.deleteById(id);

            // Record in history for Super Admin
            pendingChangeService.createApprovedChange(
                    "JobOpportunity", id, "DELETE", principal.getName(), existing, existing);

            auditLogService.logAction(principal.getName(), "DELETE", "JobOpportunity", id, "Deleted job ID: " + id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Job deleted successfully");
            return ResponseEntity.ok(response);
        } else {
            if (pendingChangeService.hasPendingChange(id)) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "This job already has a pending change awaiting approval"));
            }

            com.oceanlk.backend.model.PendingChange pendingChange = pendingChangeService.createPendingChange(
                    "JobOpportunity", id, "DELETE", principal.getName(), existing, existing);
            auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL", "JobOpportunity", id,
                    "Submitted job deletion for approval");
            return ResponseEntity.ok(Map.of(
                    "message", "Job deletion submitted for approval",
                    "pendingChange", pendingChange));
        }
    }
}
