// src/components/calendar/CalendarView.tsx
import React, { useState, useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { lessonService } from '../../services/lessonService';
import { format, startOfWeek, addDays, eachDayOfInterval, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import CalendarHeader from './CalendarHeader';
import WeekView from './WeekView';
import DayView from './DayView';
import EventDialog from './EventDialog';
import { CalendarViewMode, CalendarEvent } from '../../types/calendar';
import { useAuth } from '../../context/AuthContext';

interface CalendarViewProps {
  initialDate?: Date;
  initialView?: CalendarViewMode;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  initialDate = new Date(),
  initialView = 'week',
}) => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [viewMode, setViewMode] = useState<CalendarViewMode>(initialView);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date;
    hour: number;
    minute: number;
  } | null>(null);

  // Получаем начало недели для запроса
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

  // Запрос занятий
  const { data: lessons = [], isLoading, error } = useQuery({
    queryKey: ['lessons', format(weekStart, 'yyyy-MM-dd')],
    queryFn: () => lessonService.getLessonsForWeek(format(weekStart, 'yyyy-MM-dd')),
  });

  // Преобразуем занятия в формат для календаря
  const calendarEvents: CalendarEvent[] = lessons.map(lesson => ({
    id: lesson.id,
    start: parseISO(lesson.dateTime),
    end: new Date(parseISO(lesson.dateTime).getTime() + 60 * 60 * 1000), // +1 час
    lesson,
  }));

  // Получаем дни для отображения
  const getDaysToShow = () => {
    if (viewMode === 'day') {
      return [currentDate];
    }

    return eachDayOfInterval({
      start: weekStart,
      end: addDays(weekStart, 6),
    });
  };

  const handlePrev = () => {
    if (viewMode === 'day') {
      setCurrentDate(addDays(currentDate, -1));
    } else {
      setCurrentDate(addDays(currentDate, -7));
    }
  };

  const handleNext = () => {
    if (viewMode === 'day') {
      setCurrentDate(addDays(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 7));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleSlotClick = (date: Date, hour: number, minute: number) => {
    const slotDate = new Date(date);
    slotDate.setHours(hour, minute, 0, 0);
    setSelectedSlot({ date: slotDate, hour, minute });
    setSelectedEvent(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
  };

  const days = getDaysToShow();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onViewModeChange={setViewMode}
      />

      <Paper sx={{ flex: 1, overflow: 'auto', mt: 2 }}>
        {viewMode === 'week' ? (
          <WeekView
            days={days}
            events={calendarEvents}
            onEventClick={handleEventClick}
            onSlotClick={handleSlotClick}
            tutorTimezone={user?.timezone || 'Europe/Moscow'}
          />
        ) : (
          <DayView
            date={currentDate}
            events={calendarEvents}
            onEventClick={handleEventClick}
            onSlotClick={handleSlotClick}
            tutorTimezone={user?.timezone || 'Europe/Moscow'}
          />
        )}
      </Paper>

      <EventDialog
        open={openDialog}
        onClose={handleCloseDialog}
        event={selectedEvent}
        initialDate={selectedSlot?.date}
        tutorTimezone={user?.timezone || 'Europe/Moscow'}
      />
    </Box>
  );
};

export default CalendarView;