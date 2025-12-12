  // Утилиты для работы с датами и временем
  export const ensureUTC = (date: Date): Date => {
    // Преобразуем локальное время в UTC
    return new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    ));
  };

  export const formatToBackend = (date: Date): string => {
    // Форматируем для бэкенда в ISO строке
    return date.toISOString();
  };

  export const parseFromBackend = (dateString: string): Date => {
    // Парсим дату с бэкенда
    return new Date(dateString);
  };

  export const addDuration = (start: Date, durationMinutes: number): Date => {
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + durationMinutes);
    return end;
  };

  // Утилита для расчета разницы временных зон
  export const calculateTimezoneOffset = (date: Date, timezone1: string, timezone2: string): number => {
    try {
      const time1 = date.toLocaleString('en-US', { timeZone: timezone1 });
      const time2 = date.toLocaleString('en-US', { timeZone: timezone2 });

      const date1 = new Date(time1);
      const date2 = new Date(time2);

      return (date1.getTime() - date2.getTime()) / (1000 * 60 * 60);
    } catch (error) {
      console.error('Error calculating timezone offset:', error);
      return 0;
    }
  };

  // Форматирование времени для отображения
  export const formatTimeForDisplay = (date: Date, timezone: string = 'UTC'): string => {
    try {
      return new Intl.DateTimeFormat('ru-RU', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(date);
    } catch (error) {
      console.error('Error formatting time:', error);
      return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
  };