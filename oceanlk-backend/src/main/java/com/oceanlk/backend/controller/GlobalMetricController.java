package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.GlobalMetric;
import com.oceanlk.backend.repository.GlobalMetricRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.lang.NonNull;
import java.util.List;

@RestController
@RequestMapping("/api/metrics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GlobalMetricController {

    private final GlobalMetricRepository repository;
    private final com.oceanlk.backend.service.AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<GlobalMetric>> getAllMetrics() {
        return ResponseEntity.ok(repository.findAllByOrderByDisplayOrderAsc());
    }

    @PostMapping
    @SuppressWarnings("null")
    public ResponseEntity<GlobalMetric> saveMetric(@RequestBody GlobalMetric metric) {
        GlobalMetric savedMetric = repository.save(metric);

        // Log Action
        auditLogService.logAction("admin", "CREATE", "GlobalMetric", savedMetric.getId(),
                "Created metric: " + savedMetric.getLabel());

        return ResponseEntity.ok(savedMetric);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GlobalMetric> updateMetric(@PathVariable @NonNull String id,
            @RequestBody GlobalMetric metric) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setLabel(metric.getLabel());
                    existing.setValue(metric.getValue());
                    existing.setIcon(metric.getIcon());
                    existing.setDisplayOrder(metric.getDisplayOrder());
                    GlobalMetric savedMetric = repository.save(existing);

                    // Log Action
                    auditLogService.logAction("admin", "UPDATE", "GlobalMetric", id,
                            "Updated metric: " + savedMetric.getLabel());

                    return ResponseEntity.ok(savedMetric);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMetric(@PathVariable @NonNull String id) {
        repository.deleteById(id);

        // Log Action
        auditLogService.logAction("admin", "DELETE", "GlobalMetric", id, "Deleted metric ID: " + id);

        return ResponseEntity.ok().build();
    }
}
