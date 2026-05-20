package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.GlobalMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GlobalMetricRepository extends JpaRepository<GlobalMetric, String> {
    List<GlobalMetric> findAllByOrderByDisplayOrderAsc();
}
