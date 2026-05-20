package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.TalentPoolApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TalentPoolApplicationRepository extends JpaRepository<TalentPoolApplication, String> {

    List<TalentPoolApplication> findByStatus(String status);

    List<TalentPoolApplication> findByEmailContainingIgnoreCase(String email);

    List<TalentPoolApplication> findBySubmittedDateBetween(LocalDateTime start, LocalDateTime end);

    List<TalentPoolApplication> findAllByOrderBySubmittedDateDesc();
}
