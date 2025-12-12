package org.teacher_calendar.util;

import org.teacher_calendar.dto.LabelDto;
import org.teacher_calendar.dto.ClientDto;
import org.teacher_calendar.dto.LessonDto;
import org.teacher_calendar.dto.UserDto;
import org.teacher_calendar.entity.Label;
import org.teacher_calendar.entity.Client;
import org.teacher_calendar.entity.Lesson;
import org.teacher_calendar.entity.User;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

public class DtoConverter {

    // User Entity -> DTO
    public static UserDto toDto(User entity) {
        if (entity == null) return null;

        UserDto dto = new UserDto();
        dto.setId(entity.getId());
        dto.setUsername(entity.getUsername());
        dto.setTimezone(entity.getTimezone());
        dto.setTelegramChatId(entity.getTelegramChatId());

        return dto;
    }

    // User DTO -> Entity
    public static User toEntity(UserDto dto) {
        if (dto == null) return null;

        User entity = new User();
        entity.setId(dto.getId());
        entity.setUsername(dto.getUsername());
        entity.setTimezone(dto.getTimezone());
        entity.setTelegramChatId(dto.getTelegramChatId());

        return entity;
    }

    // Client Entity -> DTO
    public static ClientDto toDto(Client entity) {
        if (entity == null) return null;

        ClientDto dto = new ClientDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setPhone(entity.getPhone());
        dto.setTimezone(entity.getTimezone());
        dto.setCity(entity.getCity());
        dto.setDescription(entity.getDescription());
        dto.setLessonPrice(entity.getLessonPrice());

        return dto;
    }

    // Client DTO -> Entity
    public static Client toEntity(ClientDto dto) {
        if (dto == null) return null;

        Client entity = new Client();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setPhone(dto.getPhone());
        entity.setTimezone(dto.getTimezone());
        entity.setCity(dto.getCity());
        entity.setDescription(dto.getDescription());
        entity.setLessonPrice(dto.getLessonPrice());

        return entity;
    }

    // Label Entity -> DTO
    public static LabelDto toDto(Label entity) {
        if (entity == null) return null;

        LabelDto dto = new LabelDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setColor(entity.getColor());
        dto.setEmoji(entity.getEmoji());

        return dto;
    }

    // Label DTO -> Entity
    public static Label toEntity(LabelDto dto) {
        if (dto == null) return null;

        Label entity = new Label();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setColor(dto.getColor());
        entity.setEmoji(dto.getEmoji());

        return entity;
    }

    // Lesson Entity -> DTO
    public static LessonDto toDto(Lesson entity) {
        if (entity == null) return null;

        LessonDto dto = new LessonDto();
        dto.setId(entity.getId());

        // Форматируем даты в строки
        if (entity.getDateTime() != null) {
            dto.setDateTime(DateTimeParser.formatLocalDateTime(entity.getDateTime()));
        }

        if (entity.getEndTime() != null) {
            dto.setEndTime(DateTimeParser.formatLocalDateTime(entity.getEndTime()));
        }

        dto.setDurationMinutes(entity.getDurationMinutes());
        dto.setDescription(entity.getDescription());
        dto.setIsPaid(entity.getIsPaid());
        dto.setRequiresPreparation(entity.getRequiresPreparation());
        dto.setHomeworkSent(entity.getHomeworkSent());
        dto.setIsTrial(entity.getIsTrial());

        if (entity.getTutorTimezone() != null) {
            dto.setTutorTimezone(entity.getTutorTimezone());
        }
        if (entity.getClientTimezone() != null) {
            dto.setClientTimezone(entity.getClientTimezone());
        }

        if (entity.getClient() != null) {
            dto.setClient(toDto(entity.getClient()));
        }

        // Конвертируем метки
        if (entity.getLabels() != null) {
            dto.setLabels(entity.getLabels().stream()
                    .map(DtoConverter::toDto)
                    .collect(Collectors.toList()));

            // Также сохраняем ID меток для удобства
            dto.setLabelIds(entity.getLabels().stream()
                    .map(Label::getId)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    // Lesson DTO -> Entity (базовое преобразование без меток)
    public static Lesson toEntity(LessonDto dto, Client client) {
        if (dto == null) return null;

        Lesson entity = new Lesson();
        entity.setId(dto.getId());

        // Парсим строки в LocalDateTime
        if (dto.getDateTime() != null) {
            entity.setDateTime(DateTimeParser.parseIsoToLocalDateTime(dto.getDateTime()));
        }

        if (dto.getEndTime() != null) {
            entity.setEndTime(DateTimeParser.parseIsoToLocalDateTime(dto.getEndTime()));
        }

        entity.setDurationMinutes(dto.getDurationMinutes());
        entity.setDescription(dto.getDescription());
        entity.setIsPaid(dto.getIsPaid());
        entity.setRequiresPreparation(dto.getRequiresPreparation());
        entity.setHomeworkSent(dto.getHomeworkSent());
        entity.setIsTrial(dto.getIsTrial());
        entity.setClient(client);
        entity.setTutorTimezone(dto.getTutorTimezone());
        entity.setClientTimezone(dto.getClientTimezone());

        // Метки устанавливаются отдельно в сервисе
        return entity;
    }
}