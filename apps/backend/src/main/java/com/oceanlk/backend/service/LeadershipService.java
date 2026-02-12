package com.oceanlk.backend.service;

import com.oceanlk.backend.model.CorporateLeader;
import com.oceanlk.backend.repository.CorporateLeaderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LeadershipService {

    @Autowired
    private CorporateLeaderRepository corporateLeaderRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public List<CorporateLeader> getAllLeaders() {
        return corporateLeaderRepository.findAllByOrderByDisplayOrderAsc();
    }

    public List<CorporateLeader> getLeadersByDepartment(String department) {
        return corporateLeaderRepository.findByDepartmentOrderByDisplayOrderAsc(department);
    }

    public Optional<CorporateLeader> getLeaderById(String id) {
        return corporateLeaderRepository.findById(id);
    }

    public CorporateLeader createLeader(CorporateLeader leader) {
        return corporateLeaderRepository.save(leader);
    }

    public CorporateLeader updateLeader(String id, CorporateLeader leaderDetails) {
        CorporateLeader leader = corporateLeaderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leader not found with id: " + id));

        // Delete old image if it exists and is being replaced
        try {
            if (leaderDetails.getImage() != null && !leaderDetails.getImage().equals(leader.getImage())
                    && leader.getImage() != null) {
                fileStorageService.deleteFile(leader.getImage());
            }
        } catch (Exception e) {
            System.err.println("Error deleting old image during update: " + e.getMessage());
        }

        leader.setName(leaderDetails.getName());
        leader.setPosition(leaderDetails.getPosition());
        leader.setDepartment(leaderDetails.getDepartment());
        leader.setBio(leaderDetails.getBio());
        leader.setShortDescription(leaderDetails.getShortDescription());
        leader.setImage(leaderDetails.getImage());
        leader.setLinkedin(leaderDetails.getLinkedin());
        leader.setEmail(leaderDetails.getEmail());
        leader.setDisplayOrder(leaderDetails.getDisplayOrder());

        return corporateLeaderRepository.save(leader);
    }

    public void deleteLeader(String id) {
        CorporateLeader leader = corporateLeaderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leader not found with id: " + id));

        // Delete associated image if it exists
        try {
            if (leader.getImage() != null) {
                fileStorageService.deleteFile(leader.getImage());
            }
        } catch (Exception e) {
            System.err.println("Error deleting leader image: " + e.getMessage());
        }

        corporateLeaderRepository.deleteById(id);
    }
}
