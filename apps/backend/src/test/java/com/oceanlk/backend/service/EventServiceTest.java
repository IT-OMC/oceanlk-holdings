package com.oceanlk.backend.service;

import com.oceanlk.backend.model.Event;
import com.oceanlk.backend.repository.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private EventService eventService;

    private Event testEvent;

    @BeforeEach
    void setUp() {
        testEvent = new Event();
        testEvent.setId("event-123");
        testEvent.setTitle("Annual Conference");
        testEvent.setDescription("Company annual conference");
        testEvent.setDate(LocalDate.now().plusDays(30));
        testEvent.setLocation("Colombo");
        testEvent.setCategory("Conference");
    }

    @Test
    void getAllEvents_ShouldReturnAllEvents() {
        // Arrange
        List<Event> events = Arrays.asList(testEvent, new Event());
        when(eventRepository.findAll()).thenReturn(events);

        // Act
        List<Event> result = eventService.getAllEvents();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(eventRepository, times(1)).findAll();
    }

    @Test
    void getEventById_ShouldReturnEvent_WhenExists() {
        // Arrange
        when(eventRepository.findById("event-123")).thenReturn(Optional.of(testEvent));

        // Act
        Optional<Event> result = eventService.getEventById("event-123");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("Annual Conference", result.get().getTitle());
        verify(eventRepository, times(1)).findById("event-123");
    }

    @Test
    void createEvent_ShouldSetStatus_BasedOnDate_Upcoming() {
        // Arrange
        testEvent.setDate(LocalDate.now().plusDays(10));
        when(eventRepository.save(any(Event.class))).thenReturn(testEvent);

        // Act
        Event result = eventService.createEvent(testEvent);

        // Assert
        assertNotNull(result.getCreatedAt());
        assertNotNull(result.getUpdatedAt());
        assertEquals("UPCOMING", testEvent.getStatus());
        verify(eventRepository, times(1)).save(testEvent);
    }

    @Test
    void createEvent_ShouldSetStatus_BasedOnDate_Ongoing() {
        // Arrange
        testEvent.setDate(LocalDate.now());
        when(eventRepository.save(any(Event.class))).thenReturn(testEvent);

        // Act
        Event result = eventService.createEvent(testEvent);

        // Assert
        assertEquals("ONGOING", testEvent.getStatus());
        verify(eventRepository, times(1)).save(testEvent);
    }

    @Test
    void createEvent_ShouldSetStatus_BasedOnDate_Completed() {
        // Arrange
        testEvent.setDate(LocalDate.now().minusDays(10));
        when(eventRepository.save(any(Event.class))).thenReturn(testEvent);

        // Act
        Event result = eventService.createEvent(testEvent);

        // Assert
        assertEquals("COMPLETED", testEvent.getStatus());
        verify(eventRepository, times(1)).save(testEvent);
    }

    @Test
    void updateEvent_ShouldUpdateEventAndStatus() {
        // Arrange
        Event updates = new Event();
        updates.setTitle("Updated Conference");
        updates.setDate(LocalDate.now().plusDays(5));
        when(eventRepository.findById("event-123")).thenReturn(Optional.of(testEvent));
        when(eventRepository.save(any(Event.class))).thenReturn(testEvent);

        // Act
        Event result = eventService.updateEvent("event-123", updates);

        // Assert
        assertNotNull(result);
        verify(eventRepository, times(1)).save(testEvent);
    }

    @Test
    void deleteEvent_ShouldCallRepository() {
        // Arrange
        doNothing().when(eventRepository).deleteById("event-123");

        // Act
        eventService.deleteEvent("event-123");

        // Assert
        verify(eventRepository, times(1)).deleteById("event-123");
    }

    @Test
    void getUpcomingEvents_ShouldReturnFutureEvents() {
        // Arrange
        List<Event> upcomingEvents = Arrays.asList(testEvent);
        when(eventRepository.findByDateGreaterThanEqualOrderByDateAsc(any(LocalDate.class))).thenReturn(upcomingEvents);

        // Act
        List<Event> result = eventService.getUpcomingEvents();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(eventRepository, times(1)).findByDateGreaterThanEqualOrderByDateAsc(any(LocalDate.class));
    }

    @Test
    void getPastEvents_ShouldReturnPastEvents() {
        // Arrange
        Event pastEvent = new Event();
        pastEvent.setDate(LocalDate.now().minusDays(30));
        List<Event> pastEvents = Arrays.asList(pastEvent);
        when(eventRepository.findByDateLessThanOrderByDateDesc(any(LocalDate.class))).thenReturn(pastEvents);

        // Act
        List<Event> result = eventService.getPastEvents();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(eventRepository, times(1)).findByDateLessThanOrderByDateDesc(any(LocalDate.class));
    }

    @Test
    void getEventsByStatus_ShouldFilterByStatus() {
        // Arrange
        List<Event> upcomingEvents = Arrays.asList(testEvent);
        when(eventRepository.findByStatus("UPCOMING")).thenReturn(upcomingEvents);

        // Act
        List<Event> result = eventService.getEventsByStatus("UPCOMING");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(eventRepository, times(1)).findByStatus("UPCOMING");
    }

    @Test
    void getEventsByCategory_ShouldFilterByCategory() {
        // Arrange
        List<Event> conferenceEvents = Arrays.asList(testEvent);
        when(eventRepository.findByCategory("Conference")).thenReturn(conferenceEvents);

        // Act
        List<Event> result = eventService.getEventsByCategory("Conference");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(eventRepository, times(1)).findByCategory("Conference");
    }

    @Test
    void getEventsByDateRange_ShouldFilterByDateRange() {
        // Arrange
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = LocalDate.now().plusDays(60);
        List<Event> rangeEvents = Arrays.asList(testEvent);
        when(eventRepository.findByDateBetween(startDate, endDate)).thenReturn(rangeEvents);

        // Act
        List<Event> result = eventService.getEventsByDateRange(startDate, endDate);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(eventRepository, times(1)).findByDateBetween(startDate, endDate);
    }
}
