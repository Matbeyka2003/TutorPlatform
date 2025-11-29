package org.teacher_calendar.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public String health() {
        return "Server is running!";
    }

    @GetMapping("/test")
    public String test() {
        return "Test endpoint works!";
    }
}