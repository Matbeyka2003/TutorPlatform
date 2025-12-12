// src/components/calendar/RescheduleDialog.tsx - УЛУЧШЕННАЯ ВЕРСИЯ
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  AccessTime,
  Person,
  Check,
  Schedule,
} from '@mui/icons-material';
import {
  format,
  addDays,
  startOfWeek,
  eachDayOfInterval,
  parseISO,
  isSameDay,
  isSameHour,
  isSameMinute,
  addMinutes,
  isToday,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonService } from '../../services/lessonService';
import { Lesson } from '../../types';

interface RescheduleDialogProps {
  open: boolean;
  onClose: () => void;
  lesson: Lesson;
  tutorTimezone: string;
  currentLessons: Lesson[];
}

const RescheduleDialog: React.FC<RescheduleDialogProps> = ({
  open,
  onClose,
  lesson,
  tutorTimezone,
  currentLessons,
}) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [hoverSlot, setHoverSlot] = useState<{ date: Date; hour: number; minute: number } | null>(null);

  // Высота слота (15 минут)
  const slotHeight = 60; // 15 минут = 60px (1 час = 240px)

  // Получаем неделю для отображения
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6),
  });

  // Время работы (8:00 - 22:00)
  const workHours = Array.from({ length: 15 }, (_, i) => i + 8); // 8-22
  const timeSlots = Array.from({ length: 15 * 4 }, (_, i) => i); // 15 часов * 4 (15-минутные слоты)

  // Мутация для обновления занятия
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      lessonService.updateLesson(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      onClose();
    },
  });

  // Проверяем, занят ли слот
  const isSlotOccupied = (date: Date, hour: number, minute: number) => {
    const slotTime = new Date(date);
    slotTime.setHours(hour, minute, 0, 0);

    return currentLessons.some(l => {
      if (l.id === lesson.id) return false; // Исключаем текущее занятие

      const lessonTime = parseISO(l.dateTime);
      const lessonEnd = addMinutes(lessonTime, 60); // Предполагаем 1 час

      // Проверяем пересечение временных интервалов
      return (
        slotTime >= lessonTime && slotTime < lessonEnd ||
        addMinutes(slotTime, 60) > lessonTime && addMinutes(slotTime, 60) <= lessonEnd
      );
    });
  };

  // Обработчики
  const handlePrevWeek = () => setCurrentWeek(prev => addDays(prev, -7));
  const handleNextWeek = () => setCurrentWeek(prev => addDays(prev, 7));
  const handleToday = () => setCurrentWeek(new Date());

  const handleSlotSelect = (date: Date, hour: number, minute: number) => {
    if (isSlotOccupied(date, hour, minute)) return;

    const slotDate = new Date(date);
    slotDate.setHours(hour, minute, 0, 0);
    setSelectedSlot(slotDate);
  };

  const handleSlotHover = (date: Date, hour: number, minute: number) => {
    const slotDate = new Date(date);
    slotDate.setHours(hour, minute, 0, 0);
    setHoverSlot({ date, hour, minute });
  };

  const handleConfirm = () => {
    if (!selectedSlot || !lesson) return;

    const lessonData = {
      client: { id: lesson.client.id },
      dateTime: selectedSlot.toISOString(),
      description: lesson.description || '',
      tutorTimezone: lesson.tutorTimezone || tutorTimezone,
      clientTimezone: lesson.client.timezone,
      labelIds: lesson.labels?.map((l: any) => l.id) || [],
    };

    updateMutation.mutate({ id: lesson.id, data: lessonData });
  };

  // Форматируем время для отображения
  const formatTimeDisplay = (date: Date | null, timezone: string) => {
    if (!date) return '';
    return format(date, 'HH:mm');
  };

  // Рассчитываем время ученика (упрощенная версия)
  const calculateStudentTime = (date: Date, tutorTimezone: string, studentTimezone: string) => {
    // В реальном приложении здесь должна быть конвертация временных зон
    // Пока возвращаем то же время
    return format(date, 'HH:mm');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Person color="primary" />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">
              Перенос занятия с {lesson.client.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Текущее время: {format(parseISO(lesson.dateTime), 'dd.MM.yyyy HH:mm')}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Навигация по неделям */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: 'background.default',
            }}
          >
            <Button
              startIcon={<ChevronLeft />}
              onClick={handlePrevWeek}
              variant="outlined"
              size="small"
            >
              Предыдущая неделя
            </Button>

            <Typography variant="h6" fontWeight="medium">
              {format(weekStart, 'dd.MM.yyyy')} - {format(addDays(weekStart, 6), 'dd.MM.yyyy')}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                startIcon={<Today />}
                onClick={handleToday}
                variant="outlined"
                size="small"
              >
                Сегодня
              </Button>
              <Button
                endIcon={<ChevronRight />}
                onClick={handleNextWeek}
                variant="outlined"
                size="small"
              >
                Следующая неделя
              </Button>
            </Box>
          </Paper>

          {/* Сетка календаря */}
          <Box sx={{ flex: 1, overflow: 'auto', position: 'relative' }}>
            <Grid container sx={{ minWidth: 1200 }}>
              {/* Ось времени */}
              <Grid item xs={1} sx={{ position: 'sticky', left: 0, zIndex: 20, bgcolor: 'background.paper' }}>
                <Box sx={{ height: 48, borderRight: 1, borderBottom: 1, borderColor: 'divider' }} />
                {timeSlots.map((slot, index) => {
                  const hour = Math.floor(slot / 4) + 8;
                  const minute = (slot % 4) * 15;

                  if (minute === 0) {
                    return (
                      <Box
                        key={slot}
                        sx={{
                          height: slotHeight * 4,
                          borderRight: 1,
                          borderBottom: 1,
                          borderColor: 'divider',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'center',
                          pt: 1,
                          position: 'relative',
                        }}
                      >
                        <Typography variant="caption" fontWeight="medium" color="text.secondary">
                          {hour.toString().padStart(2, '0')}:00
                        </Typography>

                        {/* Линии для 15-минутных интервалов */}
                        {[1, 2, 3].map(line => (
                          <Box
                            key={line}
                            sx={{
                              position: 'absolute',
                              top: line * slotHeight,
                              left: 0,
                              right: 0,
                              height: 1,
                              bgcolor: 'action.hover',
                              opacity: 0.3,
                            }}
                          />
                        ))}
                      </Box>
                    );
                  }
                  return null;
                })}
              </Grid>

              {/* Дни недели */}
              {weekDays.map((day, dayIndex) => (
                <Grid item xs={11/7} key={dayIndex}>
                  {/* Заголовок дня */}
                  <Box
                    sx={{
                      height: 48,
                      borderRight: dayIndex < 6 ? 1 : 0,
                      borderBottom: 1,
                      borderColor: 'divider',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isToday(day) ? 'primary.light' : 'background.paper', // ТЕПЕРЬ isToday определен
                      color: isToday(day) ? 'primary.contrastText' : 'inherit',
                    }}

                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      {format(day, 'EEE', { locale: ru })}
                    </Typography>
                    <Typography variant="body2">
                      {format(day, 'dd.MM')}
                    </Typography>
                  </Box>

                  {/* Временные слоты */}
                  {timeSlots.map((slot, slotIndex) => {
                    const hour = Math.floor(slot / 4) + 8;
                    const minute = (slot % 4) * 15;
                    const isOccupied = isSlotOccupied(day, hour, minute);
                    const slotDate = new Date(day);
                    slotDate.setHours(hour, minute, 0, 0);
                    const isSelected = selectedSlot &&
                      isSameDay(selectedSlot, day) &&
                      isSameHour(selectedSlot, slotDate) &&
                      Math.floor(selectedSlot.getMinutes() / 15) === Math.floor(minute / 15);

                    const isHovered = hoverSlot &&
                      isSameDay(hoverSlot.date, day) &&
                      hoverSlot.hour === hour &&
                      Math.floor(hoverSlot.minute / 15) === Math.floor(minute / 15);

                    return (
                      <Box
                        key={`${dayIndex}-${slotIndex}`}
                        sx={{
                          height: slotHeight,
                          borderRight: dayIndex < 6 ? 1 : 0,
                          borderBottom: 1,
                          borderColor: 'divider',
                          position: 'relative',
                          cursor: isOccupied ? 'not-allowed' : 'pointer',
                          bgcolor: isSelected ? 'primary.light' :
                                   isHovered ? 'action.hover' :
                                   isOccupied ? 'error.light' : 'transparent',
                          '&:hover': {
                            bgcolor: isOccupied ? 'error.light' : 'action.hover',
                          },
                        }}
                        onClick={() => handleSlotSelect(day, hour, minute)}
                        onMouseEnter={() => handleSlotHover(day, hour, minute)}
                        onMouseLeave={() => setHoverSlot(null)}
                      >
                        {/* Отображение времени при наведении */}
                        {isHovered && !isOccupied && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: 'rgba(0, 0, 0, 0.05)',
                            }}
                          >
                            <Typography variant="caption" fontWeight="bold">
                              {hour.toString().padStart(2, '0')}:{minute.toString().padStart(2, '0')}
                            </Typography>
                            <Typography variant="caption" fontSize="0.6rem" color="text.secondary">
                              {calculateStudentTime(slotDate, tutorTimezone, lesson.client.timezone)}
                            </Typography>
                          </Box>
                        )}

                        {/* Маркер выбранного слота */}
                        {isSelected && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Check sx={{ fontSize: 12, color: 'white' }} />
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Информационная панель */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'background.default',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Alert
                  severity={selectedSlot ? "success" : "info"}
                  icon={<Schedule />}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    {selectedSlot ? 'Выбран новый слот:' : 'Выберите новый слот для занятия'}
                  </Typography>
                  {selectedSlot && (
                    <>
                      <Typography variant="body1" fontWeight="bold">
                        {format(selectedSlot, 'dd.MM.yyyy HH:mm')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Время ученика: {calculateStudentTime(selectedSlot, tutorTimezone, lesson.client.timezone)} ({lesson.client.timezone})
                      </Typography>
                    </>
                  )}
                </Alert>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: 'primary.light' }} />
                    <Typography variant="caption">Выбранный слот</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: 'error.light' }} />
                    <Typography variant="caption">Занятое время</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, borderRadius: 1, border: 1, borderColor: 'divider' }} />
                    <Typography variant="caption">Доступное время</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} disabled={updateMutation.isPending}>
          Отмена
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!selectedSlot || updateMutation.isPending}
          startIcon={updateMutation.isPending ? <CircularProgress size={20} /> : <Check />}
        >
          {updateMutation.isPending ? 'Перенос...' : 'Перенести занятие'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RescheduleDialog;