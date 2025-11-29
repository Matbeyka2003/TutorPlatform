package org.teacher_calendar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TutorPlatformApplication {
    public static void main(String[] args) {
        SpringApplication.run(TutorPlatformApplication.class, args);
        System.out.println("=== Tutor Platform Application Started ===");
        System.out.println("H2 Console: http://localhost:8080/h2-console");
        System.out.println("JDBC URL: jdbc:h2:mem:tutordb");
    }
}