import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  ButtonGroup,
  Slider,
  Tooltip,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  ViewWeek,
  CalendarViewDay,
  ZoomIn,
  ZoomOut,
  Settings as SettingsIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { lessonService } from '../../services/lessonService';
import {
  format,
  startOfWeek,
  addDays,
  eachDayOfInterval,
  parseISO,
  isSameDay,
  isToday,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAuth } from '../../context/AuthContext';
import { Lesson } from '../../types';
import EventDialog from './EventDialog';
import RescheduleDialog from './RescheduleDialog';
import CalendarGrid from './CalendarGrid';
import CalendarEventCard from './CalendarEventCard';
import { CALENDAR_CONFIG } from './CalendarConfig';
import { TIMEZONES } from '../../constants/timezones';

interface EnhancedCalendarProps {
  initialView?: 'day' | 'week';
}

const EnhancedCalendar: React.FC<EnhancedCalendarProps> = ({
  initialView = 'week'
}) => {
  const theme = useTheme();
  const { user } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>(initialView);
  const [selectedEvent, setSelectedEvent] = useState<Lesson | null>(null);
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false);
  const [openTimeSettings, setOpenTimeSettings] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date;
    hour: number;
    minute: number
  } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(3);

  // Настройки времени из localStorage
  const [timeSettings, setTimeSettings] = useState(() => {
    const saved = localStorage.getItem('calendarTimeSettings');
    return saved ? JSON.parse(saved) : {
      startHour: 8,
      endHour: 22,
      showCurrentTime: true,
    };
  });

  useEffect(() => {
    localStorage.setItem('calendarTimeSettings', JSON.stringify(timeSettings));
  }, [timeSettings]);

  // Получаем данные
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = viewMode === 'day'
    ? [currentDate]
    : eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ['lessons', format(weekStart, 'yyyy-MM-dd'), viewMode],
    queryFn: () => lessonService.getLessonsForWeek(format(weekStart, 'yyyy-MM-dd')),
  });

  // Группируем занятия по дням
  const lessonsByDay = days.map(day => ({
    date: day,
    lessons: lessons.filter(lesson => {
      const lessonTime = parseISO(lesson.dateTime);
      return isSameDay(lessonTime, day) &&
             lessonTime.getHours() >= timeSettings.startHour &&
             lessonTime.getHours() < timeSettings.endHour;
    }),
  }));

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
    setOpenEventDialog(true);
  };

  const handleSlotClick = (date: Date, hour: number, minute: number) => {
    const slotDate = new Date(date);
    slotDate.setHours(hour, minute, 0, 0);
    setSelectedSlot({ date: slotDate, hour, minute });
    setSelectedEvent(null);
    setOpenEventDialog(true);
  };

  const handleCreateNew = () => {
  const now = new Date();
  const minutes = Math.ceil(now.getMinutes() / 15) * 15;
  const newDate = new Date(now);
  newDate.setMinutes(minutes);
  newDate.setSeconds(0);

  setSelectedSlot({ date: newDate, hour: newDate.getHours(), minute: newDate.getMinutes() });
  setSelectedEvent(null);
  setOpenEventDialog(true);

  };

  const handleReschedule = () => {
    setOpenEventDialog(false);
    setOpenRescheduleDialog(true);
  };

  const handleCloseEventDialog = () => {
    setOpenEventDialog(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
  };

  const handleCloseRescheduleDialog = () => {
    setOpenRescheduleDialog(false);
    setSelectedEvent(null);
  };

  const handleZoomIn = () => {
    if (zoomLevel < 5) setZoomLevel(zoomLevel + 1);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 1) setZoomLevel(zoomLevel - 1);
  };

  const handleSaveTimeSettings = () => {
    setOpenTimeSettings(false);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
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
        width: '100%',
        gap: 1,
      }}
    >
      {/* Верхняя панель с управлением */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
          borderRadius: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            {viewMode === 'day'
              ? format(currentDate, 'dd MMMM yyyy', { locale: ru })
              : `${format(weekStart, 'dd MMM', { locale: ru })} - ${format(addDays(weekStart, 6), 'dd MMM yyyy', { locale: ru })}`
            }
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
            size="small"
            sx={{
              backgroundColor: theme.palette.success.main,
              '&:hover': {
                backgroundColor: theme.palette.success.dark,
              },
            }}
          >
            Новое занятие
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Настройки времени */}
          <Tooltip title="Настройки времени">
            <IconButton
              onClick={() => setOpenTimeSettings(true)}
              size="small"
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          {/* Управление зумом */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Уменьшить масштаб">
              <IconButton
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                size="small"
              >
                <ZoomOut />
              </IconButton>
            </Tooltip>

            <Slider
              value={zoomLevel}
              onChange={(_, value) => setZoomLevel(value as number)}
              min={1}
              max={5}
              step={1}
              marks={[
                { value: 1, label: 'Мелко' },
                { value: 3, label: 'Средне' },
                { value: 5, label: 'Крупно' },
              ]}
              sx={{ width: 100 }}
              size="small"
            />

            <Tooltip title="Увеличить масштаб">
              <IconButton
                onClick={handleZoomIn}
                disabled={zoomLevel >= 5}
                size="small"
              >
                <ZoomIn />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Переключение вида */}
          <ButtonGroup variant="outlined" size="small">
            <Button
              variant={viewMode === 'day' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('day')}
            >
              День
            </Button>
            <Button
              variant={viewMode === 'week' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('week')}
            >
              Неделя
            </Button>
          </ButtonGroup>

          {/* Навигация */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
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

      {/* Основной календарь */}
      <Paper
        elevation={1}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          position: 'relative',
          bgcolor: 'background.paper',
          minHeight: 0,
        }}
      >
        <CalendarGrid
          days={days}
          lessonsByDay={lessonsByDay}
          onEventClick={handleEventClick}
          onSlotClick={handleSlotClick}
          tutorTimezone={user?.timezone || 'Europe/Moscow'}
          timeSettings={timeSettings}
          zoomLevel={zoomLevel}
          showCurrentTime={timeSettings.showCurrentTime}
        />
      </Paper>

      {/* Диалог настроек времени */}
      <Dialog
        open={openTimeSettings}
        onClose={() => setOpenTimeSettings(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Настройки календаря</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Начало рабочего дня"
                type="number"
                value={timeSettings.startHour}
                onChange={(e) => setTimeSettings({
                  ...timeSettings,
                  startHour: Math.min(parseInt(e.target.value) || 0, timeSettings.endHour - 1)
                })}
                inputProps={{ min: 0, max: 23 }}
                fullWidth
              />
              <TextField
                label="Конец рабочего дня"
                type="number"
                value={timeSettings.endHour}
                onChange={(e) => setTimeSettings({
                  ...timeSettings,
                  endHour: Math.max(parseInt(e.target.value) || 24, timeSettings.startHour + 1)
                })}
                inputProps={{ min: 1, max: 24 }}
                fullWidth
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={timeSettings.showCurrentTime}
                  onChange={(e) => setTimeSettings({
                    ...timeSettings,
                    showCurrentTime: e.target.checked
                  })}
                />
              }
              label="Показывать линию текущего времени"
            />

            <Alert severity="info">
              Рабочее время: {timeSettings.startHour}:00 - {timeSettings.endHour}:00
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTimeSettings(false)}>Отмена</Button>
          <Button
            variant="contained"
            onClick={handleSaveTimeSettings}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалоги занятий */}
      <EventDialog
        open={openEventDialog}
        onClose={handleCloseEventDialog}
        lesson={selectedEvent}
        initialDate={selectedSlot?.date}
        tutorTimezone={user?.timezone || 'Europe/Moscow'}
        onReschedule={handleReschedule}
      />

      {selectedEvent && (
        <RescheduleDialog
          open={openRescheduleDialog}
          onClose={handleCloseRescheduleDialog}
          lesson={selectedEvent}
          tutorTimezone={user?.timezone || 'Europe/Moscow'}
          currentLessons={lessons}
        />
      )}
    </Box>
  );
};

export default EnhancedCalendar;