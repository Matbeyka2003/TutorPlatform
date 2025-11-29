package org.teacher_calendar.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lessons")
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private LocalDateTime dateTime;

    @Column(length = 1000)
    private String description;

    @Column(name = "is_paid")
    private Boolean isPaid = false;

    @Column(name = "tutor_timezone")
    private String tutorTimezone;

    @Column(name = "client_timezone")
    private String clientTimezone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Конструкторы
    public Lesson() {}

    public Lesson(LocalDateTime dateTime, Client client, String description, Boolean isPaid) {
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

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Boolean getIsPaid() { return isPaid; }
    public void setIsPaid(Boolean paid) { isPaid = paid; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getTutorTimezone() { return tutorTimezone; }
    public void setTutorTimezone(String tutorTimezone) { this.tutorTimezone = tutorTimezone; }

    public String getClientTimezone() { return clientTimezone; }
    public void setClientTimezone(String clientTimezone) { this.clientTimezone = clientTimezone; }
}