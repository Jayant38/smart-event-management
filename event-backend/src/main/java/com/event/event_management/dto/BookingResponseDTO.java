package com.event.event_management.dto;

import lombok.Data;

@Data
public class BookingResponseDTO {
	private Long bookingId;
    private String eventTitle;
    private String userEmail;
    private String status;
    private String paymentId;
    private String qrCode;
}
