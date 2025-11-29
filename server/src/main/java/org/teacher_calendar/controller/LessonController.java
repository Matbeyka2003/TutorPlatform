package org.teacher_calendar.controller;

import org.teacher_calendar.dto.LessonDto;
import org.teacher_calendar.service.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@CrossOrigin(origins = "*")
public class LessonController {

    private final LessonService lessonService;
    private final UserContext userContext;

    @Autowired
    public LessonController(LessonService lessonService, UserContext userContext) {
        this.lessonService = lessonService;
        this.userContext = userContext;
    }

    @GetMapping
    public ResponseEntity<List<LessonDto>> getAllLessons() {
        List<LessonDto> lessons = lessonService.getAllLessons(userContext.getCurrentUserId());
        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/week")
    public ResponseEntity<List<LessonDto>> getLessonsForWeek(
            @RequestParam("weekStart") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart) {
        List<LessonDto> lessons = lessonService.getLessonsForWeek(weekStart, userContext.getCurrentUserId());
        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<LessonDto>> getLessonsByClient(@PathVariable("clientId") Integer clientId) {
        List<LessonDto> lessons = lessonService.getLessonsByClient(clientId);
        return ResponseEntity.ok(lessons);
    }

    @PostMapping
    public ResponseEntity<LessonDto> createLesson(@RequestBody LessonDto lessonDto) {
        LessonDto createdLesson = lessonService.createLesson(lessonDto, userContext.getCurrentUserId());
        return ResponseEntity.ok(createdLesson);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LessonDto> updateLesson(@PathVariable("id") Integer id, @RequestBody LessonDto lessonDto) {
        LessonDto updatedLesson = lessonService.updateLesson(id, lessonDto, userContext.getCurrentUserId());
        if (updatedLesson != null) {
            return ResponseEntity.ok(updatedLesson);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLesson(@PathVariable("id") Integer id) {
        boolean deleted = lessonService.deleteLesson(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}