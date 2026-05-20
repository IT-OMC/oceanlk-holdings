package com.oceanlk.backend.service;

import com.oceanlk.backend.model.Partner;
import com.oceanlk.backend.repository.PartnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PartnerService {

    @Autowired
    private PartnerRepository partnerRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public List<Partner> getAllPartners() {
        return partnerRepository.findAll();
    }

    public Optional<Partner> getPartnerById(String id) {
        return partnerRepository.findById(id);
    }

    public Partner createPartner(Partner partner) {
        return partnerRepository.save(partner);
    }

    public Partner updatePartner(String id, Partner partnerDetails) {
        Partner partner = partnerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partner not found with id: " + id));

        // Delete old logo if it exists and is being replaced
        try {
            if (partnerDetails.getLogoUrl() != null && !partnerDetails.getLogoUrl().equals(partner.getLogoUrl())
                    && partner.getLogoUrl() != null) {
                fileStorageService.deleteFile(partner.getLogoUrl());
            }
        } catch (Exception e) {
            System.err.println("Error deleting old logo during update: " + e.getMessage());
        }

        partner.setName(partnerDetails.getName());
        partner.setLogoUrl(partnerDetails.getLogoUrl());
        partner.setWebsiteUrl(partnerDetails.getWebsiteUrl());
        partner.setCategory(partnerDetails.getCategory());
        partner.setDisplayOrder(partnerDetails.getDisplayOrder());

        return partnerRepository.save(partner);
    }

    public void deletePartner(String id) {
        Partner partner = partnerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partner not found with id: " + id));

        // Delete associated logo if it exists
        try {
            if (partner.getLogoUrl() != null) {
                fileStorageService.deleteFile(partner.getLogoUrl());
            }
        } catch (Exception e) {
            System.err.println("Error deleting partner logo: " + e.getMessage());
        }

        partnerRepository.deleteById(id);
    }
}
