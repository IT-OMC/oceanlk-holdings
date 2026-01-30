package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.Event;
import com.oceanlk.backend.model.PendingChange;
import com.oceanlk.backend.service.EventService;
import com.oceanlk.backend.service.PendingChangeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private PendingChangeService pendingChangeService;

    @Autowired
    private com.oceanlk.backend.service.AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category) {

        List<Event> events;

        if (status != null) {
            events = eventService.getEventsByStatus(status);
        } else if (category != null) {
            events = eventService.getEventsByCategory(category);
        } else {
            events = eventService.getAllEvents();
        }

        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable String id) {
        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Event>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }

    @GetMapping("/past")
    public ResponseEntity<List<Event>> getPastEvents() {
        return ResponseEntity.ok(eventService.getPastEvents());
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Event>> getEventsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(eventService.getEventsByDateRange(startDate, endDate));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> createEvent(@Valid @RequestBody Event event, Principal principal,
            Authentication authentication) {
        // Check if user is superadmin
        boolean isSuperAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

        if (isSuperAdmin) {
            // Superadmin: Direct publish
            Event createdEvent = eventService.createEvent(event);

            // Record in history for Super Admin
            pendingChangeService.createApprovedChange(
                    "Event", createdEvent.getId(), "CREATE", principal.getName(), createdEvent, null);

            auditLogService.logAction(principal.getName(), "CREATE", "Event", createdEvent.getId(),
                    "Created event: " + createdEvent.getTitle());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
        } else {
            // Admin: Create pending change
            PendingChange pendingChange = pendingChangeService.createPendingChange(
                    "Event", null, "CREATE", principal.getName(), event, null);
            auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL", "Event", null,
                    "Submitted new event for approval: " + event.getTitle());
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Event submitted for approval",
                    "pendingChange", pendingChange));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> updateEvent(@PathVariable String id, @Valid @RequestBody Event event,
            Principal principal, Authentication authentication) {
        try {
            // Check if user is superadmin
            boolean isSuperAdmin = authentication.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

            if (isSuperAdmin) {
                // Superadmin: Direct update
                // Capture original state for history tracking
                Event originalEvent = eventService.getEventById(id).orElse(null);

                Event updatedEvent = eventService.updateEvent(id, event);

                // Record in history for Super Admin
                pendingChangeService.createApprovedChange(
                        "Event", id, "UPDATE", principal.getName(), updatedEvent, originalEvent);

                auditLogService.logAction(principal.getName(), "UPDATE", "Event", id,
                        "Updated event: " + updatedEvent.getTitle());
                return ResponseEntity.ok(updatedEvent);
            } else {
                // Check for existing pending change
                if (pendingChangeService.hasPendingChange(id)) {
                    return ResponseEntity.badRequest().body(Map.of(
                            "error", "This event already has a pending change awaiting approval"));
                }

                // Get original event
                Event originalEvent = eventService.getEventById(id)
                        .orElseThrow(() -> new RuntimeException("Event not found"));

                // Admin: Create pending change
                event.setId(id);
                PendingChange pendingChange = pendingChangeService.createPendingChange(
                        "Event", id, "UPDATE", principal.getName(), event, originalEvent);
                auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL", "Event", id,
                        "Submitted event update for approval: " + event.getTitle());
                return ResponseEntity.ok(Map.of(
                        "message", "Event update submitted for approval",
                        "pendingChange", pendingChange));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> deleteEvent(@PathVariable String id, Principal principal, Authentication authentication) {
        // Check if user is superadmin
        boolean isSuperAdmin = authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_SUPER_ADMIN"));

        if (isSuperAdmin) {
            // Superadmin: Direct delete
            // Get original event for history tracking
            Event originalEvent = eventService.getEventById(id).orElse(null);

            eventService.deleteEvent(id);

            // Record in history for Super Admin
            pendingChangeService.createApprovedChange(
                    "Event", id, "DELETE", principal.getName(), originalEvent, originalEvent);

            auditLogService.logAction(principal.getName(), "DELETE", "Event", id, "Deleted event ID: " + id);
            return ResponseEntity.noContent().build();
        } else {
            // Check for existing pending change
            if (pendingChangeService.hasPendingChange(id)) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "This event already has a pending change awaiting approval"));
            }

            // Get original event
            Event originalEvent = eventService.getEventById(id)
                    .orElseThrow(() -> new RuntimeException("Event not found"));

            // Admin: Create pending change for deletion
            PendingChange pendingChange = pendingChangeService.createPendingChange(
                    "Event", id, "DELETE", principal.getName(), originalEvent, originalEvent);
            auditLogService.logAction(principal.getName(), "SUBMIT_FOR_APPROVAL", "Event", id,
                    "Submitted event deletion for approval");
            return ResponseEntity.ok(Map.of(
                    "message", "Event deletion submitted for approval",
                    "pendingChange", pendingChange));
        }
    }
}
