// src/components/calendar/Calendar.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { lessonService } from '../../services/lessonService';
import { clientService } from '../../services/clientService';
import { format, startOfWeek, addDays, eachDayOfInterval, parseISO, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import CalendarEvent from './CalendarEvent';
import EventDialog from './EventDialog';
import { useAuth } from '../../context/AuthContext';
import { Lesson } from '../../types';

interface CalendarProps {
  initialView?: 'day' | 'week';
}

const Calendar: React.FC<CalendarProps> = ({ initialView = 'week' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>(isMobile ? 'day' : initialView);
  const [selectedEvent, setSelectedEvent] = useState<Lesson | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; hour: number; minute: number } | null>(null);
  const [containerHeight, setContainerHeight] = useState(600);

  // Автоматически переключаем вид на мобильных
  useEffect(() => {
    setViewMode(isMobile ? 'day' : initialView);
  }, [isMobile, initialView]);

  // Вычисляем высоту контейнера
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const height = window.innerHeight - containerRef.current.getBoundingClientRect().top - 32;
        setContainerHeight(Math.max(height, 400));
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = viewMode === 'day'
    ? [currentDate]
    : eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });

  // Запросы данных
  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ['lessons', format(weekStart, 'yyyy-MM-dd')],
    queryFn: () => lessonService.getLessonsForWeek(format(weekStart, 'yyyy-MM-dd')),
  });

  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getAllClients(),
  });

  // Обработчики
  const handlePrev = () => {
    setCurrentDate(prev => viewMode === 'day' ? addDays(prev, -1) : addDays(prev, -7));
  };

  const handleNext = () => {
    setCurrentDate(prev => viewMode === 'day' ? addDays(prev, 1) : addDays(prev, 7));
  };

  const handleToday = () => setCurrentDate(new Date());

  const handleEventClick = (lesson: Lesson) => {
    setSelectedEvent(lesson);
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

  // Группируем занятия по дням
  const lessonsByDay = days.map(day => ({
    date: day,
    lessons: lessons.filter(lesson =>
      isSameDay(parseISO(lesson.dateTime), day)
    ),
  }));

  if (lessonsLoading || clientsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Typography>Загрузка календаря...</Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: containerHeight,
      }}
    >
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onViewModeChange={setViewMode}
      />

      <Paper
        elevation={1}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <CalendarGrid
          days={days}
          lessonsByDay={lessonsByDay}
          onEventClick={handleEventClick}
          onSlotClick={handleSlotClick}
          tutorTimezone={user?.timezone || 'Europe/Moscow'}
          viewMode={viewMode}
          containerHeight={containerHeight}
        />
      </Paper>

      <EventDialog
        open={openDialog}
        onClose={handleCloseDialog}
        lesson={selectedEvent}
        initialDate={selectedSlot?.date}
        tutorTimezone={user?.timezone || 'Europe/Moscow'}
      />
    </Box>
  );
};

export default Calendar;