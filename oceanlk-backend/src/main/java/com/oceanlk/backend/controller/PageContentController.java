package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.PageContent;
import com.oceanlk.backend.repository.PageContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.security.Principal;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PageContentController {

    private final PageContentRepository repository;
    private final com.oceanlk.backend.service.AuditLogService auditLogService;
    private final com.oceanlk.backend.service.PendingChangeService pendingChangeService;

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
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> createOrUpdateContent(@RequestBody PageContent content, Principal principal,
            Authentication authentication) {
        boolean isSuperAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

        Optional<PageContent> existing = repository.findByPageIdentifierAndSectionIdentifier(
                content.getPageIdentifier(), content.getSectionIdentifier());

        if (isSuperAdmin) {
            PageContent saved;
            if (existing.isPresent()) {
                PageContent toUpdate = existing.get();
                PageContent existingOriginal = repository.findById(toUpdate.getId()).orElse(null);

                toUpdate.setTitle(content.getTitle());
                toUpdate.setSubtitle(content.getSubtitle());
                toUpdate.setContent(content.getContent());
                toUpdate.setImageUrl(content.getImageUrl());
                toUpdate.setCtaText(content.getCtaText());
                toUpdate.setCtaLink(content.getCtaLink());
                saved = repository.save(toUpdate);

                // Record in history for Super Admin
                pendingChangeService.createApprovedChange(
                        "PageContent", saved.getId(), "UPDATE", principal.getName(), saved, existingOriginal);

                // Log Action
                auditLogService.logAction(principal.getName(), "UPDATE", "PageContent", saved.getId(),
                        "Updated content for page: " + saved.getPageIdentifier() + " section: "
                                + saved.getSectionIdentifier());
            } else {
                saved = repository.save(content);

                // Record in history for Super Admin
                pendingChangeService.createApprovedChange(
                        "PageContent", saved.getId(), "CREATE", principal.getName(), saved, null);

                // Log Action
                auditLogService.logAction(principal.getName(), "CREATE", "PageContent", saved.getId(),
                        "Created content for page: " + saved.getPageIdentifier() + " section: "
                                + saved.getSectionIdentifier());
            }
            return ResponseEntity.ok(saved);
        } else {
            // Admin: Create pending change
            String action = existing.isPresent() ? "UPDATE" : "CREATE";
            String id = existing.isPresent() ? existing.get().getId() : null;
            PageContent originalData = existing.orElse(null);

            com.oceanlk.backend.model.PendingChange pendingChange = pendingChangeService.createPendingChange(
                    "PageContent", id, action, principal.getName(), content, originalData);

            auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL", "PageContent", id,
                    "Submitted content " + action + " for page: " + content.getPageIdentifier() + " section: "
                            + content.getSectionIdentifier());

            return ResponseEntity.ok(Map.of(
                    "message", "Content change submitted for approval",
                    "pendingChange", pendingChange));
        }
    }
}
