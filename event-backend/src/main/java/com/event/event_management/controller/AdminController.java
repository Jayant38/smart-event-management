package com.event.event_management.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.event.event_management.entity.Booking;
import com.event.event_management.entity.Event;
import com.event.event_management.repository.BookingRepository;
import com.event.event_management.repository.EventRepository;
import com.event.event_management.repository.UserRepository;
import com.event.event_management.service.EventService;
import com.event.event_management.util.ApiResponse;
@RestController   
@CrossOrigin(origins = "https://smart-event.vercel.app")
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
	private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final EventService eventService;
    public AdminController(UserRepository userRepository,
                           BookingRepository bookingRepository,
                           EventRepository eventRepository,
                           EventService eventService) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.eventRepository = eventRepository;
        this.eventService= eventService;
    }

    @GetMapping("/dashboard")
    public ApiResponse<Object> getDashboard() {

        long totalUsers = userRepository.count();
        long totalBookings = bookingRepository.count();
        long confirmedBookings = bookingRepository.countByStatus("CONFIRMED");
        Double totalRevenue = bookingRepository.getTotalRevenue();

        return new ApiResponse<>(
                true,
                "Dashboard Data",
                Map.of(
                        "totalUsers", totalUsers,
                        "totalBookings", totalBookings,
                        "confirmedBookings", confirmedBookings,
                        "totalRevenue", totalRevenue == null ? 0 : totalRevenue
                )
        );
    }
    
    @GetMapping("/bookings")
    public ApiResponse<Object> getAllBookings() {

        var bookings = bookingRepository.findAll()
                .stream()
                .map(b -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("bookingId", b.getId());
                    map.put("userEmail", b.getUser() != null ? b.getUser().getEmail() : null);
                    map.put("eventTitle", b.getEvent() != null ? b.getEvent().getTitle() : null);
                    map.put("status", b.getStatus());
                    map.put("paymentId", b.getPaymentId());
                    map.put("date", b.getBookingDate());
                    return map;
                })
                .toList();

        return new ApiResponse<>(
                true,
                "All Bookings",
                bookings
        );
    }
    @GetMapping("/events")
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventRepository.findAll());
    }
    @PutMapping("/events/toggle/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleEvent(@PathVariable Long id) {
        eventService.toggleEventStatus(id);
        return ResponseEntity.ok("Event status updated");
    }
}
