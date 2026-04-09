package com.loan.controller;

import com.loan.dto.*;
import com.loan.entity.User;
import com.loan.repository.UserRepository;
import com.loan.security.JwtUtils;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authManager, UserRepository userRepository,
                          PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.authManager = authManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest req) {
        if (userRepository.existsByUsername(req.getUsername()))
            return ResponseEntity.badRequest().body(Map.of("message", "Username already taken"));
        if (userRepository.existsByEmail(req.getEmail()))
            return ResponseEntity.badRequest().body(Map.of("message", "Email already registered"));

        String roleStr = req.getRole() == null ? "borrower" : req.getRole().toLowerCase();
        String role = switch (roleStr) {
            case "lender"   -> "ROLE_LENDER";
            case "analyst"  -> "ROLE_ANALYST";
            case "admin"    -> "ROLE_ADMIN";
            default         -> "ROLE_BORROWER";
        };

        User user = new User(req.getUsername(), req.getEmail(), encoder.encode(req.getPassword()), role);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody LoginRequest req) {
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));

            User user = userRepository.findByUsername(req.getUsername()).orElseThrow();
            String token = jwtUtils.generateToken(user.getUsername());
            return ResponseEntity.ok(new AuthResponse(token, user.getRole(), user.getUsername(), user.getEmail()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }
    }
}
