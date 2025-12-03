package org.teacher_calendar.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class LessonDto {
    private Integer id;
    private LocalDateTime dateTime;
    private ClientDto client;
    private String description;
    private Boolean isPaid = false;
    private Boolean requiresPreparation = false;
    private Boolean homeworkSent = false;
    private Boolean isTrial = false;
    private List<LabelDto> labels = new ArrayList<>();
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

    public Boolean getRequiresPreparation() { return requiresPreparation; }
    public void setRequiresPreparation(Boolean requiresPreparation) { this.requiresPreparation = requiresPreparation; }

    public Boolean getHomeworkSent() { return homeworkSent; }
    public void setHomeworkSent(Boolean homeworkSent) { this.homeworkSent = homeworkSent; }

    public Boolean getIsTrial() { return isTrial; }
    public void setIsTrial(Boolean trial) { isTrial = trial; }

    public List<LabelDto> getLabels() { return labels; }
    public void setLabels(List<LabelDto> labels) { this.labels = labels; }

    public String getTutorTimezone() { return tutorTimezone; }
    public void setTutorTimezone(String tutorTimezone) { this.tutorTimezone = tutorTimezone; }

    public String getClientTimezone() { return clientTimezone; }
    public void setClientTimezone(String clientTimezone) { this.clientTimezone = clientTimezone; }
}