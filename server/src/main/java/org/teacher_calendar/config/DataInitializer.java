package org.teacher_calendar.config;

import org.teacher_calendar.entity.*;
import org.teacher_calendar.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;  // Добавьте этот импорт
import java.util.Collections;  // И этот тоже

@Configuration
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    @Autowired
    public CommandLineRunner initData(
            UserRepository userRepository,
            ClientRepository clientRepository,
            LessonRepository lessonRepository,
            LabelRepository labelRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            logger.info("=== Начало инициализации тестовых данных ===");

            // 1. Создаем пользователя "tutor" если его нет
            if (!userRepository.existsByUsername("tutor")) {
                logger.info("Создаем пользователя 'tutor'...");

                User tutor = new User();
                tutor.setUsername("tutor");
                tutor.setPassword(passwordEncoder.encode("password123"));
                tutor.setTimezone("Europe/Moscow");

                User savedTutor = userRepository.save(tutor);
                logger.info("Пользователь 'tutor' создан с ID: {}", savedTutor.getId());
            } else {
                logger.info("Пользователь 'tutor' уже существует");
            }

            // 2. Получаем пользователя
            User tutor = userRepository.findByUsername("tutor")
                    .orElseThrow(() -> new RuntimeException("Пользователь 'tutor' не найден"));

            // 3. Создаем тестовых клиентов
            if (clientRepository.count() == 0) {
                logger.info("Создаем тестовых клиентов...");

                Client client1 = new Client();
                client1.setName("Иванов Алексей");
                client1.setPhone("+79161234567");
                client1.setTimezone("Europe/Moscow");
                client1.setCity("Москва");
                client1.setDescription("Ученик 8 класса, подготовка к ОГЭ");
                client1.setLessonPrice(1500.0);
                client1.setUser(tutor);
                clientRepository.save(client1);

                Client client2 = new Client();
                client2.setName("Петрова Мария");
                client2.setPhone("+79261234568");
                client2.setTimezone("Europe/Moscow");
                client2.setCity("Москва");
                client2.setDescription("Ученица 10 класса, подготовка к ЕГЭ");
                client2.setLessonPrice(2000.0);
                client2.setUser(tutor);
                clientRepository.save(client2);

                Client client3 = new Client();
                client3.setName("Сидоров Дмитрий");
                client3.setPhone("+79361234569");
                client3.setTimezone("Europe/Samara");
                client3.setCity("Самара");
                client3.setDescription("Студент 1 курса, высшая математика");
                client3.setLessonPrice(1800.0);
                client3.setUser(tutor);
                clientRepository.save(client3);

                logger.info("Создано 3 тестовых клиента");
            }

            // 4. Создаем ТОЛЬКО пользовательские метки (никаких системных!)
            if (labelRepository.count() == 0) {
                logger.info("Создаем пользовательские метки-эмодзи...");

                // Примеры пользовательских меток-эмодзи
                Label label1 = new Label();
                label1.setName("Сложная тема");
                label1.setColor("#FF6B6B");
                label1.setEmoji("🔥");
                label1.setUser(tutor);
                labelRepository.save(label1);

                Label label2 = new Label();
                label2.setName("Нужна проверка");
                label2.setColor("#4ECDC4");
                label2.setEmoji("📝");
                label2.setUser(tutor);
                labelRepository.save(label2);

                Label label3 = new Label();
                label3.setName("Важное");
                label3.setColor("#FFD93D");
                label3.setEmoji("⭐");
                label3.setUser(tutor);
                labelRepository.save(label3);

                Label label4 = new Label();
                label4.setName("Повторение");
                label4.setColor("#6BCF7F");
                label4.setEmoji("🔄");
                label4.setUser(tutor);
                labelRepository.save(label4);

                logger.info("Создано 4 пользовательские метки-эмодзи");
            }

            // 5. Создаем занятия с пользовательскими метками
            if (lessonRepository.count() == 0) {
                logger.info("Создаем тестовые занятия с пользовательскими метками...");

                // Получаем клиента
                Client client1 = clientRepository.findAll().stream()
                        .filter(c -> c.getName().equals("Иванов Алексей"))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Клиент не найден"));

                // Получаем метки
                List<Label> allLabels = labelRepository.findByUser(tutor);

                if (!allLabels.isEmpty()) {
                    Lesson lesson1 = new Lesson();
                    lesson1.setDateTime(LocalDateTime.now().plusDays(1).withHour(10).withMinute(0));
                    lesson1.setEndTime(LocalDateTime.now().plusDays(1).withHour(11).withMinute(0)); // Добавить
                    lesson1.setDurationMinutes(60);
                    lesson1.setClient(client1);
                    lesson1.setDescription("Тригонометрия, решение уравнений");
                    lesson1.setIsPaid(true); // Это просто флаг, не метка!
                    lesson1.setTutorTimezone("Europe/Moscow");
                    lesson1.setClientTimezone("Europe/Moscow");
                    lesson1.setUser(tutor);

                    // Добавляем первую метку к занятию
                    if (!allLabels.isEmpty()) {
                        lesson1.setLabels(Collections.singletonList(allLabels.get(0)));
                    }

                    lessonRepository.save(lesson1);

                    logger.info("Создано тестовое занятие с пользовательской меткой");
                }
            }

            logger.info("=== Инициализация тестовых данных завершена ===");

            // Статистика
            logger.info("Статистика базы данных:");
            logger.info("- Пользователей: {}", userRepository.count());
            logger.info("- Клиентов: {}", clientRepository.count());
            logger.info("- Занятий: {}", lessonRepository.count());
            logger.info("- Пользовательских меток: {}", labelRepository.count());
        };
    }
}