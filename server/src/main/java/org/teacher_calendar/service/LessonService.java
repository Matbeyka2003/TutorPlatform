package org.teacher_calendar.service;

import org.teacher_calendar.dto.LessonDto;
import org.teacher_calendar.entity.Client;
import org.teacher_calendar.entity.Label;
import org.teacher_calendar.entity.Lesson;
import org.teacher_calendar.entity.User;
import org.teacher_calendar.repository.ClientRepository;
import org.teacher_calendar.repository.LabelRepository;
import org.teacher_calendar.repository.LessonRepository;
import org.teacher_calendar.repository.UserRepository;
import org.teacher_calendar.util.DtoConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LessonService {

    private final LessonRepository lessonRepository;
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final LabelRepository labelRepository;

    @Autowired
    public LessonService(
            LessonRepository lessonRepository,
            ClientRepository clientRepository,
            UserRepository userRepository,
            LabelRepository labelRepository) {
        this.lessonRepository = lessonRepository;
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
        this.labelRepository = labelRepository;
    }

    // Получить все уроки для текущего пользователя
    public List<LessonDto> getAllLessons(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return lessonRepository.findByUser(user)
                .stream()
                .map(DtoConverter::toDto)
                .collect(Collectors.toList());
    }

    // Получить уроки по неделе для текущего пользователя
    public List<LessonDto> getLessonsForWeek(LocalDate weekStart, Integer userId) {
        LocalDateTime startOfWeek = weekStart.atStartOfDay();
        LocalDateTime endOfWeek = weekStart.plusDays(6).atTime(LocalTime.MAX);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return lessonRepository.findLessonsForWeek(startOfWeek, endOfWeek, user)
                .stream()
                .map(DtoConverter::toDto)
                .collect(Collectors.toList());
    }

    // Создать новый урок с метками
    public LessonDto createLesson(LessonDto lessonDto, Integer userId) {
        // Найдем клиента
        Client client = clientRepository.findById(lessonDto.getClient().getId())
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + lessonDto.getClient().getId()));

        // Найдем пользователя
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Lesson lesson = DtoConverter.toEntity(lessonDto, client);
        lesson.setUser(user);

        // Устанавливаем часовые пояса
        if (lesson.getTutorTimezone() == null) {
            lesson.setTutorTimezone(user.getTimezone());
        }
        if (lesson.getClientTimezone() == null) {
            lesson.setClientTimezone(client.getTimezone());
        }

        // Проверяем и устанавливаем endTime если не указан
        if (lesson.getEndTime() == null && lesson.getDateTime() != null && lesson.getDurationMinutes() != null) {
            LocalDateTime endTime = lesson.getDateTime().plusMinutes(lesson.getDurationMinutes());
            lesson.setEndTime(endTime);
        }

        // Добавляем метки, если есть
        if (lessonDto.getLabelIds() != null && !lessonDto.getLabelIds().isEmpty()) {
            List<Label> labels = labelRepository.findAllById(lessonDto.getLabelIds());

            // Проверяем, что метки принадлежат пользователю
            List<Label> userLabels = labels.stream()
                    .filter(label -> label.getUser().getId().equals(userId))
                    .collect(Collectors.toList());

            lesson.setLabels(new ArrayList<>(userLabels));
        }

        Lesson savedLesson = lessonRepository.save(lesson);
        return DtoConverter.toDto(savedLesson);
    }

    // Обновить урок с метками
    public LessonDto updateLesson(Integer id, LessonDto lessonDto, Integer userId) {
        Lesson existingLesson = lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));

        Client client = clientRepository.findById(lessonDto.getClient().getId())
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + lessonDto.getClient().getId()));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Обновляем основные поля через DtoConverter
        Lesson updatedFields = DtoConverter.toEntity(lessonDto, client);

        existingLesson.setClient(client);
        existingLesson.setDateTime(updatedFields.getDateTime());
        existingLesson.setEndTime(updatedFields.getEndTime());
        existingLesson.setDurationMinutes(updatedFields.getDurationMinutes());
        existingLesson.setDescription(updatedFields.getDescription());
        existingLesson.setIsPaid(updatedFields.getIsPaid());
        existingLesson.setRequiresPreparation(updatedFields.getRequiresPreparation());
        existingLesson.setHomeworkSent(updatedFields.getHomeworkSent());
        existingLesson.setIsTrial(updatedFields.getIsTrial());
        existingLesson.setTutorTimezone(updatedFields.getTutorTimezone());
        existingLesson.setClientTimezone(updatedFields.getClientTimezone());
        existingLesson.setUser(user);

        // Обновляем метки
        if (lessonDto.getLabelIds() != null) {
            List<Label> labels = labelRepository.findAllById(lessonDto.getLabelIds());

            // Проверяем, что метки принадлежат пользователю
            List<Label> userLabels = labels.stream()
                    .filter(label -> label.getUser().getId().equals(userId))
                    .collect(Collectors.toList());

            existingLesson.setLabels(new ArrayList<>(userLabels));
        } else {
            existingLesson.setLabels(new ArrayList<>());
        }

        Lesson updatedLesson = lessonRepository.save(existingLesson);
        return DtoConverter.toDto(updatedLesson);
    }

    // Удалить урок
    public boolean deleteLesson(Integer id) {
        if (!lessonRepository.existsById(id)) {
            return false;
        }

        lessonRepository.deleteById(id);
        return true;
    }

    // Получить уроки по клиенту
    public List<LessonDto> getLessonsByClient(Integer clientId) {
        return lessonRepository.findByClientId(clientId)
                .stream()
                .map(DtoConverter::toDto)
                .collect(Collectors.toList());
    }

    // Добавить метку к уроку (индивидуально)
    public LessonDto addLabelToLesson(Integer lessonId, Integer labelId, Integer userId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new RuntimeException("Label not found"));

        // Проверяем, что метка принадлежит пользователю
        if (!label.getUser().getId().equals(userId)) {
            throw new RuntimeException("Label does not belong to user");
        }

        if (!lesson.getLabels().contains(label)) {
            lesson.getLabels().add(label);
            lessonRepository.save(lesson);
        }

        return DtoConverter.toDto(lesson);
    }

    // Удалить метку из урока
    public LessonDto removeLabelFromLesson(Integer lessonId, Integer labelId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new RuntimeException("Label not found"));

        lesson.getLabels().remove(label);
        lessonRepository.save(lesson);

        return DtoConverter.toDto(lesson);
    }

    // Получить уроки по метке
    public List<LessonDto> getLessonsByLabel(Integer labelId, Integer userId) {
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new RuntimeException("Label not found"));

        // Проверяем, что метка принадлежит пользователю
        if (!label.getUser().getId().equals(userId)) {
            throw new RuntimeException("Label does not belong to user");
        }

        return label.getLessons().stream()
                .map(DtoConverter::toDto)
                .collect(Collectors.toList());
    }
}