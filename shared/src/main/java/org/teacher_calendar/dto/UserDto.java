package org.teacher_calendar.dto;

public class UserDto {
    private Integer id;
    private String username;
    private String timezone;
    private String telegramChatId;

    // Конструкторы
    public UserDto() {}

    public UserDto(Integer id, String username, String timezone) {
        this.id = id;
        this.username = username;
        this.timezone = timezone;
    }

    // Геттеры и сеттеры
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public String getTelegramChatId() { return telegramChatId; }
    public void setTelegramChatId(String telegramChatId) { this.telegramChatId = telegramChatId; }
}