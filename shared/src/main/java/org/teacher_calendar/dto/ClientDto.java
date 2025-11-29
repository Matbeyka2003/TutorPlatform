package org.teacher_calendar.dto;

import java.util.ArrayList;
import java.util.List;

public class ClientDto {
    private Integer id;
    private String name;
    private String phone;
    private String timezone;
    private String city;
    private String description;
    private Double lessonPrice;
    private List<LessonDto> lessons = new ArrayList<>();

    // Конструкторы
    public ClientDto() {}

    public ClientDto(Integer id, String name, String phone, String timezone) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.timezone = timezone;
    }

    // Геттеры и сеттеры
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getLessonPrice() { return lessonPrice; }
    public void setLessonPrice(Double lessonPrice) { this.lessonPrice = lessonPrice; }

    public List<LessonDto> getLessons() { return lessons; }
    public void setLessons(List<LessonDto> lessons) { this.lessons = lessons; }
}