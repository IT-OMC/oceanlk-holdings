package com.oceanlk.backend.controller;

import com.oceanlk.backend.dto.ApprovalRequest;
import com.oceanlk.backend.model.*;
import com.oceanlk.backend.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pending-changes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PendingChangeController {

    private final PendingChangeService pendingChangeService;
    private final EventService eventService;
    private final CompanyService companyService;
    private final TestimonialService testimonialService;
    private final PartnerService partnerService;
    private final JobOpportunityService jobOpportunityService;
    private final AuditLogService auditLogService;

    private final com.oceanlk.backend.repository.MediaItemRepository mediaItemRepository;
    private final com.oceanlk.backend.repository.GlobalMetricRepository globalMetricRepository;
    private final com.oceanlk.backend.repository.CorporateLeaderRepository corporateLeaderRepository;
    private final com.oceanlk.backend.repository.PageContentRepository pageContentRepository;

    /**
     * Get all pending changes (Superadmin only)
     */
    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<PendingChange>> getAllPendingChanges() {
        return ResponseEntity.ok(pendingChangeService.getAllPendingChanges());
    }

    /**
     * Get pending changes by entity type (Superadmin only)
     */
    @GetMapping("/type/{entityType}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<PendingChange>> getPendingChangesByType(@PathVariable String entityType) {
        return ResponseEntity.ok(pendingChangeService.getPendingChangesByEntityType(entityType));
    }

    /**
     * Get admin's own pending changes
     */
    @GetMapping("/my-submissions")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<PendingChange>> getMySubmissions(Principal principal) {
        return ResponseEntity.ok(pendingChangeService.getPendingChangesForAdmin(principal.getName()));
    }

    /**
     * Get a specific pending change
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<PendingChange> getPendingChange(@PathVariable String id) {
        return pendingChangeService.getPendingChangeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Approve a pending change (Superadmin only)
     */
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> approvePendingChange(
            @PathVariable String id,
            @RequestBody(required = false) ApprovalRequest request,
            Principal principal) {

        try {
            // Get the pending change
            PendingChange pendingChange = pendingChangeService.getPendingChangeById(id)
                    .orElseThrow(() -> new RuntimeException("Pending change not found"));

            // Publish the change based on entity type and action
            publishChange(pendingChange);

            // Mark as approved
            String comments = request != null ? request.getReviewComments() : null;
            PendingChange approved = pendingChangeService.approvePendingChange(id, principal.getName(), comments);

            // Log the approval
            auditLogService.logAction(principal.getName(), "APPROVE", "PendingChange", id,
                    "Approved " + pendingChange.getAction() + " for " + pendingChange.getEntityType());

            return ResponseEntity.ok(Map.of(
                    "message", "Change approved and published successfully",
                    "pendingChange", approved));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Reject a pending change (Superadmin only)
     */
    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> rejectPendingChange(
            @PathVariable String id,
            @RequestBody ApprovalRequest request,
            Principal principal) {

        try {
            PendingChange pendingChange = pendingChangeService.getPendingChangeById(id)
                    .orElseThrow(() -> new RuntimeException("Pending change not found"));

            String comments = request != null ? request.getReviewComments() : "No comments provided";
            PendingChange rejected = pendingChangeService.rejectPendingChange(id, principal.getName(), comments);

            // Log the rejection
            auditLogService.logAction(principal.getName(), "REJECT", "PendingChange", id,
                    "Rejected " + pendingChange.getAction() + " for " + pendingChange.getEntityType());

            return ResponseEntity.ok(Map.of(
                    "message", "Change rejected successfully",
                    "pendingChange", rejected));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Publish the change to the actual entity collection
     */
    private void publishChange(PendingChange pendingChange) {
        String entityType = pendingChange.getEntityType();
        String action = pendingChange.getAction();

        switch (entityType) {
            case "Event":
                handleEventChange(pendingChange, action);
                break;
            case "Company":
                handleCompanyChange(pendingChange, action);
                break;
            case "Testimonial":
                handleTestimonialChange(pendingChange, action);
                break;
            case "Partner":
                handlePartnerChange(pendingChange, action);
                break;
            case "JobOpportunity":
                handleJobOpportunityChange(pendingChange, action);
                break;
            case "MediaItem":
                handleMediaItemChange(pendingChange, action);
                break;
            case "GlobalMetric":
                handleGlobalMetricChange(pendingChange, action);
                break;
            case "CorporateLeader":
                handleCorporateLeaderChange(pendingChange, action);
                break;
            case "PageContent":
                handlePageContentChange(pendingChange, action);
                break;
            default:
                throw new RuntimeException("Unsupported entity type: " + entityType);
        }
    }

    private void handleEventChange(PendingChange pendingChange, String action) {
        Event event = pendingChangeService.parseChangeData(pendingChange.getChangeData(), Event.class);

        switch (action) {
            case "CREATE":
                // Force null ID to ensure MongoDB generates a new one
                event.setId(null);
                eventService.createEvent(event);
                break;
            case "UPDATE":
                eventService.updateEvent(event.getId(), event);
                break;
            case "DELETE":
                eventService.deleteEvent(event.getId());
                break;
        }
    }

    private void handleCompanyChange(PendingChange pendingChange, String action) {
        Company company = pendingChangeService.parseChangeData(pendingChange.getChangeData(), Company.class);

        switch (action) {
            case "CREATE":
                companyService.createCompany(company);
                break;
            case "UPDATE":
                companyService.updateCompany(company.getId(), company);
                break;
            case "DELETE":
                companyService.deleteCompany(company.getId());
                break;
        }
    }

    private void handleTestimonialChange(PendingChange pendingChange, String action) {
        Testimonial testimonial = pendingChangeService.parseChangeData(pendingChange.getChangeData(),
                Testimonial.class);

        switch (action) {
            case "CREATE":
                testimonialService.createTestimonial(testimonial);
                break;
            case "UPDATE":
                testimonialService.updateTestimonial(testimonial.getId(), testimonial);
                break;
            case "DELETE":
                testimonialService.deleteTestimonial(testimonial.getId());
                break;
        }
    }

    private void handlePartnerChange(PendingChange pendingChange, String action) {
        Partner partner = pendingChangeService.parseChangeData(pendingChange.getChangeData(), Partner.class);

        switch (action) {
            case "CREATE":
                partnerService.createPartner(partner);
                break;
            case "UPDATE":
                partnerService.updatePartner(partner.getId(), partner);
                break;
            case "DELETE":
                partnerService.deletePartner(partner.getId());
                break;
        }
    }

    private void handleJobOpportunityChange(PendingChange pendingChange, String action) {
        JobOpportunity job = pendingChangeService.parseChangeData(pendingChange.getChangeData(), JobOpportunity.class);

        switch (action) {
            case "CREATE":
                jobOpportunityService.createJob(job);
                break;
            case "UPDATE":
                jobOpportunityService.updateJob(job.getId(), job);
                break;
            case "DELETE":
                jobOpportunityService.deleteJob(job.getId());
                break;
        }
    }

    private void handleMediaItemChange(PendingChange pendingChange, String action) {
        MediaItem mediaItem = pendingChangeService.parseChangeData(pendingChange.getChangeData(), MediaItem.class);

        switch (action) {
            case "CREATE":
                mediaItem.setId(null); // Ensure new ID
                if (mediaItem.getStatus() == null || mediaItem.getStatus().isEmpty()) {
                    mediaItem.setStatus("PUBLISHED");
                }
                mediaItemRepository.save(mediaItem);
                break;
            case "UPDATE":
                // We trust the data in pending change is what we want to save
                mediaItemRepository.save(mediaItem);
                break;
            case "DELETE":
                mediaItemRepository.deleteById(mediaItem.getId());
                break;
        }
    }

    private void handleGlobalMetricChange(PendingChange pendingChange, String action) {
        GlobalMetric metric = pendingChangeService.parseChangeData(pendingChange.getChangeData(), GlobalMetric.class);

        switch (action) {
            case "CREATE":
                metric.setId(null);
                globalMetricRepository.save(metric);
                break;
            case "UPDATE":
                if (metric != null) {
                    globalMetricRepository.save(metric);
                }
                break;
            case "DELETE":
                globalMetricRepository.deleteById(metric.getId());
                break;
        }
    }

    private void handleCorporateLeaderChange(PendingChange pendingChange, String action) {
        CorporateLeader leader = pendingChangeService.parseChangeData(pendingChange.getChangeData(),
                CorporateLeader.class);

        switch (action) {
            case "CREATE":
                leader.setId(null);
                corporateLeaderRepository.save(leader);
                break;
            case "UPDATE":
                if (leader != null) {
                    corporateLeaderRepository.save(leader);
                }
                break;
            case "DELETE":
                corporateLeaderRepository.deleteById(leader.getId());
                break;
        }
    }

    private void handlePageContentChange(PendingChange pendingChange, String action) {
        PageContent content = pendingChangeService.parseChangeData(pendingChange.getChangeData(), PageContent.class);

        switch (action) {
            case "CREATE":
            case "UPDATE":
                // For PageContent, it's usually upsert logic
                if (content != null) {
                    pageContentRepository.save(content);
                }
                break;
            case "DELETE":
                pageContentRepository.deleteById(content.getId());
                break;
        }
    }
}
