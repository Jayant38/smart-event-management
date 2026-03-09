package com.event.event_management.service.impl;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.event.event_management.entity.User;
import com.event.event_management.repository.UserRepository;
import com.event.event_management.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User getCurrentUser(Authentication authentication) {

        String email = authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}