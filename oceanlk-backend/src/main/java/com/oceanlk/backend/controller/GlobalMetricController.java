package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.GlobalMetric;
import com.oceanlk.backend.repository.GlobalMetricRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metrics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GlobalMetricController {

    private final GlobalMetricRepository repository;

    @GetMapping
    public ResponseEntity<List<GlobalMetric>> getAllMetrics() {
        return ResponseEntity.ok(repository.findAllByOrderByDisplayOrderAsc());
    }

    @PostMapping
    public ResponseEntity<GlobalMetric> saveMetric(@RequestBody GlobalMetric metric) {
        return ResponseEntity.ok(repository.save(metric));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GlobalMetric> updateMetric(@PathVariable String id, @RequestBody GlobalMetric metric) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setLabel(metric.getLabel());
                    existing.setValue(metric.getValue());
                    existing.setIcon(metric.getIcon());
                    existing.setDisplayOrder(metric.getDisplayOrder());
                    return ResponseEntity.ok(repository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMetric(@PathVariable String id) {
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
