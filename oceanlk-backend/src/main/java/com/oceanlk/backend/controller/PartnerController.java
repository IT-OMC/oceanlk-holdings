package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.Partner;
import com.oceanlk.backend.repository.PartnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import lombok.extern.slf4j.Slf4j;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/partners")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class PartnerController {

        private final PartnerRepository repository;
        private final com.oceanlk.backend.service.AuditLogService auditLogService;
        private final com.oceanlk.backend.service.PendingChangeService pendingChangeService;

        @GetMapping
        public ResponseEntity<List<Partner>> getAllPartners() {
                return ResponseEntity.ok(repository.findAllByOrderByDisplayOrderAsc());
        }

        @PostMapping
        @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
        public ResponseEntity<?> savePartner(@RequestBody Partner partner, Principal principal,
                        Authentication authentication) {
                boolean isSuperAdmin = authentication.getAuthorities().stream()
                                .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

                if (isSuperAdmin) {
                        Partner savedPartner = repository.save(partner);

                        // Record in history for Super Admin
                        pendingChangeService.createApprovedChange(
                                        "Partner", savedPartner.getId(), "CREATE", principal.getName(), savedPartner,
                                        null);

                        auditLogService.logAction(principal.getName(), "CREATE", "Partner", savedPartner.getId(),
                                        "Created partner: " + savedPartner.getName());
                        return ResponseEntity.ok(savedPartner);
                } else {
                        com.oceanlk.backend.model.PendingChange pendingChange = pendingChangeService
                                        .createPendingChange(
                                                        "Partner", null, "CREATE", principal.getName(), partner, null);
                        auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL", "Partner", null,
                                        "Submitted new partner for approval: " + partner.getName());
                        return ResponseEntity.ok(Map.of(
                                        "message", "Partner submitted for approval",
                                        "pendingChange", pendingChange));
                }
        }

        @PutMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
        public ResponseEntity<?> updatePartner(@PathVariable @NonNull String id, @RequestBody Partner partner,
                        Principal principal, Authentication authentication) {
                return repository.findById(id)
                                .map(existing -> {
                                        boolean isSuperAdmin = authentication.getAuthorities().stream()
                                                        .anyMatch(auth -> auth.getAuthority()
                                                                        .equals("ROLE_SUPER_ADMIN"));

                                        if (isSuperAdmin) {
                                                // Capture original state for history tracking before modification
                                                Partner existingOriginal = repository.findById(id).orElse(null);

                                                existing.setName(partner.getName());
                                                existing.setLogoUrl(partner.getLogoUrl());
                                                existing.setWebsiteUrl(partner.getWebsiteUrl());
                                                existing.setCategory(partner.getCategory());
                                                existing.setDisplayOrder(partner.getDisplayOrder());
                                                Partner savedPartner = repository.save(existing);

                                                // Record in history for Super Admin
                                                pendingChangeService.createApprovedChange(
                                                                "Partner", id, "UPDATE", principal.getName(),
                                                                savedPartner, existingOriginal);

                                                auditLogService.logAction(principal.getName(), "UPDATE", "Partner", id,
                                                                "Updated partner: " + savedPartner.getName());

                                                return ResponseEntity.ok(savedPartner);
                                        } else {
                                                if (pendingChangeService.hasPendingChange(id)) {
                                                        return ResponseEntity.badRequest().body(Map.of(
                                                                        "error",
                                                                        "This partner already has a pending change awaiting approval"));
                                                }

                                                partner.setId(id); // Ensure ID matches
                                                com.oceanlk.backend.model.PendingChange pendingChange = pendingChangeService
                                                                .createPendingChange(
                                                                                "Partner", id, "UPDATE",
                                                                                principal.getName(), partner, existing);
                                                auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL",
                                                                "Partner", id,
                                                                "Submitted partner update for approval: "
                                                                                + partner.getName());
                                                return ResponseEntity.ok(Map.of(
                                                                "message", "Partner update submitted for approval",
                                                                "pendingChange", pendingChange));
                                        }
                                })
                                .orElse(ResponseEntity.notFound().build());
        }

        @DeleteMapping("/{id}")
        @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
        public ResponseEntity<?> deletePartner(@PathVariable @NonNull String id, Principal principal,
                        Authentication authentication) {
                return repository.findById(id)
                                .map(partner -> {
                                        boolean isSuperAdmin = authentication.getAuthorities().stream()
                                                        .anyMatch(auth -> auth.getAuthority()
                                                                        .equals("ROLE_SUPER_ADMIN"));

                                        if (isSuperAdmin) {
                                                repository.deleteById(id);

                                                // Record in history for Super Admin
                                                pendingChangeService.createApprovedChange(
                                                                "Partner", id, "DELETE", principal.getName(), partner,
                                                                partner);

                                                auditLogService.logAction(principal.getName(), "DELETE", "Partner", id,
                                                                "Deleted partner ID: " + id);
                                                return ResponseEntity.ok().build();
                                        } else {
                                                if (pendingChangeService.hasPendingChange(id)) {
                                                        return ResponseEntity.badRequest().body(Map.of(
                                                                        "error",
                                                                        "This partner already has a pending change awaiting approval"));
                                                }
                                                com.oceanlk.backend.model.PendingChange pendingChange = pendingChangeService
                                                                .createPendingChange(
                                                                                "Partner", id, "DELETE",
                                                                                principal.getName(), partner, partner);
                                                auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL",
                                                                "Partner", id,
                                                                "Submitted partner deletion for approval");
                                                return ResponseEntity.ok(Map.of(
                                                                "message", "Partner deletion submitted for approval",
                                                                "pendingChange", pendingChange));
                                        }
                                })
                                .orElse(ResponseEntity.notFound().build());
        }
}
