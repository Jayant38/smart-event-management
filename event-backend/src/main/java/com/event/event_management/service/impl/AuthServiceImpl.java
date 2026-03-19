package com.event.event_management.service.impl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.event.event_management.security.JwtUtil;
import com.event.event_management.dto.RegisterRequest;
import com.event.event_management.entity.User;
import com.event.event_management.repository.UserRepository;
import com.event.event_management.service.AuthService;
@Service
public class AuthServiceImpl implements AuthService {
	private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Constructor Injection
    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // 🔐 REGISTER
    @Override
    public User register(RegisterRequest request) {

    	 User user = new User();
    	    user.setName(request.getName());
    	    user.setEmail(request.getEmail());
    	    user.setPassword(passwordEncoder.encode(request.getPassword()));
    	    user.setRole("USER");

    	    return userRepository.save(user);
    }

    // 🔑 LOGIN
    @Override
    public String login(String email, String password) {

        // Check email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        // Check password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Generate JWT Token
        return jwtUtil.generateToken(user.getEmail());
    }
    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
