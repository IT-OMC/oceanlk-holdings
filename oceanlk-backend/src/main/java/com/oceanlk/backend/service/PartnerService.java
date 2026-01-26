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

        partner.setName(partnerDetails.getName());
        partner.setLogoUrl(partnerDetails.getLogoUrl());
        partner.setWebsiteUrl(partnerDetails.getWebsiteUrl());
        partner.setCategory(partnerDetails.getCategory());
        partner.setDisplayOrder(partnerDetails.getDisplayOrder());

        return partnerRepository.save(partner);
    }

    public void deletePartner(String id) {
        partnerRepository.deleteById(id);
    }
}
