package com.oceanlk.backend.service;

import com.oceanlk.backend.model.GlobalMetric;
import com.oceanlk.backend.repository.GlobalMetricRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GlobalMetricService {

    @Autowired
    private GlobalMetricRepository globalMetricRepository;

    public List<GlobalMetric> getAllMetrics() {
        return globalMetricRepository.findAll();
    }

    public Optional<GlobalMetric> getMetricById(String id) {
        return globalMetricRepository.findById(id);
    }

    public GlobalMetric createMetric(GlobalMetric metric) {
        return globalMetricRepository.save(metric);
    }

    public GlobalMetric updateMetric(String id, GlobalMetric metricDetails) {
        GlobalMetric metric = globalMetricRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Metric not found with id: " + id));

        metric.setLabel(metricDetails.getLabel());
        metric.setValue(metricDetails.getValue());
        metric.setIcon(metricDetails.getIcon());
        metric.setDisplayOrder(metricDetails.getDisplayOrder());

        return globalMetricRepository.save(metric);
    }

    public void deleteMetric(String id) {
        globalMetricRepository.deleteById(id);
    }
}
