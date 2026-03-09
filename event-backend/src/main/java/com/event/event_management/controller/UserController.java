package com.event.event_management.controller;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.event.event_management.entity.User;
import com.event.event_management.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
	 private final UserService userService;

	    public UserController(UserService userService) {
	        this.userService = userService;
	    }

	    // ⭐ GET CURRENT USER PROFILE

	    @GetMapping("/me")
	    public User getCurrentUser(Authentication authentication) {

	        return userService.getCurrentUser(authentication);

	    }
}
