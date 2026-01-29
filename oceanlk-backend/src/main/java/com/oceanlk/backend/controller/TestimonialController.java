package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.Testimonial;
import com.oceanlk.backend.service.TestimonialService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/testimonials")
@CrossOrigin(origins = "*")
@Slf4j
public class TestimonialController {

    @Autowired
    private TestimonialService testimonialService;

    @Autowired
    private com.oceanlk.backend.service.AuditLogService auditLogService;

    @Autowired
    private com.oceanlk.backend.service.PendingChangeService pendingChangeService;

    @GetMapping
    public ResponseEntity<List<Testimonial>> getAllTestimonials() {
        return ResponseEntity.ok(testimonialService.getAllTestimonials());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Testimonial> getTestimonialById(@PathVariable Integer id) {
        return testimonialService.getTestimonialById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> createTestimonial(@Valid @RequestBody Testimonial testimonial, Principal principal,
            Authentication authentication) {
        boolean isSuperAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

        if (isSuperAdmin) {
            Testimonial createdTestimonial = testimonialService.createTestimonial(testimonial);
            auditLogService.logAction(principal.getName(), "CREATE", "Testimonial",
                    String.valueOf(createdTestimonial.getId()),
                    "Created testimonial by: " + createdTestimonial.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTestimonial);
        } else {
            com.oceanlk.backend.model.PendingChange pendingChange = pendingChangeService.createPendingChange(
                    "Testimonial", null, "CREATE", principal.getName(), testimonial, null);
            auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL", "Testimonial", null,
                    "Submitted new testimonial for approval: " + testimonial.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Testimonial submitted for approval",
                    "pendingChange", pendingChange));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> updateTestimonial(@PathVariable Integer id,
            @Valid @RequestBody Testimonial testimonial, Principal principal, Authentication authentication) {
        try {
            // Fetch existing to ensure it exists and for pending change "original" data
            Testimonial existing = testimonialService.getTestimonialById(id)
                    .orElseThrow(() -> new RuntimeException("Testimonial not found"));

            boolean isSuperAdmin = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

            if (isSuperAdmin) {
                Testimonial updatedTestimonial = testimonialService.updateTestimonial(id, testimonial);
                auditLogService.logAction(principal.getName(), "UPDATE", "Testimonial", String.valueOf(id),
                        "Updated testimonial by: " + updatedTestimonial.getName());
                return ResponseEntity.ok(updatedTestimonial);
            } else {
                if (pendingChangeService.hasPendingChange(String.valueOf(id))) {
                    return ResponseEntity.badRequest().body(Map.of(
                            "error", "This testimonial already has a pending change awaiting approval"));
                }

                testimonial.setId(id);
                com.oceanlk.backend.model.PendingChange pendingChange = pendingChangeService.createPendingChange(
                        "Testimonial", String.valueOf(id), "UPDATE", principal.getName(), testimonial, existing);
                auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL", "Testimonial", String.valueOf(id),
                        "Submitted testimonial update for approval: " + testimonial.getName());
                return ResponseEntity.ok(Map.of(
                        "message", "Testimonial update submitted for approval",
                        "pendingChange", pendingChange));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> deleteTestimonial(@PathVariable Integer id, Principal principal,
            Authentication authentication) {
        return testimonialService.getTestimonialById(id)
                .map(testimonial -> {
                    boolean isSuperAdmin = authentication.getAuthorities().stream()
                            .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

                    if (isSuperAdmin) {
                        testimonialService.deleteTestimonial(id);
                        auditLogService.logAction(principal.getName(), "DELETE", "Testimonial", String.valueOf(id),
                                "Deleted testimonial ID: " + id);
                        return ResponseEntity.noContent().build();
                    } else {
                        if (pendingChangeService.hasPendingChange(String.valueOf(id))) {
                            return ResponseEntity.badRequest().body(Map.of(
                                    "error", "This testimonial already has a pending change awaiting approval"));
                        }

                        com.oceanlk.backend.model.PendingChange pendingChange = pendingChangeService
                                .createPendingChange(
                                        "Testimonial", String.valueOf(id), "DELETE", principal.getName(), testimonial,
                                        testimonial);
                        auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL", "Testimonial",
                                String.valueOf(id),
                                "Submitted testimonial deletion for approval");
                        return ResponseEntity.ok(Map.of(
                                "message", "Testimonial deletion submitted for approval",
                                "pendingChange", pendingChange));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
