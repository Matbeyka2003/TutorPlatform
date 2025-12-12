import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material'; // Добавьте Typography
import { format, parseISO, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Lesson } from '../../types';
import CalendarEventCard from './CalendarEventCard';
import { CALENDAR_CONFIG } from './CalendarConfig';
import { getTimezoneOffset } from '../../constants/timezones';

interface CalendarGridProps {
  days: Date[];
  lessonsByDay: Array<{ date: Date; lessons: Lesson[] }>;
  onEventClick: (lesson: Lesson) => void;
  onSlotClick: (date: Date, hour: number, minute: number) => void;
  tutorTimezone: string;
  timeSettings: {
    startHour: number;
    endHour: number;
  };
  zoomLevel: number;
  showCurrentTime: boolean;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  days,
  lessonsByDay,
  onEventClick,
  onSlotClick,
  tutorTimezone,
  timeSettings,
  zoomLevel,
  showCurrentTime,
}) => {
  const [currentTimePosition, setCurrentTimePosition] = useState<number | null>(null);

  const hourHeight = CALENDAR_CONFIG.zoomLevels[zoomLevel - 1]?.hourHeight || 55;
  const slotHeight = hourHeight / 4;
  const workHours = Array.from(
    { length: timeSettings.endHour - timeSettings.startHour },
    (_, i) => i + timeSettings.startHour
  );

  // Обновление позиции текущего времени
  useEffect(() => {
    if (!showCurrentTime) {
      setCurrentTimePosition(null);
      return;
    }

    const updateCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      if (hours >= timeSettings.startHour && hours < timeSettings.endHour) {
        const position = (hours - timeSettings.startHour + minutes / 60) * hourHeight;
        setCurrentTimePosition(position);
      } else {
        setCurrentTimePosition(null);
      }
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, [hourHeight, timeSettings, showCurrentTime]);

  // Рассчитываем разницу во времени для ученика
  const getStudentTime = (date: Date, studentTimezone: string): string => {
    try {
      const offsetDiff = getTimezoneOffset(studentTimezone) - getTimezoneOffset(tutorTimezone);
      const studentDate = new Date(date.getTime() + offsetDiff * 60 * 60 * 1000);
      return format(studentDate, 'HH:mm');
    } catch {
      return format(date, 'HH:mm');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Заголовки дней */}
      <Box sx={{
        display: 'flex',
        borderBottom: '2px solid',
        borderColor: 'divider',
        height: CALENDAR_CONFIG.dayHeaderHeight,
        flexShrink: 0,
        bgcolor: 'background.paper',
      }}>
        {/* Ячейка для оси времени */}
        <Box sx={{
          width: CALENDAR_CONFIG.timeAxisWidth,
          borderRight: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Typography variant="caption" fontWeight="medium" color="text.secondary">
            Время
          </Typography>
        </Box>

        {/* Заголовки дней */}
        {days.map((day, index) => {
          const isTodayDate = isToday(day);
          return (
            <Box
              key={index}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: index < days.length - 1 ? '1px solid' : 'none',
                borderColor: 'divider',
                bgcolor: isTodayDate ? 'primary.light' : 'transparent',
                color: isTodayDate ? 'primary.contrastText' : 'inherit',
                p: 1,
                minWidth: 0,
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                {format(day, 'EEE', { locale: ru })}
              </Typography>
              <Typography variant="body2" fontWeight={isTodayDate ? 'bold' : 'normal'}>
                {format(day, 'd')}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Основная сетка */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          position: 'relative',
          display: 'flex',
        }}
      >
        {/* Ось времени */}
        <Box sx={{
          width: CALENDAR_CONFIG.timeAxisWidth,
          flexShrink: 0,
          position: 'sticky',
          left: 0,
          zIndex: 10,
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        }}>
          {workHours.map(hour => (
            <Box
              key={hour}
              sx={{
                height: hourHeight,
                position: 'relative',
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                pt: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 'medium',
                  fontSize: '0.75rem',
                }}
              >
                {hour.toString().padStart(2, '0')}:00
              </Typography>

              {/* Линии для 15-минутных интервалов */}
              {[15, 30, 45].map(minute => (
                <Box
                  key={minute}
                  sx={{
                    position: 'absolute',
                    top: `${(minute / 60) * 100}%`,
                    left: 0,
                    right: 0,
                    height: 1,
                    bgcolor: 'action.hover',
                    opacity: 0.3,
                  }}
                />
              ))}
            </Box>
          ))}
        </Box>

        {/* Колонки дней */}
        <Box sx={{ display: 'flex', flex: 1 }}>
          {lessonsByDay.map((dayData, dayIndex) => (
            <Box
              key={dayIndex}
              sx={{
                flex: 1,
                position: 'relative',
                borderRight: dayIndex < days.length - 1 ? '1px solid' : 'none',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                minWidth: 0,
              }}
            >
              {/* Сетка часов (фон) */}


              {/* Сетка часов (фон) */}
              {workHours.map(hour => (
                <React.Fragment key={hour}>
                  {/* Часовая линия - основная */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: (hour - timeSettings.startHour) * hourHeight,
                      left: 0,
                      right: 0,
                      height: 1,
                      bgcolor: 'divider',
                      zIndex: 1,
                    }}
                  />

                  {/* 15-минутные линии - более светлые */}
                  {[15, 30, 45].map(minute => (
                    <Box
                      key={minute}
                      sx={{
                        position: 'absolute',
                        top: ((hour - timeSettings.startHour) + minute/60) * hourHeight,
                        left: 0,
                        right: 0,
                        height: 0.5,
                        bgcolor: 'action.hover',
                        opacity: 0.3,
                        zIndex: 1,
                      }}
                    />
                  ))}

                  {/* Заливка четных часов - убираем градиент */}
                  {hour % 2 === 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: (hour - timeSettings.startHour) * hourHeight,
                        left: 0,
                        right: 0,
                        height: hourHeight,
                        bgcolor: 'action.hover',
                        opacity: 0.03,
                        zIndex: 0,
                      }}
                    />
                  )}

                  {/* Кликабельные слоты */}
                  {[0, 15, 30, 45].map(minute => (
                    <Box
                      key={minute}
                      sx={{
                        position: 'absolute',
                        top: ((hour - timeSettings.startHour) + minute/60) * hourHeight,
                        left: 0,
                        right: 0,
                        height: slotHeight,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'primary.light',
                          opacity: 0.05,
                        },
                        zIndex: 2,
                      }}
                      onClick={() => onSlotClick(dayData.date, hour, minute)}
                    />
                  ))}
                </React.Fragment>
              ))}

              {/* Занятия */}
              {dayData.lessons.map((lesson) => {
                const startTime = parseISO(lesson.dateTime);
                const endTime = lesson.endTime ? parseISO(lesson.endTime) :
                  new Date(startTime.getTime() + 60 * 60 * 1000);

                const hour = startTime.getHours();
                const minute = startTime.getMinutes();
                const endHour = endTime.getHours();
                const endMinute = endTime.getMinutes();

                // Рассчитываем длительность в часах
                const durationHours = (endHour + endMinute/60) - (hour + minute/60);

                const top = (hour - timeSettings.startHour + minute / 60) * hourHeight;
                const height = durationHours * hourHeight;

                return (
                  <Box
                    key={lesson.id}
                    sx={{
                      position: 'absolute',
                      top: Math.max(top + 1, 0), // Не выходим за верхнюю границу
                      left: 2,
                      right: 2,
                      height: Math.max(height - 2, 20), // Минимальная высота 20px
                      zIndex: 3,
                      overflow: 'hidden', // Чтобы содержимое не выходило за границы
                    }}
                  >
                    <CalendarEventCard
                      lesson={lesson}
                      onClick={onEventClick}
                      tutorTimezone={tutorTimezone}
                      getStudentTime={getStudentTime}
                    />
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>

        {/* Линия текущего времени */}
        {showCurrentTime && currentTimePosition !== null && (
          <Box
            sx={{
              position: 'absolute',
              top: currentTimePosition,
              left: CALENDAR_CONFIG.timeAxisWidth,
              right: 0,
              height: 2,
              bgcolor: 'error.main',
              zIndex: 100,
              pointerEvents: 'none',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: -4,
                top: -3,
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'error.main',
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default CalendarGrid;