package org.teacher_calendar.controller;

import org.teacher_calendar.entity.User;
import org.teacher_calendar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:8081")
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Server is running!");
    }


    @GetMapping("/check-password")
    public ResponseEntity<String> checkPassword() {
        User user = userRepository.findByUsername("tutor").orElse(null);
        if (user == null) {
            return ResponseEntity.ok("User 'tutor' not found");
        }

        return ResponseEntity.ok("User found: " + user.getUsername() + ", password hash: " + user.getPassword());
    }
}