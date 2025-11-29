package org.teacher_calendar.dto;

import java.time.LocalDateTime;

public class LessonDto {
    private Integer id;
    private LocalDateTime dateTime;
    private ClientDto client;
    private String description;
    private Boolean isPaid = false;

    // Добавляем новые поля для часовых поясов
    private String tutorTimezone;
    private String clientTimezone;

    // Конструкторы
    public LessonDto() {}

    public LessonDto(Integer id, LocalDateTime dateTime, ClientDto client, String description, Boolean isPaid) {
        this.id = id;
        this.dateTime = dateTime;
        this.client = client;
        this.description = description;
        this.isPaid = isPaid;
    }

    // Геттеры и сеттеры
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public LocalDateTime getDateTime() { return dateTime; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }

    public ClientDto getClient() { return client; }
    public void setClient(ClientDto client) { this.client = client; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsPaid() { return isPaid; }
    public void setIsPaid(Boolean paid) { isPaid = paid; }

    // Геттеры и сеттеры для часовых поясов
    public String getTutorTimezone() { return tutorTimezone; }
    public void setTutorTimezone(String tutorTimezone) { this.tutorTimezone = tutorTimezone; }

    public String getClientTimezone() { return clientTimezone; }
    public void setClientTimezone(String clientTimezone) { this.clientTimezone = clientTimezone; }
}