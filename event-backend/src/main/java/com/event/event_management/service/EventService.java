package com.event.event_management.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.event.event_management.entity.Event;

public interface EventService {
	 Event createEvent(Event event);

	    List<Event> getAllEvents();

	    Event getEventById(Long id);

	    Event updateEvent(Long id, Event event);

	    void deleteEvent(Long id);
	    List<Event> getAllEventsForAdmin();
	    void toggleEventStatus(Long id);

		String saveEventImage(MultipartFile image) throws IOException;
		List<Event> getEventsByCategory(String category);
		List<Event> getRecommendedEvents(Long userId);
	    List<Event> chatbotSearch(String query);
}
