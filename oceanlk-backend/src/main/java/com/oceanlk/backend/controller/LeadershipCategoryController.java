package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.LeadershipCategory;
import com.oceanlk.backend.repository.LeadershipCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leadership-categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LeadershipCategoryController {

    private final LeadershipCategoryRepository repository;
    private final com.oceanlk.backend.service.AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<LeadershipCategory>> getAllCategories() {
        List<LeadershipCategory> categories = repository.findAllByOrderByDisplayOrderAsc();

        // Initialize default categories if none exist
        if (categories.isEmpty()) {
            categories = initializeDefaultCategories();
        }

        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{code}")
    public ResponseEntity<LeadershipCategory> getCategoryByCode(@PathVariable String code) {
        return repository.findByCode(code.toUpperCase())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{code}")
    public ResponseEntity<LeadershipCategory> updateCategory(@PathVariable String code,
            @RequestBody LeadershipCategory updatedCategory) {
        return repository.findByCode(code.toUpperCase())
                .map(existing -> {
                    existing.setTitle(updatedCategory.getTitle());
                    existing.setSubtitle(updatedCategory.getSubtitle());
                    LeadershipCategory saved = repository.save(existing);

                    // Log Action
                    auditLogService.logAction("admin", "UPDATE", "LeadershipCategory", code,
                            "Updated leadership category: " + saved.getTitle());

                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LeadershipCategory> createCategory(@RequestBody LeadershipCategory category) {
        if (repository.findByCode(category.getCode().toUpperCase()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        category.setCode(category.getCode().toUpperCase());
        LeadershipCategory saved = repository.save(category);

        // Log Action
        auditLogService.logAction("admin", "CREATE", "LeadershipCategory", saved.getCode(),
                "Created leadership category: " + saved.getTitle());

        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{code}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String code) {
        java.util.Optional<LeadershipCategory> categoryOpt = repository.findByCode(code.toUpperCase());
        if (categoryOpt.isPresent()) {
            LeadershipCategory category = categoryOpt.get();
            repository.delete(category);

            // Log Action
            auditLogService.logAction("admin", "DELETE", "LeadershipCategory", code,
                    "Deleted leadership category: " + category.getTitle());

            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    private List<LeadershipCategory> initializeDefaultCategories() {
        LeadershipCategory board = new LeadershipCategory(
                "BOARD",
                "Board of Directors",
                "Strategic governance and oversight guiding our organization's vision, values, and long-term success",
                1);

        LeadershipCategory executive = new LeadershipCategory(
                "EXECUTIVE",
                "Executive Leadership",
                "C-Suite executives driving operational excellence and strategic initiatives across the organization",
                2);

        LeadershipCategory senior = new LeadershipCategory(
                "SENIOR",
                "Senior Management",
                "Experienced leaders managing key departments and driving day-to-day operational success",
                3);

        repository.save(board);
        repository.save(executive);
        repository.save(senior);

        return List.of(board, executive, senior);
    }
}
