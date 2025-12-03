package org.teacher_calendar.service;

import org.teacher_calendar.dto.LessonDto;
import org.teacher_calendar.entity.Client;
import org.teacher_calendar.entity.Label;
import org.teacher_calendar.entity.Lesson;
import org.teacher_calendar.entity.User;
import org.teacher_calendar.repository.ClientRepository;
import org.teacher_calendar.repository.LabelRepository; // Добавьте этот импорт
import org.teacher_calendar.repository.LessonRepository;
import org.teacher_calendar.repository.UserRepository;
import org.teacher_calendar.util.DtoConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LessonService {

    private final LessonRepository lessonRepository;
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final LabelRepository labelRepository; // Измените тип

    @Autowired
    public LessonService(
            LessonRepository lessonRepository,
            ClientRepository clientRepository,
            UserRepository userRepository,
            LabelRepository labelRepository) { // Измените параметр
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

    // Создать новый урок
    public LessonDto createLesson(LessonDto lessonDto, Integer userId) {
        // Найдем клиента
        Client client = clientRepository.findById(lessonDto.getClient().getId())
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + lessonDto.getClient().getId()));

        // Найдем пользователя
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Lesson lesson = DtoConverter.toEntity(lessonDto, client);
        lesson.setUser(user); // Устанавливаем пользователя

        // Если часовые пояса не установлены, устанавливаем по умолчанию
        if (lesson.getTutorTimezone() == null) {
            lesson.setTutorTimezone(user.getTimezone());
        }
        if (lesson.getClientTimezone() == null) {
            lesson.setClientTimezone(client.getTimezone());
        }

        Lesson savedLesson = lessonRepository.save(lesson);
        return DtoConverter.toDto(savedLesson);
    }

    // Обновить урок
    public LessonDto updateLesson(Integer id, LessonDto lessonDto, Integer userId) {
        // Находим существующий урок
        Lesson existingLesson = lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));

        // Найдем клиента
        Client client = clientRepository.findById(lessonDto.getClient().getId())
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + lessonDto.getClient().getId()));

        // Найдем пользователя
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Обновляем только необходимые поля, сохраняя метки
        existingLesson.setClient(client);
        existingLesson.setDateTime(lessonDto.getDateTime());
        existingLesson.setDescription(lessonDto.getDescription());
        existingLesson.setIsPaid(lessonDto.getIsPaid());
        existingLesson.setRequiresPreparation(lessonDto.getRequiresPreparation());
        existingLesson.setHomeworkSent(lessonDto.getHomeworkSent());
        existingLesson.setIsTrial(lessonDto.getIsTrial());
        existingLesson.setTutorTimezone(lessonDto.getTutorTimezone());
        existingLesson.setClientTimezone(lessonDto.getClientTimezone());
        existingLesson.setUser(user);

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

    public LessonDto removeLabelFromLesson(Integer lessonId, Integer labelId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new RuntimeException("Label not found"));

        lesson.getLabels().remove(label);
        lessonRepository.save(lesson);

        return DtoConverter.toDto(lesson);
    }
}