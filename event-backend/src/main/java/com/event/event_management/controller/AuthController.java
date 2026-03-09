package com.event.event_management.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.event.event_management.dto.LoginRequest;
import com.event.event_management.dto.RegisterRequest;
import com.event.event_management.entity.User;
import com.event.event_management.service.AuthService;
import com.event.event_management.util.ApiResponse;

import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
	private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {
    	
        return authService.register(request);
    }
    @PostMapping("/login")
    public ApiResponse<Object> login(@RequestBody LoginRequest request) {

        String token = authService.login(
                request.getEmail(),
                request.getPassword()
        );

        User user = authService.findByEmail(request.getEmail());

        return new ApiResponse<>(
                true,
                "Login successful",
                java.util.Map.of(
                        "token", token,
                        "role", user.getRole()   // ✅ FIXED
                )
        );
    }
}
