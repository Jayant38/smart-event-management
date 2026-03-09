package com.event.event_management.service;

public interface EmailService {
	 void sendTicket(String toEmail, String subject, String body, String qrBase64);
}
