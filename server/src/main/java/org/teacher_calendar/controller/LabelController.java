package org.teacher_calendar.controller;

import org.teacher_calendar.dto.LabelDto;
import org.teacher_calendar.service.LabelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/labels")
@CrossOrigin(origins = "*")
public class LabelController {

    private final LabelService labelService;
    private final UserContext userContext;

    @Autowired
    public LabelController(LabelService labelService, UserContext userContext) {
        this.labelService = labelService;
        this.userContext = userContext;
    }

    @GetMapping
    public ResponseEntity<List<LabelDto>> getAllLabels() {
        List<LabelDto> labels = labelService.getAllLabels(userContext.getCurrentUserId());
        return ResponseEntity.ok(labels);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LabelDto> getLabelById(@PathVariable("id") Integer id) {
        LabelDto label = labelService.getLabelById(id);
        if (label != null) {
            return ResponseEntity.ok(label);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<LabelDto> createLabel(@RequestBody LabelDto labelDto) {
        LabelDto createdLabel = labelService.createLabel(labelDto, userContext.getCurrentUserId());
        return ResponseEntity.ok(createdLabel);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LabelDto> updateLabel(@PathVariable("id") Integer id, @RequestBody LabelDto labelDto) {
        LabelDto updatedLabel = labelService.updateLabel(id, labelDto);
        if (updatedLabel != null) {
            return ResponseEntity.ok(updatedLabel);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLabel(@PathVariable("id") Integer id) {
        boolean deleted = labelService.deleteLabel(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}