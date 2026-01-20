package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.Partner;
import com.oceanlk.backend.repository.PartnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partners")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PartnerController {

    private final PartnerRepository repository;

    @GetMapping
    public ResponseEntity<List<Partner>> getAllPartners() {
        return ResponseEntity.ok(repository.findAllByOrderByDisplayOrderAsc());
    }

    @PostMapping
    public ResponseEntity<Partner> savePartner(@RequestBody Partner partner) {
        return ResponseEntity.ok(repository.save(partner));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Partner> updatePartner(@PathVariable String id, @RequestBody Partner partner) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setName(partner.getName());
                    existing.setLogoUrl(partner.getLogoUrl());
                    existing.setWebsiteUrl(partner.getWebsiteUrl());
                    existing.setCategory(partner.getCategory());
                    existing.setDisplayOrder(partner.getDisplayOrder());
                    return ResponseEntity.ok(repository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePartner(@PathVariable String id) {
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
