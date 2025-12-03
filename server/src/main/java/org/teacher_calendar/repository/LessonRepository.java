package org.teacher_calendar.repository;

import org.teacher_calendar.entity.Lesson;
import org.teacher_calendar.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Integer> {

    // Найти уроки по клиенту
    List<Lesson> findByClientId(Integer clientId);

    // Найти уроки в определенном временном диапазоне
    List<Lesson> findByDateTimeBetween(LocalDateTime start, LocalDateTime end);

    // Найти неоплаченные уроки
    List<Lesson> findByIsPaidFalse();

    // Найти уроки пользователя
    List<Lesson> findByUser(User user);

    // Кастомный запрос для поиска уроков по неделе для конкретного пользователя
    @Query("SELECT l FROM Lesson l WHERE l.user = :user AND l.dateTime BETWEEN :startOfWeek AND :endOfWeek ORDER BY l.dateTime")
    List<Lesson> findLessonsForWeek(@Param("startOfWeek") LocalDateTime startOfWeek,
                                    @Param("endOfWeek") LocalDateTime endOfWeek,
                                    @Param("user") User user);
}

