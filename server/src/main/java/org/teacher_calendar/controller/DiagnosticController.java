package org.teacher_calendar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/diagnostic")
public class DiagnosticController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/tables")
    public List<Map<String, Object>> listTables() {
        return jdbcTemplate.queryForList(
                "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'PUBLIC'"
        );
    }

    @GetMapping("/users")
    public List<Map<String, Object>> listUsers() {
        return jdbcTemplate.queryForList("SELECT * FROM users");
    }

    @GetMapping("/controllers")
    public String listControllers() {
        return "Available controllers:\n" +
                "- AuthController: /api/auth/login, /api/auth/register\n" +
                "- ClientController: /api/clients\n" +
                "- LessonController: /api/lessons\n" +
                "- HealthController: /api/health\n" +
                "- DiagnosticController: /api/diagnostic/*";
    }
}