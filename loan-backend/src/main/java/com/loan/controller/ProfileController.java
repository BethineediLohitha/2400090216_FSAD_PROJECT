package com.loan.controller;

import com.loan.entity.User;
import com.loan.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    public ProfileController(UserRepository userRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    @GetMapping
    public ResponseEntity<?> getProfile(Authentication auth) {
        User user = userRepo.findByUsername(auth.getName()).orElseThrow();
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole()
        ));
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> body, Authentication auth) {
        User user = userRepo.findByUsername(auth.getName()).orElseThrow();
        if (body.containsKey("email")) user.setEmail(body.get("email"));
        userRepo.save(user);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body, Authentication auth) {
        User user = userRepo.findByUsername(auth.getName()).orElseThrow();
        String oldPwd = body.get("oldPassword");
        String newPwd = body.get("newPassword");

        if (!encoder.matches(oldPwd, user.getPassword()))
            return ResponseEntity.badRequest().body(Map.of("message", "Current password is incorrect"));
        if (newPwd == null || newPwd.length() < 6)
            return ResponseEntity.badRequest().body(Map.of("message", "New password must be at least 6 characters"));

        user.setPassword(encoder.encode(newPwd));
        userRepo.save(user);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}
