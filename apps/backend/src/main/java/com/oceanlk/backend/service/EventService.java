package com.oceanlk.backend.service;

import com.oceanlk.backend.model.Event;
import com.oceanlk.backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(String id) {
        return eventRepository.findById(id);
    }

    public Event createEvent(Event event) {
        event.setCreatedAt(LocalDateTime.now());
        event.setUpdatedAt(LocalDateTime.now());

        // Auto-set status based on date
        if (event.getDate().isBefore(LocalDate.now())) {
            event.setStatus("COMPLETED");
        } else if (event.getDate().isEqual(LocalDate.now())) {
            event.setStatus("ONGOING");
        } else {
            event.setStatus("UPCOMING");
        }

        return eventRepository.save(event);
    }

    public Event updateEvent(String id, Event eventDetails) {
        return eventRepository.findById(id)
                .map(event -> {
                    event.setTitle(eventDetails.getTitle());
                    event.setDescription(eventDetails.getDescription());
                    event.setDate(eventDetails.getDate());
                    event.setTime(eventDetails.getTime());
                    event.setLocation(eventDetails.getLocation());
                    event.setImageUrl(eventDetails.getImageUrl());
                    event.setCategory(eventDetails.getCategory());
                    event.setUpdatedAt(LocalDateTime.now());

                    // Auto-update status based on date
                    if (event.getDate().isBefore(LocalDate.now())) {
                        event.setStatus("COMPLETED");
                    } else if (event.getDate().isEqual(LocalDate.now())) {
                        event.setStatus("ONGOING");
                    } else {
                        event.setStatus("UPCOMING");
                    }

                    return eventRepository.save(event);
                })
                .orElseThrow(() -> new RuntimeException("Event not found with id " + id));
    }

    public void deleteEvent(String id) {
        eventRepository.deleteById(id);
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findByDateGreaterThanEqualOrderByDateAsc(LocalDate.now());
    }

    public List<Event> getPastEvents() {
        return eventRepository.findByDateLessThanOrderByDateDesc(LocalDate.now());
    }

    public List<Event> getEventsByStatus(String status) {
        return eventRepository.findByStatus(status);
    }

    public List<Event> getEventsByCategory(String category) {
        return eventRepository.findByCategory(category);
    }

    public List<Event> getEventsByDateRange(LocalDate startDate, LocalDate endDate) {
        return eventRepository.findByDateBetween(startDate, endDate);
    }
}
