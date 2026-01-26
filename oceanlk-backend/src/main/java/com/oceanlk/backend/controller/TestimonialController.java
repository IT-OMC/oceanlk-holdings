package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.Testimonial;
import com.oceanlk.backend.service.TestimonialService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/testimonials")
@CrossOrigin(origins = "*")
public class TestimonialController {

    @Autowired
    private TestimonialService testimonialService;

    @Autowired
    private com.oceanlk.backend.service.AuditLogService auditLogService;

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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Testimonial> createTestimonial(@Valid @RequestBody Testimonial testimonial) {
        Testimonial createdTestimonial = testimonialService.createTestimonial(testimonial);

        // Log Action
        auditLogService.logAction("admin", "CREATE", "Testimonial", String.valueOf(createdTestimonial.getId()),
                "Created testimonial by: " + createdTestimonial.getName());

        return ResponseEntity.status(HttpStatus.CREATED).body(createdTestimonial);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Testimonial> updateTestimonial(@PathVariable Integer id,
            @Valid @RequestBody Testimonial testimonial) {
        try {
            Testimonial updatedTestimonial = testimonialService.updateTestimonial(id, testimonial);

            // Log Action
            auditLogService.logAction("admin", "UPDATE", "Testimonial", String.valueOf(id),
                    "Updated testimonial by: " + updatedTestimonial.getName());

            return ResponseEntity.ok(updatedTestimonial);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTestimonial(@PathVariable Integer id) {
        testimonialService.deleteTestimonial(id);

        // Log Action
        auditLogService.logAction("admin", "DELETE", "Testimonial", String.valueOf(id),
                "Deleted testimonial ID: " + id);

        return ResponseEntity.noContent().build();
    }
}
