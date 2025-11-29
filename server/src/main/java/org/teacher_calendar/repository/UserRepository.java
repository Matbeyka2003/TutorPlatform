package org.teacher_calendar.repository;

import org.teacher_calendar.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    // Найти пользователя по имени
    Optional<User> findByUsername(String username);

    // Проверить существование пользователя по имени
    boolean existsByUsername(String username);
}