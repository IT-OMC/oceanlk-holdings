package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.GlobalMetric;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GlobalMetricRepository extends MongoRepository<GlobalMetric, String> {
    List<GlobalMetric> findAllByOrderByDisplayOrderAsc();
}
