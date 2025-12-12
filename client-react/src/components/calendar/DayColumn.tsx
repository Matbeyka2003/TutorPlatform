// src/components/calendar/DayColumn.tsx
import React from 'react';
import { Box } from '@mui/material';
import CalendarEvent from './CalendarEvent';
import { Lesson } from '../../types';
import { parseISO } from 'date-fns';

interface DayColumnProps {
  date: Date;
  lessons: Lesson[];
  onEventClick: (lesson: Lesson) => void;
  onSlotClick: (hour: number, minute: number) => void;
  tutorTimezone: string;
  slotHeight: number;
}

const DayColumn: React.FC<DayColumnProps> = ({
  date,
  lessons,
  onEventClick,
  onSlotClick,
  tutorTimezone,
  slotHeight,
}) => {
  // Группируем занятия по позиции на сетке
  const renderEvents = () => {
    return lessons.map((lesson, index) => {
      const startTime = parseISO(lesson.dateTime);
      const hour = startTime.getHours();
      const minute = startTime.getMinutes();

      // Позиция в пикселях от верха колонки
      const top = (hour + minute / 60) * slotHeight;

      return (
        <Box
          key={lesson.id}
          sx={{
            position: 'absolute',
            top: top,
            left: 4,
            right: 4,
            zIndex: 2,
          }}
        >
          <CalendarEvent
            lesson={lesson}
            onClick={onEventClick}
            tutorTimezone={tutorTimezone}
          />
        </Box>
      );
    });
  };

  // Рендерим слоты времени
  const renderTimeSlots = () => {
    const slots = [];

    for (let hour = 0; hour < 24; hour++) {
      for (let quarter = 0; quarter < 4; quarter++) {
        const minute = quarter * 15;
        const top = (hour + quarter * 0.25) * slotHeight;

        slots.push(
          <Box
            key={`${hour}-${minute}`}
            sx={{
              position: 'absolute',
              top: top,
              left: 0,
              right: 0,
              height: slotHeight / 4,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
            onClick={() => onSlotClick(hour, minute)}
          />
        );
      }
    }

    return slots;
  };

  return (
    <Box
      sx={{
        height: slotHeight * 24,
        position: 'relative',
        bgcolor: 'background.paper',
      }}
    >
      {/* Кликабельные слоты времени */}
      {renderTimeSlots()}

      {/* Горизонтальные линии сетки */}
      {Array.from({ length: 25 }, (_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            top: i * slotHeight,
            left: 0,
            right: 0,
            height: 1,
            bgcolor: i % 4 === 0 ? 'divider' : 'action.hover',
            opacity: i % 4 === 0 ? 1 : 0.3,
          }}
        />
      ))}

      {/* Занятия */}
      {renderEvents()}
    </Box>
  );
};

export default DayColumn;