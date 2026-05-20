package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.LeadershipCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeadershipCategoryRepository extends JpaRepository<LeadershipCategory, String> {
    Optional<LeadershipCategory> findByCode(String code);

    List<LeadershipCategory> findAllByOrderByDisplayOrderAsc();
}
