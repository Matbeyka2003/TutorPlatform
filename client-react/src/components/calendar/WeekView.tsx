// src/components/calendar/WeekView.tsx
import React from 'react';
import { Box } from '@mui/material';
import TimeAxis from './TimeAxis';
import DayHeader from './DayHeader';
import DayColumn from './DayColumn';
import CurrentTimeLine from './CurrentTimeLine';
import { CalendarEvent } from '../../types/calendar';

interface WeekViewProps {
  days: Date[];
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onSlotClick: (date: Date, hour: number, minute: number) => void;
  tutorTimezone: string;
}

const WeekView: React.FC<WeekViewProps> = ({
  days,
  events,
  onEventClick,
  onSlotClick,
  tutorTimezone,
}) => {
  // Группируем события по дням
  const eventsByDay = days.map(day => ({
    date: day,
    events: events.filter(event =>
      event.start.getDate() === day.getDate() &&
      event.start.getMonth() === day.getMonth() &&
      event.start.getFullYear() === day.getFullYear()
    ),
  }));

  return (
    <Box sx={{ display: 'flex', height: '100%', position: 'relative' }}>
      <TimeAxis />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Заголовки дней */}
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ width: 80 }} /> {/* Отступ для оси времени */}
          {days.map((day, index) => (
            <Box key={index} sx={{ flex: 1 }}>
              <DayHeader date={day} isCurrent={index === 0} />
            </Box>
          ))}
        </Box>

        {/* Контент с днями */}
        <Box sx={{ display: 'flex', flex: 1, overflow: 'auto', position: 'relative' }}>
          <Box sx={{ width: 80, flexShrink: 0 }} />

          {eventsByDay.map((dayData, index) => (
            <Box key={index} sx={{ flex: 1, position: 'relative' }}>
              <DayColumn
                date={dayData.date}
                events={dayData.events}
                onEventClick={onEventClick}
                onSlotClick={(hour, minute) => onSlotClick(dayData.date, hour, minute)}
                tutorTimezone={tutorTimezone}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <CurrentTimeLine />
    </Box>
  );
};

export default WeekView;