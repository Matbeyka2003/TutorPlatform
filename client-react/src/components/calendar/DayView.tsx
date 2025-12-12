// src/components/calendar/DayView.tsx
import React from 'react';
import { Box } from '@mui/material';
import TimeAxis from './TimeAxis';
import DayColumn from './DayColumn';
import CurrentTimeLine from './CurrentTimeLine';
import { CalendarEvent } from '../../types/calendar';

interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onSlotClick: (date: Date, hour: number, minute: number) => void;
  tutorTimezone: string;
}

const DayView: React.FC<DayViewProps> = ({
  date,
  events,
  onEventClick,
  onSlotClick,
  tutorTimezone,
}) => {
  const dayEvents = events.filter(event =>
    event.start.getDate() === date.getDate() &&
    event.start.getMonth() === date.getMonth() &&
    event.start.getFullYear() === date.getFullYear()
  );

  return (
    <Box sx={{ display: 'flex', height: '100%', position: 'relative' }}>
      <TimeAxis />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ height: 48 }} /> {/* Отступ для заголовка */}

        <Box sx={{ flex: 1, position: 'relative' }}>
          <DayColumn
            date={date}
            events={dayEvents}
            onEventClick={onEventClick}
            onSlotClick={(hour, minute) => onSlotClick(date, hour, minute)}
            tutorTimezone={tutorTimezone}
          />
        </Box>
      </Box>

      <CurrentTimeLine />
    </Box>
  );
};

export default DayView;