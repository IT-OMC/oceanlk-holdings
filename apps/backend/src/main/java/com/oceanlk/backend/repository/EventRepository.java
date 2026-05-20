package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, String> {
    List<Event> findByStatus(String status);

    List<Event> findByCategory(String category);

    List<Event> findByDateBetween(LocalDate startDate, LocalDate endDate);

    List<Event> findByDateGreaterThanEqualOrderByDateAsc(LocalDate date);

    List<Event> findByDateLessThanOrderByDateDesc(LocalDate date);
}
