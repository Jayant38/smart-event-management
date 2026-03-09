package com.event.event_management.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.event.event_management.entity.Event;
import com.event.event_management.service.EventService;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:5173")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // ✅ ADMIN only - Create Event (IMAGE ADDED)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Event createEvent(
            @RequestPart("event") Event event,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws IOException {

        if (image != null && !image.isEmpty()) {

            String fileName = eventService.saveEventImage(image);
            event.setImageUrl(fileName);

        }

        return eventService.createEvent(event);
    }

    // ✅ Public (Logged-in Users)
    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    // ✅ Public (Logged-in Users)
    @GetMapping("/{id}")
    public Event getEventById(@PathVariable Long id) {
        return eventService.getEventById(id);
    }

    // ✅ ADMIN only - Update Event
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Event updateEvent(@PathVariable Long id,
                             @RequestBody Event event) {
        return eventService.updateEvent(id, event);
    }

    // ✅ ADMIN only - Delete Event
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return "Event deleted successfully";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/events")
    public ResponseEntity<List<Event>> getAllEventsForAdmin() {
        return ResponseEntity.ok(eventService.getAllEventsForAdmin());
    }
 // Filter Events By Category
    @GetMapping("/category/{category}")
    public List<Event> getEventsByCategory(@PathVariable String category) {
        return eventService.getEventsByCategory(category);
    }
    
    @GetMapping("/recommendations/{userId}")
    public List<Event> getRecommendedEvents(@PathVariable Long userId){

        return eventService.getRecommendedEvents(userId);

    }

    @GetMapping("/chatbot")
    public List<Event> chatbot(@RequestParam String query) {
        return eventService.chatbotSearch(query);
    }

}