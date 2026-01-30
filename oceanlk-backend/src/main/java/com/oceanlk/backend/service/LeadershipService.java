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
        corporateLeaderRepository.deleteById(id);
    }
}
