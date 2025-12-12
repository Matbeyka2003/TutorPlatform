package org.teacher_calendar.util;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class DateTimeParser {

    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ISO_DATE_TIME;

    /**
     * Парсит строку ISO в LocalDateTime.
     * Поддерживает форматы:
     * - "2025-12-07T17:30:00" (без зоны)
     * - "2025-12-07T17:30:00.782Z" (с миллисекундами и UTC)
     * - "2025-12-07T17:30:00+03:00" (с часовым поясом)
     */
    public static LocalDateTime parseIsoToLocalDateTime(String isoString) {
        if (isoString == null || isoString.isEmpty()) {
            return null;
        }

        try {
            // Пробуем распарсить как OffsetDateTime (с Z или смещением)
            if (isoString.endsWith("Z") || isoString.contains("+") ||
                    (isoString.contains("-") && isoString.lastIndexOf('-') > 10)) {
                return OffsetDateTime.parse(isoString, ISO_FORMATTER)
                        .toLocalDateTime();
            } else {
                // Пробуем как LocalDateTime
                return LocalDateTime.parse(isoString, ISO_FORMATTER);
            }
        } catch (DateTimeParseException e) {
            // Убираем миллисекунды если они есть
            if (isoString.contains(".")) {
                String withoutMillis = isoString.substring(0, isoString.indexOf('.'));
                return parseIsoToLocalDateTime(withoutMillis);
            }
            throw new IllegalArgumentException("Invalid date format: " + isoString, e);
        }
    }

    /**
     * Форматирует LocalDateTime в строку без зоны
     */
    public static String formatLocalDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }
}