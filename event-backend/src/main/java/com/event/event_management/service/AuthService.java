package com.event.event_management.service;

import com.event.event_management.dto.RegisterRequest;
import com.event.event_management.entity.User;

public interface AuthService {
	User register(RegisterRequest request);
	String login(String email, String password);
	User findByEmail(String email);

}
