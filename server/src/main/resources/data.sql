---- Удаляем старые тестовые данные
--DELETE FROM lesson_labels;
--DELETE FROM notifications;
--DELETE FROM lessons;
--DELETE FROM clients;
--DELETE FROM users;

-- Создаем тестового пользователя (пароль: password123)
INSERT INTO users (id, username, password, timezone)
VALUES (1, 'tutor', '4a4f9038-dd55-476f-9764-fb2275d326be', 'Europe/Moscow');

-- Тестовые клиенты ПРИВЯЗАНЫ К ПОЛЬЗОВАТЕЛЮ 1
INSERT INTO clients (id, name, phone, timezone, city, description, lesson_price, user_id)
VALUES
(1, 'Иванов Алексей', '+79161234567', 'Europe/Moscow', 'Москва', 'Ученик 8 класса, подготовка к ОГЭ', 1500.0, 1),
(2, 'Петрова Мария', '+79261234568', 'Europe/Moscow', 'Москва', 'Ученица 10 класса, подготовка к ЕГЭ', 2000.0, 1),
(3, 'Сидоров Дмитрий', '+79361234569', 'Europe/Samara', 'Самара', 'Студент 1 курса, высшая математика', 1800.0, 1);

-- Тестовые занятия ПРИВЯЗАНЫ К ПОЛЬЗОВАТЕЛЮ 1
INSERT INTO lessons (id, date_time, description, is_paid, client_id, user_id, tutor_timezone, client_timezone)
VALUES
(1, '2024-01-20 10:00:00', 'Тригонометрия, решение уравнений', true, 1, 1, 'Europe/Moscow', 'Europe/Moscow'),
(2, '2024-01-20 14:00:00', 'Производные, правила дифференцирования', false, 2, 1, 'Europe/Moscow', 'Europe/Moscow'),
(3, '2024-01-21 11:00:00', 'Интегралы, методы интегрирования', true, 3, 1, 'Europe/Moscow', 'Europe/Samara');

-- Создаем таблицу меток
CREATE TABLE IF NOT EXISTS labels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) NOT NULL,
    emoji VARCHAR(10),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Создаем таблицу связи меток с занятиями
CREATE TABLE IF NOT EXISTS lesson_labels (
    lesson_id INT NOT NULL,
    label_id INT NOT NULL,
    PRIMARY KEY (lesson_id, label_id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE CASCADE
);

-- Добавляем колонки для системных статусов в lessons
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS requires_preparation BOOLEAN DEFAULT FALSE;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS homework_sent BOOLEAN DEFAULT FALSE;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS is_trial BOOLEAN DEFAULT FALSE;

-- Создаем тестовые метки для пользователя 1
INSERT INTO labels (id, name, color, emoji, user_id) VALUES
(1, 'Сложная тема', '#FF6B6B', '🔥', 1),
(2, 'Домашнее задание', '#4ECDC4', '📚', 1),
(3, 'Повторение', '#45B7D1', '🔄', 1),
(4, 'Контрольная работа', '#96CEB4', '📝', 1),
(5, 'Новый материал', '#FFEAA7', '💡', 1);

-- Привязываем метки к существующим занятиям
INSERT INTO lesson_labels (lesson_id, label_id) VALUES
(1, 1), -- Тригонометрия - Сложная тема
(1, 2), -- Тригонометрия - Домашнее задание
(2, 5), -- Производные - Новый материал
(3, 3); -- Интегралы - Повторение