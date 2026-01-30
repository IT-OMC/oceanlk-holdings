package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.CorporateLeader;
import com.oceanlk.backend.repository.CorporateLeaderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leadership")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LeadershipController {

    private final CorporateLeaderRepository repository;
    private final com.oceanlk.backend.service.AuditLogService auditLogService;
    private final com.oceanlk.backend.service.PendingChangeService pendingChangeService;

    @GetMapping
    public ResponseEntity<List<CorporateLeader>> getAllLeaders() {
        return ResponseEntity.ok(repository.findAllByOrderByDisplayOrderAsc());
    }

    @GetMapping("/department/{dept}")
    public ResponseEntity<List<CorporateLeader>> getLeadersByDepartment(@PathVariable @NonNull String dept) {
        return ResponseEntity.ok(repository.findByDepartmentOrderByDisplayOrderAsc(dept.toUpperCase()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> createLeader(@RequestBody CorporateLeader leader, Principal principal,
            Authentication authentication) {
        boolean isSuperAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

        if (isSuperAdmin) {
            CorporateLeader savedLeader = java.util.Objects.requireNonNull(repository.save(leader));

            // Record in history for Super Admin
            pendingChangeService.createApprovedChange(
                    "CorporateLeader", savedLeader.getId(), "CREATE", principal.getName(), savedLeader, null);

            // Log Action
            auditLogService.logAction(principal.getName(), "CREATE", "CorporateLeader", savedLeader.getId(),
                    "Created leadership member: " + savedLeader.getName());

            return ResponseEntity.ok(savedLeader);
        } else {
            com.oceanlk.backend.model.PendingChange pendingChange = pendingChangeService.createPendingChange(
                    "CorporateLeader", null, "CREATE", principal.getName(), leader, null);
            auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL", "CorporateLeader", null,
                    "Submitted new leadership member for approval: " + leader.getName());
            return ResponseEntity.ok(Map.of(
                    "message", "Leadership member submitted for approval",
                    "pendingChange", pendingChange));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> updateLeader(@PathVariable @NonNull String id,
            @RequestBody CorporateLeader leader, Principal principal, Authentication authentication) {
        return repository.findById(id)
                .map(existing -> {
                    boolean isSuperAdmin = authentication.getAuthorities().stream()
                            .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

                    if (isSuperAdmin) {
                        // Capture original state for history tracking
                        CorporateLeader existingOriginal = repository.findById(id).orElse(null);

                        existing.setName(leader.getName());
                        existing.setPosition(leader.getPosition());
                        existing.setDepartment(leader.getDepartment());
                        existing.setImage(leader.getImage());
                        existing.setBio(leader.getBio());
                        existing.setShortDescription(leader.getShortDescription());
                        existing.setLinkedin(leader.getLinkedin());
                        existing.setEmail(leader.getEmail());
                        existing.setDisplayOrder(leader.getDisplayOrder());
                        CorporateLeader savedLeader = repository.save(existing);

                        // Record in history for Super Admin
                        pendingChangeService.createApprovedChange(
                                "CorporateLeader", id, "UPDATE", principal.getName(), savedLeader, existingOriginal);

                        // Log Action
                        auditLogService.logAction(principal.getName(), "UPDATE", "CorporateLeader", id,
                                "Updated leadership member: " + savedLeader.getName());

                        return ResponseEntity.ok(savedLeader);
                    } else {
                        if (pendingChangeService.hasPendingChange(id)) {
                            return ResponseEntity.badRequest().body(Map.of(
                                    "error", "This member already has a pending change awaiting approval"));
                        }

                        leader.setId(id);
                        com.oceanlk.backend.model.PendingChange pendingChange = pendingChangeService
                                .createPendingChange(
                                        "CorporateLeader", id, "UPDATE", principal.getName(), leader, existing);
                        auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL", "CorporateLeader", id,
                                "Submitted leadership member update for approval: " + leader.getName());
                        return ResponseEntity.ok(Map.of(
                                "message", "Leadership member update submitted for approval",
                                "pendingChange", pendingChange));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> deleteLeader(@PathVariable @NonNull String id, Principal principal,
            Authentication authentication) {
        return repository.findById(id)
                .map(leader -> {
                    boolean isSuperAdmin = authentication.getAuthorities().stream()
                            .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

                    if (isSuperAdmin) {
                        repository.deleteById(id);

                        // Record in history for Super Admin
                        pendingChangeService.createApprovedChange(
                                "CorporateLeader", id, "DELETE", principal.getName(), leader, leader);

                        // Log Action
                        auditLogService.logAction(principal.getName(), "DELETE", "CorporateLeader", id,
                                "Deleted leadership member ID: " + id);

                        return ResponseEntity.ok().build();
                    } else {
                        if (pendingChangeService.hasPendingChange(id)) {
                            return ResponseEntity.badRequest().body(Map.of(
                                    "error", "This member already has a pending change awaiting approval"));
                        }

                        com.oceanlk.backend.model.PendingChange pendingChange = pendingChangeService
                                .createPendingChange(
                                        "CorporateLeader", id, "DELETE", principal.getName(), leader, leader);
                        auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL", "CorporateLeader", id,
                                "Submitted leadership member deletion for approval");
                        return ResponseEntity.ok(Map.of(
                                "message", "Leadership member deletion submitted for approval",
                                "pendingChange", pendingChange));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
