package org.teacher_calendar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingsController {

    @GetMapping
    public ResponseEntity<Map<String, String>> getSettings() {
        Map<String, String> settings = new HashMap<>();
        settings.put("timezone", "Europe/Moscow");
        settings.put("backupRetentionDays", "14");
        settings.put("backupPath", "./backups");
        return ResponseEntity.ok(settings);
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> saveSettings(@RequestBody Map<String, String> settings) {
        // Здесь будет логика сохранения настроек в БД
        return ResponseEntity.ok(settings);
    }
}