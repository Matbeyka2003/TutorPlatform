package org.teacher_calendar.util;

import org.teacher_calendar.dto.ClientDto;
import org.teacher_calendar.dto.LessonDto;
import org.teacher_calendar.dto.UserDto;
import org.teacher_calendar.entity.Client;
import org.teacher_calendar.entity.Lesson;
import org.teacher_calendar.entity.User;

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

        // User устанавливается отдельно в сервисе
        return entity;
    }

    // Lesson Entity -> DTO
    public static LessonDto toDto(Lesson entity) {
        if (entity == null) return null;

        LessonDto dto = new LessonDto();
        dto.setId(entity.getId());
        dto.setDateTime(entity.getDateTime());
        dto.setDescription(entity.getDescription());
        dto.setIsPaid(entity.getIsPaid());

        if (entity.getTutorTimezone() != null) {
            dto.setTutorTimezone(entity.getTutorTimezone());
        }
        if (entity.getClientTimezone() != null) {
            dto.setClientTimezone(entity.getClientTimezone());
        }

        if (entity.getClient() != null) {
            ClientDto clientDto = new ClientDto();
            clientDto.setId(entity.getClient().getId());
            clientDto.setName(entity.getClient().getName());
            clientDto.setPhone(entity.getClient().getPhone());
            clientDto.setTimezone(entity.getClient().getTimezone());
            dto.setClient(clientDto);
        }

        return dto;
    }

    // Lesson DTO -> Entity
    public static Lesson toEntity(LessonDto dto, Client client) {
        if (dto == null) return null;

        Lesson entity = new Lesson();
        entity.setId(dto.getId());
        entity.setDateTime(dto.getDateTime());
        entity.setDescription(dto.getDescription());
        entity.setIsPaid(dto.getIsPaid());
        entity.setClient(client);

        entity.setTutorTimezone(dto.getTutorTimezone());
        entity.setClientTimezone(dto.getClientTimezone());

        return entity;
    }
}