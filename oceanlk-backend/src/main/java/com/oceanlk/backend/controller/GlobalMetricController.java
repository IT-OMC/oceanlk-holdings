package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.GlobalMetric;
import com.oceanlk.backend.repository.GlobalMetricRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/metrics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class GlobalMetricController {

    private final GlobalMetricRepository repository;
    private final com.oceanlk.backend.service.AuditLogService auditLogService;
    private final com.oceanlk.backend.service.PendingChangeService pendingChangeService;

    @GetMapping
    public ResponseEntity<List<GlobalMetric>> getAllMetrics() {
        return ResponseEntity.ok(repository.findAllByOrderByDisplayOrderAsc());
    }

    @PostMapping
    @SuppressWarnings("null")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> saveMetric(@RequestBody GlobalMetric metric, Principal principal,
            Authentication authentication) {
        boolean isSuperAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

        if (isSuperAdmin) {
            GlobalMetric savedMetric = repository.save(metric);
            auditLogService.logAction(principal.getName(), "CREATE", "GlobalMetric", savedMetric.getId(),
                    "Created metric: " + savedMetric.getLabel());
            return ResponseEntity.ok(savedMetric);
        } else {
            com.oceanlk.backend.model.PendingChange pendingChange = pendingChangeService.createPendingChange(
                    "GlobalMetric", null, "CREATE", principal.getName(), metric, null);
            auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL", "GlobalMetric", null,
                    "Submitted new metric for approval: " + metric.getLabel());
            return ResponseEntity.ok(Map.of(
                    "message", "Metric submitted for approval",
                    "pendingChange", pendingChange));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> updateMetric(@PathVariable @NonNull String id,
            @RequestBody GlobalMetric metric, Principal principal, Authentication authentication) {
        return repository.findById(id)
                .map(existing -> {
                    boolean isSuperAdmin = authentication.getAuthorities().stream()
                            .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

                    if (isSuperAdmin) {
                        existing.setLabel(metric.getLabel());
                        existing.setValue(metric.getValue());
                        existing.setIcon(metric.getIcon());
                        existing.setDisplayOrder(metric.getDisplayOrder());
                        GlobalMetric savedMetric = repository.save(existing);
                        auditLogService.logAction(principal.getName(), "UPDATE", "GlobalMetric", id,
                                "Updated metric: " + savedMetric.getLabel());
                        return ResponseEntity.ok(savedMetric);
                    } else {
                        if (pendingChangeService.hasPendingChange(id)) {
                            return ResponseEntity.badRequest().body(Map.of(
                                    "error", "This metric already has a pending change awaiting approval"));
                        }

                        metric.setId(id);
                        com.oceanlk.backend.model.PendingChange pendingChange = pendingChangeService
                                .createPendingChange(
                                        "GlobalMetric", id, "UPDATE", principal.getName(), metric, existing);
                        auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL", "GlobalMetric", id,
                                "Submitted metric update for approval: " + metric.getLabel());
                        return ResponseEntity.ok(Map.of(
                                "message", "Metric update submitted for approval",
                                "pendingChange", pendingChange));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> deleteMetric(@PathVariable @NonNull String id, Principal principal,
            Authentication authentication) {
        return repository.findById(id)
                .map(metric -> {
                    boolean isSuperAdmin = authentication.getAuthorities().stream()
                            .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

                    if (isSuperAdmin) {
                        repository.deleteById(id);
                        auditLogService.logAction(principal.getName(), "DELETE", "GlobalMetric", id,
                                "Deleted metric ID: " + id);
                        return ResponseEntity.ok().build();
                    } else {
                        if (pendingChangeService.hasPendingChange(id)) {
                            return ResponseEntity.badRequest().body(Map.of(
                                    "error", "This metric already has a pending change awaiting approval"));
                        }
                        com.oceanlk.backend.model.PendingChange pendingChange = pendingChangeService
                                .createPendingChange(
                                        "GlobalMetric", id, "DELETE", principal.getName(), metric, metric);
                        auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL", "GlobalMetric", id,
                                "Submitted metric deletion for approval");
                        return ResponseEntity.ok(Map.of(
                                "message", "Metric deletion submitted for approval",
                                "pendingChange", pendingChange));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
