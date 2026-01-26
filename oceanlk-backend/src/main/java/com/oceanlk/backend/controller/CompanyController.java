package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.Company;
import com.oceanlk.backend.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.lang.NonNull;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:4173" })
public class CompanyController {

    private final CompanyService companyService;
    private final com.oceanlk.backend.service.AuditLogService auditLogService;

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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCompany(@RequestBody Company company) {
        try {
            Company savedCompany = companyService.createCompany(company);

            // Log Action
            auditLogService.logAction("admin", "CREATE", "Company", savedCompany.getId(),
                    "Created company: " + savedCompany.getTitle());

            return ResponseEntity.status(HttpStatus.CREATED).body(savedCompany);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create company: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/admin/companies/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCompany(@PathVariable String id, @RequestBody Company updatedCompany) {
        try {
            Company saved = companyService.updateCompany(id, updatedCompany);

            // Log Action
            auditLogService.logAction("admin", "UPDATE", "Company", id,
                    "Updated company: " + saved.getTitle());

            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @DeleteMapping("/admin/companies/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCompany(@PathVariable String id) {
        if (companyService.getCompanyById(id).isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Company not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
        companyService.deleteCompany(id);

        // Log Action
        auditLogService.logAction("admin", "DELETE", "Company", id, "Deleted company ID: " + id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Company deleted successfully");
        return ResponseEntity.ok(response);
    }
}
