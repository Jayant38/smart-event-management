package com.event.event_management.service.impl;

import java.util.List;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.stereotype.Service;

import com.event.event_management.entity.Event;
import com.event.event_management.exception.ResourceNotFoundException;
import com.event.event_management.repository.BookingRepository;
import com.event.event_management.repository.EventRepository;
import com.event.event_management.service.EventService;
@Service
public class EventServiceImpl implements EventService  {
	private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    public EventServiceImpl(EventRepository eventRepository ,
    		BookingRepository bookingRepository) {
        this.eventRepository = eventRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findByActiveTrue();
    }

    @Override
    public Event getEventById(Long id) {
        return eventRepository.findById(id)
        		.orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

    }

    @Override
    public Event updateEvent(Long id, Event event) {
        Event existing = getEventById(id);

        existing.setTitle(event.getTitle());
        existing.setDescription(event.getDescription());
        existing.setPrice(event.getPrice());
        existing.setEventDate(event.getEventDate());
        existing.setLatitude(event.getLatitude());
        existing.setLongitude(event.getLongitude());
        existing.setAvailableSeats(event.getAvailableSeats());

        return eventRepository.save(existing);
    }

    @Override
    public void deleteEvent(Long id) {

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        event.setActive(false);  // 🔥 Soft delete
        eventRepository.save(event);
    }
    public List<Event> getAllEventsForAdmin() {
        return eventRepository.findAll();
    }
    @Override
    public void toggleEventStatus(Long id) {

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        event.setActive(!event.isActive()); // 🔥 toggle
        eventRepository.save(event);
    }
    @Override
    public String saveEventImage(MultipartFile image) throws IOException {

        String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();

        Path uploadPath = Paths.get("uploads");

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(fileName);

        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }
    @Override
    public List<Event> getEventsByCategory(String category) {
        return eventRepository.findByCategory(category);
    }
    @Override
    public List<Event> getRecommendedEvents(Long userId) {

        // user booking categories
        List<String> categories = bookingRepository.findUserBookingCategories(userId);

        if(categories.isEmpty()){
            return eventRepository.findByActiveTrue();
        }

        return eventRepository.findRecommendedEvents(categories);

    }

   
    @Override
    public List<Event> chatbotSearch(String query) {

        query = query.toLowerCase().trim();

        // CATEGORY SEARCH

        if(query.contains("tech"))
            return eventRepository.findByCategoryIgnoreCase("TECH");

        if(query.contains("ai"))
            return eventRepository.findByCategoryIgnoreCase("AI");

        if(query.contains("cloud"))
            return eventRepository.findByCategoryIgnoreCase("CLOUD");

        if(query.contains("music"))
            return eventRepository.findByCategoryIgnoreCase("MUSIC");

        if(query.contains("workshop"))
            return eventRepository.findByCategoryIgnoreCase("WORKSHOP");

        // PRICE SEARCH

        if(query.contains("cheap") || query.contains("low price"))
            return eventRepository.findByPriceLessThan(200);

        // TITLE SEARCH (fallback)

        return eventRepository.findByTitleContainingIgnoreCase(query);
    }
}
