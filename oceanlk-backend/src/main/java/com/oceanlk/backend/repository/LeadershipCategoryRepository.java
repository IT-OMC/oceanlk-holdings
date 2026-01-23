package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.LeadershipCategory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeadershipCategoryRepository extends MongoRepository<LeadershipCategory, String> {
    Optional<LeadershipCategory> findByCode(String code);

    List<LeadershipCategory> findAllByOrderByDisplayOrderAsc();
}
