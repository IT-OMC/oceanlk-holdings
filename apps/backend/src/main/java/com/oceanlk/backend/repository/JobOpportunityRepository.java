package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.JobOpportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobOpportunityRepository extends JpaRepository<JobOpportunity, String> {

    List<JobOpportunity> findByStatus(String status);

    List<JobOpportunity> findByCategory(String category);

    List<JobOpportunity> findByFeaturedTrue();

    List<JobOpportunity> findByStatusOrderByPostedDateDesc(String status);
}
