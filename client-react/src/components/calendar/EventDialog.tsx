// src/components/calendar/EventDialog.tsx - УПРОЩЕННАЯ ВЕРСИЯ
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Person,
  Label as LabelIcon,
  AccessTime,
  Schedule,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonService } from '../../services/lessonService';
import { clientService } from '../../services/clientService';
import { labelService } from '../../services/labelService';
import { Lesson } from '../../types';
import { formatToBackend, addDuration } from '../../utils/dateUtils';

interface EventDialogProps {
  open: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  initialDate?: Date;
  tutorTimezone: string;
  onReschedule?: () => void;
}

const EventDialog: React.FC<EventDialogProps> = ({
  open,
  onClose,
  lesson,
  initialDate,
  tutorTimezone,
  onReschedule,
}) => {
  const queryClient = useQueryClient();

const [formData, setFormData] = useState({
  clientId: '',
  dateTime: initialDate || new Date(),
  endTime: initialDate ? new Date(initialDate.getTime() + 60 * 60 * 1000) : new Date(new Date().getTime() + 60 * 60 * 1000),
  duration: 60, // Изменено с 45 на 60 для корректного расчета
  description: '',
  selectedLabels: [] as number[],
});
  // Запросы данных
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getAllClients(),
  });

  const { data: labels = [], isLoading: labelsLoading } = useQuery({
    queryKey: ['labels'],
    queryFn: () => labelService.getAllLabels(),
  });

  // Мутации
  const createMutation = useMutation({
    mutationFn: (data: any) => lessonService.createLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      lessonService.updateLesson(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      onClose();
    },
  });

  // Инициализация формы
  useEffect(() => {
    if (lesson) {
      const date = parseISO(lesson.dateTime);
      setFormData({
        clientId: lesson.client.id.toString(),
        dateTime: date,
        description: lesson.description || '',
        selectedLabels: lesson.labels?.map((l: any) => l.id) || [],
      });
    } else if (initialDate) {
      setFormData(prev => ({
        ...prev,
        dateTime: initialDate,
      }));
    }
  }, [lesson, initialDate]);

  const handleSubmit = async () => {
    try {
      const selectedClient = clients.find(c => c.id.toString() === formData.clientId);
      if (!selectedClient) {
        alert('Пожалуйста, выберите ученика');
        return;
      }

      // Корректное создание времени с учетом часового пояса
      const startDate = new Date(formData.dateTime);
      const endDate = new Date(startDate.getTime() + formData.duration * 60 * 1000);

      const lessonData = {
        client: { id: selectedClient.id },
        dateTime: startDate.toISOString(), // Убедитесь, что это правильный формат для вашего бекенда
        endTime: endDate.toISOString(),
        description: formData.description,
        duration: formData.duration,
        tutorTimezone,
        clientTimezone: selectedClient.timezone,
        labelIds: formData.selectedLabels,
      };

      console.log('Sending lesson data:', lessonData); // Для отладки

      if (lesson) {
        await updateMutation.mutateAsync({ id: lesson.id, data: lessonData });
      } else {
        await createMutation.mutateAsync(lessonData);
      }
    } catch (error) {
      console.error('Ошибка сохранения занятия:', error);
      alert('Произошла ошибка при сохранении занятия');
    }
  };

  const handleLabelSelect = (labelId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedLabels: prev.selectedLabels.includes(labelId)
        ? prev.selectedLabels.filter(id => id !== labelId)
        : [...prev.selectedLabels, labelId],
    }));
  };

  const selectedLabelsDetails = labels.filter(l =>
    formData.selectedLabels.includes(l.id)
  );

  const isLoading = clientsLoading || labelsLoading || createMutation.isPending || updateMutation.isPending;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">
            {lesson ? 'Редактировать занятие' : 'Создать занятие'}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            {/* Информация о текущем занятии */}
            {lesson && (
              <Alert severity="info" icon={<Schedule />}>
                <Box>
                  <Typography variant="body2">
                    Текущее занятие: {format(parseISO(lesson.dateTime), 'dd.MM.yyyy HH:mm')}
                  </Typography>
                  <Typography variant="body2">
                    Ученик: {lesson.client.name}
                  </Typography>
                  {onReschedule && (
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ mt: 1 }}
                      onClick={onReschedule}
                    >
                      Перенести занятие
                    </Button>
                  )}
                </Box>
              </Alert>
            )}

            {/* Выбор клиента */}
            <FormControl fullWidth required>
              <InputLabel>Ученик</InputLabel>
              <Select
                value={formData.clientId}
                label="Ученик"
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                startAdornment={<Person sx={{ mr: 1, color: 'action.active' }} />}
                disabled={isLoading}
              >
                <MenuItem value="">Выберите ученика</MenuItem>
                {clients.map(client => (
                  <MenuItem key={client.id} value={client.id.toString()}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography>{client.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {client.phone} • {client.timezone}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Дата и время */}
            <DateTimePicker
              label="Дата и время"
              value={formData.dateTime}
              onChange={(date) => date && setFormData({ ...formData, dateTime: date })}
              sx={{ width: '100%' }}
              ampm={false}
              disabled={isLoading}
            />
            <TextField
              label="Длительность (минуты)"
              type="number"
              value={formData.duration}
              onChange={(e) => {
                const duration = parseInt(e.target.value) || 60;
                const endTime = new Date(formData.dateTime.getTime() + duration * 60 * 1000);
                setFormData({ ...formData, duration, endTime });
              }}
              fullWidth
              InputProps={{
                endAdornment: <Typography variant="body2">мин</Typography>,
              }}
              sx={{ mb: 2 }}
            />
            <Typography variant="caption" color="text.secondary">
              Окончание: {formData.dateTime ? format(formData.endTime, 'HH:mm') : ''} ({formData.duration} минут)
            </Typography>
            {/* Метки */}
            {labels.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LabelIcon /> Метки занятия
                </Typography>

                {/* Выбранные метки */}
                {selectedLabelsDetails.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {selectedLabelsDetails.map(label => (
                      <Chip
                        key={label.id}
                        label={label.emoji ? `${label.emoji} ${label.name}` : label.name}
                        onDelete={() => handleLabelSelect(label.id)}
                        sx={{
                          bgcolor: label.color,
                          color: 'white',
                        }}
                      />
                    ))}
                  </Box>
                )}

                {/* Выбор меток */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {labels.map(label => {
                    const isSelected = formData.selectedLabels.includes(label.id);
                    return (
                      <Chip
                        key={label.id}
                        label={label.emoji ? `${label.emoji} ${label.name}` : label.name}
                        onClick={() => handleLabelSelect(label.id)}
                        variant={isSelected ? 'filled' : 'outlined'}
                        sx={{
                          bgcolor: isSelected ? label.color : 'transparent',
                          color: isSelected ? 'white' : label.color,
                          borderColor: label.color,
                        }}
                        disabled={isLoading}
                      />
                    );
                  })}
                </Box>
              </Box>
            )}

            <Divider />

            {/* Описание */}
            <TextField
              label="Описание (необязательно)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
              placeholder="Тема занятия, заметки для подготовки, домашнее задание..."
              disabled={isLoading}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Отмена
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.clientId || isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : lesson ? (
              'Сохранить'
            ) : (
              'Создать'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default EventDialog;