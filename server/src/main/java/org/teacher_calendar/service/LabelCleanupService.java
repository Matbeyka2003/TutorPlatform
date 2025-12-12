package org.teacher_calendar.service;

import org.teacher_calendar.entity.Label;
import org.teacher_calendar.repository.LabelRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class LabelCleanupService {

    private static final Logger logger = LoggerFactory.getLogger(LabelCleanupService.class);

    // Список захардкоженных/системных меток, которые нужно удалить
    private static final List<String> SYSTEM_LABEL_NAMES = Arrays.asList(
            "Оплачено", "Не оплачено", "Требуется подготовка",
            "Домашнее задание отправлено", "Пробное занятие"
    );

    @Autowired
    private LabelRepository labelRepository;

    @Bean
    public CommandLineRunner cleanupSystemLabels() {
        return args -> {
            logger.info("=== Проверка на наличие системных меток ===");

            // Находим все системные метки
            List<Label> systemLabels = labelRepository.findAll().stream()
                    .filter(label -> SYSTEM_LABEL_NAMES.contains(label.getName()))
                    .collect(java.util.stream.Collectors.toList());

            if (!systemLabels.isEmpty()) {
                logger.info("Найдено системных меток для удаления: {}", systemLabels.size());

                // Логируем какие метки будут удалены
                systemLabels.forEach(label ->
                        logger.info("Будет удалена системная метка: '{}' (ID: {})",
                                label.getName(), label.getId()));

                // Удаляем системные метки
                labelRepository.deleteAll(systemLabels);
                logger.info("Системные метки удалены");
            } else {
                logger.info("Системные метки не найдены");
            }
        };
    }
}