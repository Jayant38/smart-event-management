package com.event.event_management.controller;

import java.util.List;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import com.event.event_management.dto.PaymentVerifyRequest;
import com.event.event_management.entity.Booking;
import com.event.event_management.service.BookingService;
import com.event.event_management.service.EmailService;
import com.event.event_management.util.ApiResponse;
import com.event.event_management.dto.BookingResponseDTO;
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;
    private final EmailService emailService;

    public BookingController(BookingService bookingService,EmailService emailService) {
        this.bookingService = bookingService;
        this.emailService = emailService;
    }

    // 🔥 Change this
    @PostMapping("/create/{eventId}")
    public Booking createBooking(@PathVariable Long eventId,
                                 Authentication authentication) {

        String email = authentication.getName();
        return bookingService.createBooking(eventId, email);
    }

    @PostMapping("/create-order/{eventId}")
    public Booking createOrder(@PathVariable Long eventId,
                               Authentication authentication) throws Exception {

        String email = authentication.getName();
        return bookingService.createOrder(eventId, email);
    }

    @PostMapping("/verify")
    public ApiResponse<BookingResponseDTO> verifyPayment(
            @RequestBody PaymentVerifyRequest request)
            throws Exception {

        BookingResponseDTO response =
                bookingService.verifyPayment(request);

        return new ApiResponse<>(
                true,
                "Booking confirmed successfully",
                response
        );
    }
    @GetMapping("/test-email")
    public String testEmail() {
        emailService.sendTicket(
            "your_email@gmail.com",
            "Test Email",
            "This is a test email",
            ""
        );
        return "Email Sent";
    }
    
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ApiResponse<Object> getMyBookings(Authentication authentication) {

        String email = authentication.getName();

        var bookings = bookingService.getBookingsByUser(email);

        return new ApiResponse<>(
                true,
                "User bookings fetched successfully",
                bookings
        );
    }
    @PutMapping("/{id}/confirm")
    public Booking confirmBooking(@PathVariable Long id) {
        return bookingService.confirmBooking(id);
    }

    @PutMapping("/{id}/cancel")
    public Booking cancelBooking(@PathVariable Long id) {
        return bookingService.cancelBooking(id);
    }
    @GetMapping("/admin/revenue/monthly")
    public List<Map<String, Object>> getMonthlyRevenue() {
        return bookingService.getMonthlyRevenue();
    }
}