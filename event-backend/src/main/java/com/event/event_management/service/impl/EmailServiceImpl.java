package com.event.event_management.service.impl;

import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.event.event_management.service.EmailService;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendTicket(String toEmail,
                           String subject,
                           String body,
                           String qrBase64) {

        try {

            // Create Mime Message
            MimeMessage message = mailSender.createMimeMessage();

            // true = multipart email (for attachment)
            MimeMessageHelper helper =
                    new MimeMessageHelper(message, true, "UTF-8");

            // Set sender
            helper.setFrom(fromEmail);

            // Set receiver
            helper.setTo(toEmail);

            // Set subject
            helper.setSubject(subject);

            // HTML body (no inline base64 image)
            String htmlContent =
                    "<h2>🎫 Event Ticket Confirmation</h2>" +
                    "<p>" + body + "</p>" +
                    "<br/>" +
                    "<p>Your QR ticket is attached below.</p>";

            helper.setText(htmlContent, true);

            // Attach QR as PNG file
            helper.addAttachment(
                    "ticket.png",
                    new ByteArrayResource(
                            Base64.getDecoder().decode(qrBase64)
                    )
            );

            // Send email
            mailSender.send(message);

            System.out.println("✅ Email Sent Successfully");

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(
                    "Email sending failed: " + e.getMessage()
            );
        }
    }
}