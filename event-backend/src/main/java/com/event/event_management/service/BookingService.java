package com.event.event_management.service;

import java.util.List;
import java.util.Map;

import com.event.event_management.dto.BookingResponseDTO;
import com.event.event_management.dto.PaymentVerifyRequest;
import com.event.event_management.entity.Booking;

public interface BookingService {
	Booking createBooking(Long eventId, String userEmail);
	Booking createOrder(Long eventId, String userEmail) throws Exception;

    BookingResponseDTO verifyPayment(PaymentVerifyRequest request) throws Exception;
     
    List<BookingResponseDTO> getBookingsByUser(String email);
    List<Booking> getAllBookings();
    public Booking confirmBooking(Long id);
    public Booking cancelBooking(Long id);
    public List<Map<String, Object>> getMonthlyRevenue();
}
