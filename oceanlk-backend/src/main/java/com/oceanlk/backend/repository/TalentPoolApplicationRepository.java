package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.TalentPoolApplication;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TalentPoolApplicationRepository extends MongoRepository<TalentPoolApplication, String> {

    List<TalentPoolApplication> findByStatus(String status);

    List<TalentPoolApplication> findByEmailContainingIgnoreCase(String email);

    List<TalentPoolApplication> findBySubmittedDateBetween(LocalDateTime start, LocalDateTime end);

    List<TalentPoolApplication> findAllByOrderBySubmittedDateDesc();
}
