package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.Company;
import com.oceanlk.backend.service.CompanyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:4173" })
@Slf4j
public class CompanyController {

    private final CompanyService companyService;
    private final com.oceanlk.backend.service.AuditLogService auditLogService;
    private final com.oceanlk.backend.service.PendingChangeService pendingChangeService;

    // Public endpoints
    @GetMapping("/companies")
    public List<Company> getAllCompanies() {
        return companyService.getAllCompanies();
    }

    @GetMapping("/companies/{id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable @NonNull String id) {
        return companyService.getCompanyById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin endpoints
    @PostMapping("/admin/companies")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> createCompany(@RequestBody Company company, Principal principal,
            Authentication authentication) {
        try {
            boolean isSuperAdmin = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

            if (isSuperAdmin) {
                Company savedCompany = companyService.createCompany(company);
                auditLogService.logAction(principal.getName(), "CREATE", "Company", savedCompany.getId(),
                        "Created company: " + savedCompany.getTitle());
                return ResponseEntity.status(HttpStatus.CREATED).body(savedCompany);
            } else {
                com.oceanlk.backend.model.PendingChange pendingChange = pendingChangeService.createPendingChange(
                        "Company", null, "CREATE", principal.getName(), company, null);
                auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL", "Company", null,
                        "Submitted new company for approval: " + company.getTitle());
                return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                        "message", "Company submitted for approval",
                        "pendingChange", pendingChange));
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create company: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/admin/companies/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> updateCompany(@PathVariable String id, @RequestBody Company updatedCompany,
            Principal principal, Authentication authentication) {
        try {
            boolean isSuperAdmin = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

            if (isSuperAdmin) {
                Company saved = companyService.updateCompany(id, updatedCompany);
                auditLogService.logAction(principal.getName(), "UPDATE", "Company", id,
                        "Updated company: " + saved.getTitle());
                return ResponseEntity.ok(saved);
            } else {
                if (pendingChangeService.hasPendingChange(id)) {
                    return ResponseEntity.badRequest().body(Map.of(
                            "error", "This company already has a pending change awaiting approval"));
                }

                Company existing = companyService.getCompanyById(id)
                        .orElseThrow(() -> new RuntimeException("Company not found"));

                updatedCompany.setId(id);
                com.oceanlk.backend.model.PendingChange pendingChange = pendingChangeService.createPendingChange(
                        "Company", id, "UPDATE", principal.getName(), updatedCompany, existing);
                auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL", "Company", id,
                        "Submitted company update for approval: " + updatedCompany.getTitle());
                return ResponseEntity.ok(Map.of(
                        "message", "Company update submitted for approval",
                        "pendingChange", pendingChange));
            }
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @DeleteMapping("/admin/companies/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> deleteCompany(@PathVariable String id, Principal principal,
            Authentication authentication) {
        Company existing = companyService.getCompanyById(id).orElse(null);
        if (existing == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Company not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        boolean isSuperAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

        if (isSuperAdmin) {
            companyService.deleteCompany(id);
            auditLogService.logAction(principal.getName(), "DELETE", "Company", id, "Deleted company ID: " + id);
            return ResponseEntity.ok(Map.of("message", "Company deleted successfully"));
        } else {
            if (pendingChangeService.hasPendingChange(id)) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "This company already has a pending change awaiting approval"));
            }

            com.oceanlk.backend.model.PendingChange pendingChange = pendingChangeService.createPendingChange(
                    "Company", id, "DELETE", principal.getName(), existing, existing);
            auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL", "Company", id,
                    "Submitted company deletion for approval");
            return ResponseEntity.ok(Map.of(
                    "message", "Company deletion submitted for approval",
                    "pendingChange", pendingChange));
        }
    }
}
