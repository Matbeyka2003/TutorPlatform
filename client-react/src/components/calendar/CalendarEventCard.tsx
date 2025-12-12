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
import { format, parseISO, differenceInMinutes } from 'date-fns';
import { Lesson } from '../../types';
import { useTheme } from '@mui/material/styles';

interface CalendarEventCardProps {
  lesson: Lesson;
  onClick: (lesson: Lesson) => void;
  tutorTimezone: string;
  getStudentTime: (date: Date, timezone: string) => string;
}

const CalendarEventCard: React.FC<CalendarEventCardProps> = ({
  lesson,
  onClick,
  tutorTimezone,
  getStudentTime,
}) => {
  const theme = useTheme();

  // Парсим время
  const startTime = parseISO(lesson.dateTime);
  const endTime = lesson.endTime ? parseISO(lesson.endTime) :
    new Date(startTime.getTime() + 60 * 60 * 1000); // По умолчанию 1 час

  // Рассчитываем длительность
  const durationMinutes = differenceInMinutes(endTime, startTime);
  const durationText = durationMinutes >= 60
    ? `${Math.floor(durationMinutes / 60)}ч ${durationMinutes % 60}м`
    : `${durationMinutes}м`;

  // Время для отображения
  const tutorStartTime = format(startTime, 'HH:mm');
  const tutorEndTime = format(endTime, 'HH:mm');
  const studentStartTime = getStudentTime(startTime, lesson.client.timezone);
  const studentEndTime = getStudentTime(endTime, lesson.client.timezone);

  // Определяем цвет только для границы
  const getBorderColor = () => {
    if (lesson.isTrial) return theme.palette.secondary.main;
    if (lesson.isPaid) return theme.palette.success.main;
    return theme.palette.warning.main;
  };

  // Фон карточки - нейтральный, не меняется
  const backgroundColor = theme.palette.grey[50];

  return (
    <Tooltip
      title={
        <Box sx={{ p: 1, maxWidth: 300 }}>
          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
            Детали занятия
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* Время */}
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Время репетитора:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime fontSize="small" />
                <Typography variant="body2" fontWeight="medium">
                  {tutorStartTime} - {tutorEndTime} ({durationText})
                </Typography>
              </Box>

              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                Время ученика ({lesson.client.timezone}):
              </Typography>
              <Typography variant="body2">
                {studentStartTime} - {studentEndTime}
              </Typography>
            </Box>

            {/* Ученик */}
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Ученик:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person fontSize="small" />
                <Typography variant="body2" fontWeight="medium">
                  {lesson.client.name}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {lesson.client.phone}
              </Typography>
            </Box>

            {/* Описание */}
            {lesson.description && (
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Описание:
                </Typography>
                <Typography variant="body2">
                  {lesson.description}
                </Typography>
              </Box>
            )}

            {/* Метки */}
            {lesson.labels && lesson.labels.length > 0 && (
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Метки:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                  {lesson.labels.map((label) => (
                    <Chip
                      key={label.id}
                      label={label.emoji ? `${label.emoji} ${label.name}` : label.name}
                      size="small"
                      sx={{
                        bgcolor: label.color,
                        color: 'white',
                        fontSize: '0.65rem',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Статусы */}
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Статусы:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                {lesson.isPaid && <Chip label="Оплачено" size="small" color="success" />}
                {lesson.isTrial && <Chip label="Пробное" size="small" color="secondary" />}
                {lesson.requiresPreparation && <Chip label="Требует подготовки" size="small" color="warning" />}
                {lesson.homeworkSent && <Chip label="ДЗ отправлено" size="small" color="info" />}
              </Box>
            </Box>
          </Box>
        </Box>
      }
      arrow
      placement="right"
      PopperProps={{
        sx: {
          '& .MuiTooltip-tooltip': {
            bgcolor: 'background.paper',
            color: 'text.primary',
            boxShadow: theme.shadows[3],
            border: `1px solid ${theme.palette.divider}`,
          },
        },
      }}
    >
      <Paper
        elevation={0}
        onClick={() => onClick(lesson)}
        sx={{
          p: 1,
          height: '100%',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          bgcolor: backgroundColor,
          border: `1px solid ${theme.palette.divider}`,
          borderLeft: `3px solid ${getBorderColor()}`,
          borderRadius: 1,
          overflow: 'hidden',
          '&:hover': {
            bgcolor: theme.palette.action.hover,
            transform: 'translateY(-1px)',
            transition: 'all 0.2s',
            boxShadow: theme.shadows[1],
          },
        }}
      >
        {/* Время репетитора (крупно) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <AccessTime fontSize="small" sx={{ fontSize: '0.8rem' }} />
          <Typography
            variant="caption"
            fontWeight="bold"
            sx={{ fontSize: '0.75rem' }}
          >
            {tutorStartTime}
          </Typography>
        </Box>

        {/* Время ученика (мелко) */}
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.65rem',
            opacity: 0.7,
            lineHeight: 1,
            mb: 0.5,
          }}
        >
          {studentStartTime}
        </Typography>

        {/* Имя ученика */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <Person fontSize="small" sx={{ fontSize: '0.8rem' }} />
          <Typography
            variant="caption"
            fontWeight="medium"
            sx={{
              fontSize: '0.75rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {lesson.client.name.split(' ')[0]} {/* Только имя */}
          </Typography>
        </Box>

        {/* Метки */}
        {lesson.labels && lesson.labels.length > 0 && (
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.25,
            mt: 'auto',
          }}>
            {lesson.labels.slice(0, 3).map((label, index) => (
              <Box
                key={label.id}
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: label.color,
                  border: `1px solid ${theme.palette.background.paper}`,
                }}
                title={label.emoji ? `${label.emoji} ${label.name}` : label.name}
              />
            ))}
            {lesson.labels.length > 3 && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.6rem',
                  opacity: 0.6,
                  ml: 0.25,
                }}
              >
                +{lesson.labels.length - 3}
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </Tooltip>
  );
};

export default CalendarEventCard;