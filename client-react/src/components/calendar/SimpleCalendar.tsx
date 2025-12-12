import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  useTheme,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  ViewWeek,
  CalendarViewDay,
} from '@mui/icons-material';
import { format, startOfWeek, addDays, eachDayOfInterval, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';

import CalendarContainer from './CalendarContainer';
import CalendarGrid from './CalendarGrid';
import CalendarEventCard from './CalendarEventCard';
import { CALENDAR_CONFIG } from './CalendarConfig';
import { lessonService } from '../../services/lessonService';
import { useAuth } from '../../context/AuthContext';

interface SimpleCalendarProps {
  initialView?: 'day' | 'week';
}

const SimpleCalendar: React.FC<SimpleCalendarProps> = ({
  initialView = 'week',
}) => {
  const theme = useTheme();
  const { user } = useAuth();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>(initialView);
  const [workingHours, setWorkingHours] = useState({
    start: CALENDAR_CONFIG.defaultWorkingHours.start,
    end: CALENDAR_CONFIG.defaultWorkingHours.end,
  });
  const [containerHeight, setContainerHeight] = useState(600);

  // Получаем занятия
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ['lessons', format(weekStart, 'yyyy-MM-dd'), viewMode],
    queryFn: () => lessonService.getLessonsForWeek(format(weekStart, 'yyyy-MM-dd')),
  });

  // Получаем дни для отображения
  const days = viewMode === 'day'
    ? [currentDate]
    : eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });

  // Обработчики навигации
  const handlePrev = () => {
    setCurrentDate(prev => viewMode === 'day' ? addDays(prev, -1) : addDays(prev, -7));
  };

  const handleNext = () => {
    setCurrentDate(prev => viewMode === 'day' ? addDays(prev, 1) : addDays(prev, 7));
  };

  const handleToday = () => setCurrentDate(new Date());

  const handleContainerResize = (dimensions: { width: number; height: number }) => {
    setContainerHeight(dimensions.height - CALENDAR_CONFIG.padding.top - CALENDAR_CONFIG.padding.bottom);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <Typography>Загрузка календаря...</Typography>
      </Box>
    );
  }

  return (
    <CalendarContainer onResize={handleContainerResize}>
      {/* Панель управления */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 1,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {viewMode === 'day'
            ? format(currentDate, 'dd MMMM yyyy', { locale: ru })
            : `${format(weekStart, 'dd MMM', { locale: ru })} - ${format(addDays(weekStart, 6), 'dd MMM yyyy', { locale: ru })}`
          }
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Переключение вида */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={viewMode === 'day' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('day')}
              size="small"
            >
              День
            </Button>
            <Button
              variant={viewMode === 'week' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('week')}
              size="small"
            >
              Неделя
            </Button>
          </Box>

          {/* Навигация */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={handlePrev} size="small">
              <ChevronLeft />
            </IconButton>
            <Button
              variant="outlined"
              onClick={handleToday}
              size="small"
            >
              Сегодня
            </Button>
            <IconButton onClick={handleNext} size="small">
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Основная сетка календаря */}
      <CalendarGrid
        days={days}
        lessons={lessons}
        workingHours={workingHours}
        containerHeight={containerHeight}
        tutorTimezone={user?.timezone || 'Europe/Moscow'}
      />
    </CalendarContainer>
  );
};

export default SimpleCalendar;