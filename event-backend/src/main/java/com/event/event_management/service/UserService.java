package com.event.event_management.service;



import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.event.event_management.entity.User;

public interface UserService {
	public User getCurrentUser(Authentication authentication);
}
