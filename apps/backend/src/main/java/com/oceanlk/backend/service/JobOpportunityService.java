package com.oceanlk.backend.service;

import com.oceanlk.backend.model.JobOpportunity;
import com.oceanlk.backend.repository.JobOpportunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobOpportunityService {

    @Autowired
    private JobOpportunityRepository jobOpportunityRepository;

    public List<JobOpportunity> getAllJobs() {
        return jobOpportunityRepository.findAll();
    }

    public List<JobOpportunity> getActiveJobs() {
        return jobOpportunityRepository.findByStatus("ACTIVE");
    }

    public Optional<JobOpportunity> getJobById(String id) {
        return jobOpportunityRepository.findById(id);
    }

    public JobOpportunity createJob(JobOpportunity job) {
        return jobOpportunityRepository.save(job);
    }

    public JobOpportunity updateJob(String id, JobOpportunity jobDetails) {
        JobOpportunity job = jobOpportunityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));

        job.setTitle(jobDetails.getTitle());
        job.setCompany(jobDetails.getCompany());
        job.setLocation(jobDetails.getLocation());
        job.setType(jobDetails.getType());
        job.setCategory(jobDetails.getCategory());
        job.setDescription(jobDetails.getDescription());
        job.setFeatured(jobDetails.isFeatured());
        job.setLevel(jobDetails.getLevel());
        job.setStatus(jobDetails.getStatus());
        job.setPostedDate(jobDetails.getPostedDate());

        return jobOpportunityRepository.save(job);
    }

    public void deleteJob(String id) {
        jobOpportunityRepository.deleteById(id);
    }
}
