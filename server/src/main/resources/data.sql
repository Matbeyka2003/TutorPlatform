-- Создаем тестового пользователя (пароль: password123)
-- Используем правильный BCrypt хеш
MERGE INTO users (id, username, password, timezone) KEY(id)
VALUES (1, 'tutor', '$2a$10$SUdnDhpygevOIwMPcZ7ATuilOb92DU39GVjHNGWy4MNJqmBLPRrvq', 'Europe/Moscow');

-- Тестовые клиенты
MERGE INTO clients (id, name, phone, timezone, city, description, lesson_price, user_id) KEY(id)
VALUES
(1, 'Иванов Алексей', '+79161234567', 'Europe/Moscow', 'Москва', 'Ученик 8 класса, подготовка к ОГЭ', 1500.0, 1),
(2, 'Петрова Мария', '+79261234568', 'Europe/Moscow', 'Москва', 'Ученица 10 класса, подготовка к ЕГЭ', 2000.0, 1),
(3, 'Сидоров Дмитрий', '+79361234569', 'Europe/Samara', 'Самара', 'Студент 1 курса, высшая математика', 1800.0, 1);

-- Тестовые занятия
MERGE INTO lessons (id, date_time, description, is_paid, client_id, user_id, tutor_timezone, client_timezone) KEY(id)
VALUES
(1, '2024-01-20 10:00:00', 'Тригонометрия, решение уравнений', true, 1, 1, 'Europe/Moscow', 'Europe/Moscow'),
(2, '2024-01-20 14:00:00', 'Производные, правила дифференцирования', false, 2, 1, 'Europe/Moscow', 'Europe/Moscow'),
(3, '2024-01-21 11:00:00', 'Интегралы, методы интегрирования', true, 3, 1, 'Europe/Moscow', 'Europe/Samara');