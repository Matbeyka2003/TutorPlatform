// src/components/calendar/CalendarEvent.tsx
import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  AccessTime,
  Person,
  Schedule,
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { Lesson } from '../../types';

interface CalendarEventProps {
  lesson: Lesson;
  onClick: (lesson: Lesson) => void;
  tutorTimezone: string;
}

const CalendarEvent: React.FC<CalendarEventProps> = ({
  lesson,
  onClick,
  tutorTimezone,
}) => {
  const formatTime = (dateTime: string, timezone: string) => {
    try {
      return format(parseISO(dateTime), 'HH:mm', { timeZone: timezone });
    } catch {
      return format(parseISO(dateTime), 'HH:mm');
    }
  };

  const tutorTime = formatTime(lesson.dateTime, tutorTimezone);
  const clientTime = formatTime(lesson.dateTime, lesson.client.timezone);

  // Определяем цвет фона в зависимости от статусов
  const getEventStyles = () => {
    const styles: any = {
      bgcolor: 'primary.main',
      color: 'primary.contrastText',
    };

    if (lesson.isTrial) {
      styles.bgcolor = 'secondary.main';
    }

    if (!lesson.isPaid) {
      styles.borderLeft = '4px solid #ff9800';
    }

    if (lesson.requiresPreparation) {
      styles.borderTop = '3px solid #ff9800';
    }

    if (lesson.homeworkSent) {
      styles.borderBottom = '3px solid #2196f3';
    }

    return styles;
  };

  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Детали занятия
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTime fontSize="small" />
              <Typography variant="body2">
                Время ученика: {clientTime} ({lesson.client.timezone})
              </Typography>
            </Box>
            {lesson.description && (
              <Typography variant="body2">
                Описание: {lesson.description}
              </Typography>
            )}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
              {lesson.isPaid && <Chip label="Оплачено" size="small" color="success" />}
              {lesson.isTrial && <Chip label="Пробное" size="small" color="secondary" />}
              {lesson.requiresPreparation && <Chip label="Требует подготовки" size="small" color="warning" />}
              {lesson.homeworkSent && <Chip label="ДЗ отправлено" size="small" color="info" />}
            </Box>
          </Box>
        </Box>
      }
      arrow
      placement="right"
    >
      <Paper
        elevation={2}
        sx={{
          p: 1.5,
          mb: 0.5,
          cursor: 'pointer',
          minHeight: 60,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          ...getEventStyles(),
          '&:hover': {
            opacity: 0.9,
            transform: 'translateY(-1px)',
            transition: 'all 0.2s',
            boxShadow: 4,
          },
        }}
        onClick={() => onClick(lesson)}
      >
        {/* Первая строка: Время и ученик */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTime fontSize="small" />
            <Typography variant="subtitle2" fontWeight="bold">
              {tutorTime}
            </Typography>
            <Tooltip title={`Время ученика: ${clientTime}`}>
              <Typography
                variant="caption"
                sx={{
                  ml: 0.5,
                  opacity: 0.8,
                  cursor: 'help',
                  borderBottom: '1px dotted',
                }}
              >
                ({clientTime})
              </Typography>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Person fontSize="small" />
            <Typography variant="body2" fontWeight="medium" noWrap sx={{ maxWidth: 120 }}>
              {lesson.client.name}
            </Typography>
          </Box>
        </Box>

        {/* Вторая строка: Метки */}
        {lesson.labels && lesson.labels.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
            {lesson.labels.map((label, idx) => (
              <Chip
                key={label.id}
                label={label.emoji ? label.emoji : label.name}
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                  color: 'inherit',
                  fontSize: '0.7rem',
                  height: 20,
                  '& .MuiChip-label': {
                    px: 0.5,
                  },
                }}
                title={label.name}
              />
            ))}
          </Box>
        )}

        {/* Описание (если есть место) */}
        {lesson.description && (
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              opacity: 0.9,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block',
            }}
          >
            {lesson.description}
          </Typography>
        )}
      </Paper>
    </Tooltip>
  );
};

export default CalendarEvent;