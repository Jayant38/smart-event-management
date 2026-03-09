package com.event.event_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.event.event_management.entity.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
	List<Event> findByActiveTrue();
	List<Event> findByCategory(String category);
	// ⭐ AI Recommendation Query
    @Query("SELECT e FROM Event e WHERE e.category IN :categories AND e.active = true")
    List<Event> findRecommendedEvents(List<String> categories);
    
    List<Event> findByPriceLessThan(double price);
    List<Event> findByTitleContainingIgnoreCase(String title);
    List<Event> findByCategoryIgnoreCase(String category);
}