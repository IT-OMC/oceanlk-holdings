package com.oceanlk.backend.service;

import com.oceanlk.backend.model.TalentPoolApplication;
import com.oceanlk.backend.repository.TalentPoolApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TalentPoolService {

    @Autowired
    private TalentPoolApplicationRepository talentPoolApplicationRepository;

    @Autowired
    private EmailService emailService;

    public List<TalentPoolApplication> getAllApplications() {
        return talentPoolApplicationRepository.findAll();
    }

    public List<TalentPoolApplication> getApplicationsByStatus(String status) {
        return talentPoolApplicationRepository.findByStatus(status);
    }

    public Optional<TalentPoolApplication> getApplicationById(String id) {
        return talentPoolApplicationRepository.findById(id);
    }

    public TalentPoolApplication createApplication(TalentPoolApplication application) {
        TalentPoolApplication savedApplication = talentPoolApplicationRepository.save(application);

        // Send notification emails
        try {
            emailService.sendApplicantConfirmation(savedApplication);
            emailService.sendHRNotification(savedApplication);
        } catch (Exception e) {
            System.err.println("Failed to send application notification: " + e.getMessage());
        }

        return savedApplication;
    }

    public TalentPoolApplication updateApplicationStatus(String id, String status) {
        TalentPoolApplication application = talentPoolApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));

        application.setStatus(status);
        return talentPoolApplicationRepository.save(application);
    }

    public void deleteApplication(String id) {
        talentPoolApplicationRepository.deleteById(id);
    }
}
