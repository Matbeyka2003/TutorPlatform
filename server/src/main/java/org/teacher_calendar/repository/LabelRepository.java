package org.teacher_calendar.repository;

import org.teacher_calendar.entity.Label;
import org.teacher_calendar.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabelRepository extends JpaRepository<Label, Integer> {
    List<Label> findByUser(User user);
    List<Label> findByUserId(Integer userId);
    boolean existsByNameAndUserId(String name, Integer userId);
}