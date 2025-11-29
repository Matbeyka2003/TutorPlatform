package org.teacher_calendar.controller;

import org.teacher_calendar.dto.AuthRequest;
import org.teacher_calendar.dto.UserDto;
import org.teacher_calendar.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:8081")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final UserService userService;
    private final UserContext userContext;

    @Autowired
    public AuthController(UserService userService, UserContext userContext) {
        this.userService = userService;
        this.userContext = userContext;
    }

    // POST /api/auth/login - аутентификация пользователя
    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody AuthRequest authRequest) {
        try {
            logger.info("Login attempt for user: {}", authRequest.getUsername());

            UserDto user = userService.authenticate(authRequest.getUsername(), authRequest.getPassword());

            // Устанавливаем ID пользователя в контекст
            userContext.setCurrentUserId(user.getId());

            logger.info("Login successful for user: {}", authRequest.getUsername());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            logger.error("Login failed for user: {}, error: {}", authRequest.getUsername(), e.getMessage());
            return ResponseEntity.status(401).body(null);
        }
    }

    // POST /api/auth/register - регистрация нового пользователя
    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody AuthRequest authRequest) {
        try {
            logger.info("Registration attempt for user: {}", authRequest.getUsername());

            UserDto userDto = new UserDto();
            userDto.setUsername(authRequest.getUsername());
            userDto.setTimezone("Europe/Moscow");

            UserDto createdUser = userService.createUser(userDto, authRequest.getPassword());

            // Устанавливаем ID пользователя в контекст
            userContext.setCurrentUserId(createdUser.getId());

            logger.info("Registration successful for user: {}", authRequest.getUsername());
            return ResponseEntity.ok(createdUser);
        } catch (RuntimeException e) {
            logger.error("Registration failed for user: {}, error: {}", authRequest.getUsername(), e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }
}