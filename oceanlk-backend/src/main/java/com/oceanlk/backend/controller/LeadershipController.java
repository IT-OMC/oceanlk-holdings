package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.CorporateLeader;
import com.oceanlk.backend.repository.CorporateLeaderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.lang.NonNull;
import java.util.List;

@RestController
@RequestMapping("/api/leadership")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LeadershipController {

    private final CorporateLeaderRepository repository;
    private final com.oceanlk.backend.service.AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<CorporateLeader>> getAllLeaders() {
        return ResponseEntity.ok(repository.findAllByOrderByDisplayOrderAsc());
    }

    @GetMapping("/department/{dept}")
    public ResponseEntity<List<CorporateLeader>> getLeadersByDepartment(@PathVariable @NonNull String dept) {
        return ResponseEntity.ok(repository.findByDepartmentOrderByDisplayOrderAsc(dept.toUpperCase()));
    }

    @PostMapping
    public ResponseEntity<CorporateLeader> createLeader(@RequestBody CorporateLeader leader) {
        CorporateLeader savedLeader = java.util.Objects.requireNonNull(repository.save(leader));

        // Log Action
        auditLogService.logAction("admin", "CREATE", "CorporateLeader", savedLeader.getId(),
                "Created leadership member: " + savedLeader.getName());

        return ResponseEntity.ok(savedLeader);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CorporateLeader> updateLeader(@PathVariable @NonNull String id,
            @RequestBody CorporateLeader leader) {
        return repository.findById(id)
                .map(existing -> {
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

                    // Log Action
                    auditLogService.logAction("admin", "UPDATE", "CorporateLeader", id,
                            "Updated leadership member: " + savedLeader.getName());

                    return ResponseEntity.ok(savedLeader);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLeader(@PathVariable @NonNull String id) {
        repository.deleteById(id);

        // Log Action
        auditLogService.logAction("admin", "DELETE", "CorporateLeader", id, "Deleted leadership member ID: " + id);

        return ResponseEntity.ok().build();
    }
}
