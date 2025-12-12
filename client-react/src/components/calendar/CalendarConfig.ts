// Конфигурация календаря
export const CALENDAR_CONFIG = {
  // Отступы внутри календаря
  padding: 8,

  // Высота компонентов
  headerHeight: 48,
  dayHeaderHeight: 60,
  timeAxisWidth: 70, // Увеличили для лучшего отображения

  // Настройки времени по умолчанию
  defaultWorkingHours: {
    start: 8,
    end: 22,
  },

  // Уровни зума
  zoomLevels: [
    { level: 1, hourHeight: 40, label: 'Мелко' },
    { level: 2, hourHeight: 50, label: 'Мелко-средне' },
    { level: 3, hourHeight: 60, label: 'Средне' },
    { level: 4, hourHeight: 70, label: 'Средне-крупно' },
    { level: 5, hourHeight: 80, label: 'Крупно' },
  ],

  // Цвета
  colors: {
    gridLine: '#e0e0e0',
    gridLine15min: '#f0f0f0',
    currentTimeLine: '#ff4444',
    todayBackground: 'rgba(25, 118, 210, 0.08)',
    event: {
      default: 'rgba(25, 118, 210, 0.1)',
      paid: 'rgba(76, 175, 80, 0.1)',
      unpaid: 'rgba(255, 152, 0, 0.1)',
      trial: 'rgba(156, 39, 176, 0.1)',
    },
  },

  // Стили карточки занятия
  eventCard: {
    padding: 12,
    borderWidth: 4,
    minHeight: 80,
  },
};

// Утилиты для расчета размеров
export const calculateCalendarHeight = (
  workingHours: { start: number; end: number },
  zoomLevel: number
): number => {
  const hourHeight = CALENDAR_CONFIG.zoomLevels[zoomLevel - 1]?.hourHeight || 60;
  const hoursCount = workingHours.end - workingHours.start;
  return hoursCount * hourHeight + CALENDAR_CONFIG.dayHeaderHeight;
};

// Утилита для получения высоты часа по уровню зума
export const getHourHeight = (zoomLevel: number): number => {
  return CALENDAR_CONFIG.zoomLevels[zoomLevel - 1]?.hourHeight || 60;
};