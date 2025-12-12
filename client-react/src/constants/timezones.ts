// Единый список часовых поясов для всего приложения
export const TIMEZONES = [
  { value: 'UTC', label: 'UTC (0)' },
  { value: 'Europe/London', label: 'Лондон (0)' },
  { value: 'Europe/Berlin', label: 'Берлин (+1)' },
  { value: 'Europe/Paris', label: 'Париж (+1)' },
  { value: 'Europe/Moscow', label: 'Москва (+3)' },
  { value: 'Europe/Samara', label: 'Самара (+4)' },
  { value: 'Asia/Yekaterinburg', label: 'Екатеринбург (+5)' },
  { value: 'Asia/Novosibirsk', label: 'Новосибирск (+6)' },
  { value: 'Asia/Irkutsk', label: 'Иркутск (+7)' },
  { value: 'Asia/Vladivostok', label: 'Владивосток (+9)' },
  { value: 'America/New_York', label: 'Нью-Йорк (-5)' },
  { value: 'America/Los_Angeles', label: 'Лос-Анджелес (-8)' },
  { value: 'Asia/Tokyo', label: 'Токио (+9)' },
  { value: 'Asia/Shanghai', label: 'Шанхай (+8)' },
  { value: 'Australia/Sydney', label: 'Сидней (+10)' },
];

// Утилита для получения смещения часового пояса
export const getTimezoneOffset = (timezone: string): number => {
  try {
    const now = new Date();
    const utcTime = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }));

    return (tzTime.getTime() - utcTime.getTime()) / (1000 * 60 * 60);
  } catch (error) {
    console.error('Error getting timezone offset:', error);
    return 0;
  }
};

// Утилита для форматирования времени с учетом часового пояса
export const formatTimeForTimezone = (date: Date, timezone: string): string => {
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  } catch (error) {
    console.error('Error formatting time for timezone:', error);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }
};

// Утилита для преобразования времени между часовыми поясами
export const convertBetweenTimezones = (
  date: Date,
  fromTimezone: string,
  toTimezone: string
): Date => {
  try {
    // Создаем строку в формате, который понимает Date
    const fromTimeStr = date.toLocaleString('en-US', {
      timeZone: fromTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    // Парсим как локальное время
    const [month, day, year] = fromTimeStr.split('/');
    const [hour, minute, second] = fromTimeStr.split(' ')[1].split(':');

    // Создаем дату в UTC
    const utcDate = new Date(Date.UTC(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    ));

    return utcDate;
  } catch (error) {
    console.error('Error converting between timezones:', error);
    return date;
  }
};