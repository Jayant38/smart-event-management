package com.event.event_management.dto;

import lombok.Data;

@Data
public class PaymentVerifyRequest {
	private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}
