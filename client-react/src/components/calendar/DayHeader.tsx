// src/components/calendar/DayHeader.tsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { format, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';

interface DayHeaderProps {
  date: Date;
  isCurrent?: boolean;
}

const DayHeader: React.FC<DayHeaderProps> = ({ date, isCurrent = false }) => {
  const isTodayDate = isToday(date);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        textAlign: 'center',
        borderBottom: '2px solid',
        borderColor: isCurrent ? 'primary.main' : 'transparent',
        bgcolor: isTodayDate ? 'primary.light' : 'transparent',
        color: isTodayDate ? 'primary.contrastText' : 'inherit',
      }}
    >
      <Typography variant="subtitle2" fontWeight="bold">
        {format(date, 'EEE', { locale: ru })}
      </Typography>
      <Typography
        variant="h6"
        fontWeight={isTodayDate ? 'bold' : 'normal'}
        sx={{ mt: 0.5 }}
      >
        {format(date, 'd')}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {format(date, 'MMM', { locale: ru })}
      </Typography>
    </Paper>
  );
};

export default DayHeader;