// src/components/calendar/CalendarHeader.tsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  ViewWeek,
  CalendarViewDay,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarViewMode } from '../../types/calendar';

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: CalendarViewMode;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewModeChange: (mode: CalendarViewMode) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  viewMode,
  onPrev,
  onNext,
  onToday,
  onViewModeChange,
}) => {
  const getHeaderText = () => {
    if (viewMode === 'day') {
      return format(currentDate, 'dd MMMM yyyy', { locale: ru });
    }

    const weekStart = new Date(currentDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    return `${format(weekStart, 'dd MMM', { locale: ru })} - ${format(weekEnd, 'dd MMM yyyy', { locale: ru })}`;
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 2,
      p: 2,
      bgcolor: 'background.paper',
      borderRadius: 1,
    }}>
      <Typography variant="h5" fontWeight="bold">
        {getHeaderText()}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <ButtonGroup variant="outlined" size="small">
          <Button
            startIcon={<CalendarViewDay />}
            variant={viewMode === 'day' ? 'contained' : 'outlined'}
            onClick={() => onViewModeChange('day')}
          >
            День
          </Button>
          <Button
            startIcon={<ViewWeek />}
            variant={viewMode === 'week' ? 'contained' : 'outlined'}
            onClick={() => onViewModeChange('week')}
          >
            Неделя
          </Button>
        </ButtonGroup>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Предыдущий">
            <IconButton onClick={onPrev}>
              <ChevronLeft />
            </IconButton>
          </Tooltip>

          <Button
            variant="outlined"
            startIcon={<Today />}
            onClick={onToday}
          >
            Сегодня
          </Button>

          <Tooltip title="Следующий">
            <IconButton onClick={onNext}>
              <ChevronRight />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default CalendarHeader;