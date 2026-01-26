package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.Partner;
import com.oceanlk.backend.repository.PartnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.lang.NonNull;
import java.util.List;

@RestController
@RequestMapping("/api/partners")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PartnerController {

    private final PartnerRepository repository;
    private final com.oceanlk.backend.service.AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<Partner>> getAllPartners() {
        return ResponseEntity.ok(repository.findAllByOrderByDisplayOrderAsc());
    }

    @PostMapping
    public ResponseEntity<Partner> savePartner(@RequestBody Partner partner) {
        Partner savedPartner = repository.save(partner);

        // Log Action
        auditLogService.logAction("admin", "CREATE", "Partner", savedPartner.getId(),
                "Created partner: " + savedPartner.getName());

        return ResponseEntity.ok(savedPartner);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Partner> updatePartner(@PathVariable @NonNull String id, @RequestBody Partner partner) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setName(partner.getName());
                    existing.setLogoUrl(partner.getLogoUrl());
                    existing.setWebsiteUrl(partner.getWebsiteUrl());
                    existing.setCategory(partner.getCategory());
                    existing.setDisplayOrder(partner.getDisplayOrder());
                    Partner savedPartner = repository.save(existing);

                    // Log Action
                    auditLogService.logAction("admin", "UPDATE", "Partner", id,
                            "Updated partner: " + savedPartner.getName());

                    return ResponseEntity.ok(savedPartner);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePartner(@PathVariable @NonNull String id) {
        repository.deleteById(id);

        // Log Action
        auditLogService.logAction("admin", "DELETE", "Partner", id, "Deleted partner ID: " + id);

        return ResponseEntity.ok().build();
    }
}
