package org.teacher_calendar.repository;

import org.teacher_calendar.entity.Client;
import org.teacher_calendar.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Integer> {

    // Spring Data JPA автоматически реализует этот метод
    List<Client> findByNameContainingIgnoreCase(String name);

    // Найдем клиентов по городу
    List<Client> findByCity(String city);

    // Найдем клиентов пользователя
    List<Client> findByUser(User user);
}