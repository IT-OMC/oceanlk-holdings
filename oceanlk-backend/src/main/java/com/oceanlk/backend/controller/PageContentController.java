package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.PageContent;
import com.oceanlk.backend.repository.PageContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PageContentController {

    private final PageContentRepository repository;
    private final com.oceanlk.backend.service.AuditLogService auditLogService;

    @GetMapping("/{page}")
    public ResponseEntity<List<PageContent>> getPageContent(@PathVariable String page) {
        return ResponseEntity.ok(repository.findByPageIdentifier(page.toUpperCase()));
    }

    @GetMapping("/{page}/{section}")
    public ResponseEntity<PageContent> getSectionContent(
            @PathVariable String page,
            @PathVariable String section) {
        return repository.findByPageIdentifierAndSectionIdentifier(page.toUpperCase(), section.toUpperCase())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PageContent> createOrUpdateContent(@RequestBody PageContent content) {
        Optional<PageContent> existing = repository.findByPageIdentifierAndSectionIdentifier(
                content.getPageIdentifier(), content.getSectionIdentifier());

        if (existing.isPresent()) {
            PageContent toUpdate = existing.get();
            toUpdate.setTitle(content.getTitle());
            toUpdate.setSubtitle(content.getSubtitle());
            toUpdate.setContent(content.getContent());
            toUpdate.setImageUrl(content.getImageUrl());
            toUpdate.setCtaText(content.getCtaText());
            toUpdate.setCtaLink(content.getCtaLink());
            PageContent saved = repository.save(toUpdate);

            // Log Action
            auditLogService.logAction("admin", "UPDATE", "PageContent", saved.getId(),
                    "Updated content for page: " + saved.getPageIdentifier() + " section: "
                            + saved.getSectionIdentifier());

            return ResponseEntity.ok(saved);
        }

        PageContent saved = repository.save(content);

        // Log Action
        auditLogService.logAction("admin", "CREATE", "PageContent", saved.getId(),
                "Created content for page: " + saved.getPageIdentifier() + " section: " + saved.getSectionIdentifier());

        return ResponseEntity.ok(saved);
    }
}
