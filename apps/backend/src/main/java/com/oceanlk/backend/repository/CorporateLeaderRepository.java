package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.CorporateLeader;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CorporateLeaderRepository extends JpaRepository<CorporateLeader, String> {
    List<CorporateLeader> findByDepartmentOrderByDisplayOrderAsc(String department);

    List<CorporateLeader> findAllByOrderByDisplayOrderAsc();
}
