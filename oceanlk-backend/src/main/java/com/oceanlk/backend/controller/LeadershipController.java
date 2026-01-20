package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.CorporateLeader;
import com.oceanlk.backend.repository.CorporateLeaderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leadership")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LeadershipController {

    private final CorporateLeaderRepository repository;

    @GetMapping
    public ResponseEntity<List<CorporateLeader>> getAllLeaders() {
        return ResponseEntity.ok(repository.findAllByOrderByDisplayOrderAsc());
    }

    @GetMapping("/department/{dept}")
    public ResponseEntity<List<CorporateLeader>> getLeadersByDepartment(@PathVariable String dept) {
        return ResponseEntity.ok(repository.findByDepartmentOrderByDisplayOrderAsc(dept.toUpperCase()));
    }

    @PostMapping
    public ResponseEntity<CorporateLeader> createLeader(@RequestBody CorporateLeader leader) {
        return ResponseEntity.ok(repository.save(leader));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CorporateLeader> updateLeader(@PathVariable String id, @RequestBody CorporateLeader leader) {
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
                    return ResponseEntity.ok(repository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLeader(@PathVariable String id) {
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
