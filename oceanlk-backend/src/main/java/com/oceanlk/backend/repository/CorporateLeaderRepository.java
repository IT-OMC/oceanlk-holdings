package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.CorporateLeader;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CorporateLeaderRepository extends MongoRepository<CorporateLeader, String> {
    List<CorporateLeader> findByDepartmentOrderByDisplayOrderAsc(String department);

    List<CorporateLeader> findAllByOrderByDisplayOrderAsc();
}
