// Утилиты для работы с временными зонами
export const formatTimeForTimezone = (date: Date, timezone: string): string => {
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    console.error('Error formatting time:', error);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }
};

export const convertTimezone = (
  date: Date,
  fromTimezone: string,
  toTimezone: string
): Date => {
  try {
    const fromTime = new Date(
      date.toLocaleString('en-US', { timeZone: fromTimezone })
    );
    const toTime = new Date(
      fromTime.toLocaleString('en-US', { timeZone: toTimezone })
    );

    // Сохраняем оригинальное время, корректируем только часовой пояс
    const result = new Date(date);
    const diff = toTime.getTime() - fromTime.getTime();
    result.setTime(result.getTime() + diff);

    return result;
  } catch (error) {
    console.error('Error converting timezone:', error);
    return date;
  }
};