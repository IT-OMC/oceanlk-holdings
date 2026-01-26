package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.JobOpportunity;
import com.oceanlk.backend.repository.JobOpportunityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:4173" })
public class JobOpportunityController {

    private final JobOpportunityRepository jobRepository;
    private final com.oceanlk.backend.service.AuditLogService auditLogService;

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
    public ResponseEntity<?> createJob(@RequestBody JobOpportunity job) {
        try {
            if (job.getPostedDate() == null) {
                job.setPostedDate(java.time.LocalDateTime.now());
            }
            if (job.getStatus() != null) {
                job.setStatus(job.getStatus().toUpperCase());
            } else {
                job.setStatus("ACTIVE"); // Default
            }

            JobOpportunity savedJob = jobRepository.save(job);

            // Log Action
            auditLogService.logAction("admin", "CREATE", "JobOpportunity", savedJob.getId(),
                    "Created job: " + savedJob.getTitle());

            return ResponseEntity.status(HttpStatus.CREATED).body(savedJob);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create job: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/admin/jobs/{id}")
    public ResponseEntity<?> updateJob(@PathVariable String id, @RequestBody JobOpportunity updatedJob) {
        JobOpportunity job = jobRepository.findById(id).orElse(null);

        if (job == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Job not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

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

        // Log Action
        auditLogService.logAction("admin", "UPDATE", "JobOpportunity", savedJob.getId(),
                "Updated job: " + savedJob.getTitle());

        return ResponseEntity.ok(savedJob);
    }

    @DeleteMapping("/admin/jobs/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable String id) {
        if (!jobRepository.existsById(id)) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Job not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        jobRepository.deleteById(id);

        // Log Action
        auditLogService.logAction("admin", "DELETE", "JobOpportunity", id, "Deleted job ID: " + id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Job deleted successfully");
        return ResponseEntity.ok(response);
    }
}
