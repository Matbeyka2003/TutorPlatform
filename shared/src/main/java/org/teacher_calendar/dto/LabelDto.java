package org.teacher_calendar.dto;

public class LabelDto {
    private Integer id;
    private String name;
    private String color;
    private String emoji;

    // Конструкторы
    public LabelDto() {}

    public LabelDto(Integer id, String name, String color, String emoji) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.emoji = emoji;
    }

    // Геттеры и сеттеры
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getEmoji() { return emoji; }
    public void setEmoji(String emoji) { this.emoji = emoji; }
}