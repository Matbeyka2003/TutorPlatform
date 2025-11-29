package org.teacher_calendar.service;

import org.teacher_calendar.dto.LessonDto;
import org.teacher_calendar.entity.Client;
import org.teacher_calendar.entity.Lesson;
import org.teacher_calendar.entity.User;
import org.teacher_calendar.repository.ClientRepository;
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

    @Autowired
    public LessonService(LessonRepository lessonRepository, ClientRepository clientRepository, UserRepository userRepository) {
        this.lessonRepository = lessonRepository;
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
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
        if (!lessonRepository.existsById(id)) {
            return null;
        }

        // Найдем клиента
        Client client = clientRepository.findById(lessonDto.getClient().getId())
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + lessonDto.getClient().getId()));

        // Найдем пользователя
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Lesson lesson = DtoConverter.toEntity(lessonDto, client);
        lesson.setId(id);
        lesson.setUser(user);

        Lesson updatedLesson = lessonRepository.save(lesson);
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
}