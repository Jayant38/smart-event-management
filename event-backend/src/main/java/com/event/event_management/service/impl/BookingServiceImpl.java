package com.event.event_management.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.event.event_management.dto.PaymentVerifyRequest;
import com.event.event_management.entity.Booking;
import com.event.event_management.entity.Event;
import com.event.event_management.entity.User;
import com.event.event_management.exception.ResourceNotFoundException;
import com.event.event_management.repository.BookingRepository;
import com.event.event_management.repository.EventRepository;
import com.event.event_management.repository.UserRepository;
import com.event.event_management.service.BookingService;
import com.event.event_management.service.EmailService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import jakarta.transaction.Transactional;
import com.event.event_management.util.QRCodeGenerator;
import com.event.event_management.dto.BookingResponseDTO;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final RazorpayClient razorpayClient;
    private final EmailService emailService;
    
    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public BookingServiceImpl(BookingRepository bookingRepository,
            EventRepository eventRepository,
            UserRepository userRepository,
            RazorpayClient razorpayClient,
            EmailService emailService) {

this.bookingRepository = bookingRepository;
this.eventRepository = eventRepository;
this.userRepository = userRepository;
this.razorpayClient = razorpayClient;
this.emailService = emailService;
}

    // 🔥 1️⃣ Simple Booking (Without Payment – Optional)
    @Override
    @Transactional
    public Booking createBooking(Long eventId, String userEmail) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Event not found"));

        if (event.getAvailableSeats() <= 0) {
            throw new RuntimeException("No seats available");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        // Deduct seat immediately
        event.setAvailableSeats(event.getAvailableSeats() - 1);

        Booking booking = new Booking();
        booking.setEvent(event);
        booking.setUser(user);
        booking.setBookingDate(LocalDateTime.now());
        booking.setStatus("PENDING");

        return bookingRepository.save(booking);
    }

    // 🔥 2️⃣ Create Razorpay Order
    @Override
    @Transactional
    public Booking createOrder(Long eventId, String userEmail) throws Exception {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Event not found"));

        if (event.getAvailableSeats() <= 0) {
            throw new RuntimeException("No seats available");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", (int) (event.getPrice() * 100));
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

        Order order = razorpayClient.orders.create(orderRequest);

        Booking booking = new Booking();
        booking.setEvent(event);
        booking.setUser(user);
        booking.setBookingDate(LocalDateTime.now());
        booking.setStatus("CREATED");
        booking.setPaymentId(order.get("id")); // orderId

        return bookingRepository.save(booking);
    }

    // 🔥 3️⃣ Verify Payment & Confirm Booking
   
    @Override
    @Transactional
    public BookingResponseDTO verifyPayment(PaymentVerifyRequest request) throws Exception {

        Booking booking = bookingRepository
                .findByPaymentId(request.getRazorpayOrderId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Booking not found"));

        // 🔐 Prevent double payment verification
        if ("CONFIRMED".equals(booking.getStatus())) {
            throw new RuntimeException("Payment already verified for this booking");
        }

        // 🔐 Uncomment in production
        /*
        boolean isValid = Utils.verifySignature(
                request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId(),
                request.getRazorpaySignature(),
                razorpayKeySecret
        );

        if (!isValid) {
            throw new RuntimeException("Invalid Payment Signature");
        }
        */

        // ✅ Update booking details
        booking.setStatus("CONFIRMED");
        booking.setPaymentId(request.getRazorpayPaymentId());

        Event event = booking.getEvent();

        if (event.getAvailableSeats() <= 0) {
            throw new RuntimeException("No seats available");
        }

        // ✅ Deduct seat
        event.setAvailableSeats(event.getAvailableSeats() - 1);

        // 🔥 Generate QR Code
        String qrText = "Booking ID: " + booking.getId()
                + " | Event: " + event.getTitle()
                + " | User: " + booking.getUser().getEmail();

        String qrCodeBase64 = QRCodeGenerator.generateQRCode(qrText);

        booking.setQrCode(qrCodeBase64);

        // 🔥 Save booking FIRST
        Booking savedBooking = bookingRepository.save(booking);

        // 🔥 Send Email AFTER saving (Safe)
        try {

            String subject = "Event Booking Confirmed 🎉";

            String body = "Hello " + savedBooking.getUser().getName() +
                    ", your booking for " +
                    event.getTitle() +
                    " is confirmed.";

            emailService.sendTicket(
                    //savedBooking.getUser().getEmail(),   // ✅ No hardcoded email
            		"jayantraut63@gmail.com",
                    subject,
                    body,
                    qrCodeBase64
            );

            System.out.println("✅ Email sent successfully");

        } catch (Exception e) {

            // ❗ Email failure should NOT break booking
            System.out.println("❌ Email failed: " + e.getMessage());
            e.printStackTrace();
        }

        return convertToDTO(savedBooking);
    }
    
    private BookingResponseDTO convertToDTO(Booking booking) {

        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setBookingId(booking.getId());
        dto.setEventTitle(booking.getEvent().getTitle());
        dto.setUserEmail(booking.getUser().getEmail());
        dto.setStatus(booking.getStatus());
        dto.setPaymentId(booking.getPaymentId());
        dto.setQrCode(booking.getQrCode());

        return dto;
    }
    
    
    @Override
    public List<BookingResponseDTO> getBookingsByUser(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return bookingRepository.findByUser(user)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }
    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByBookingDateDesc();
    }
    @Override
    public Booking confirmBooking(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("CONFIRMED");

        return bookingRepository.save(booking);
    }
    @Override
    public Booking cancelBooking(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("CANCELLED");

        return bookingRepository.save(booking);
    }
    @Override
    public List<Map<String, Object>> getMonthlyRevenue() {

        List<Object[]> results = bookingRepository.getMonthlyRevenue();

        List<Map<String, Object>> data = new ArrayList<>();

        for (Object[] row : results) {

            Map<String, Object> map = new HashMap<>();

            map.put("month", row[0]);
            map.put("revenue", row[1]);

            data.add(map);
        }

        return data;
    }
}
