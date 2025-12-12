// src/components/calendar/TimeAxis.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { format } from 'date-fns';

interface TimeAxisProps {
  slotHeight: number;
}

const TimeAxis: React.FC<TimeAxisProps> = ({ slotHeight }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <Box sx={{
      width: 80,
      flexShrink: 0,
      position: 'sticky',
      left: 0,
      zIndex: 10,
      bgcolor: 'background.paper',
      borderRight: '2px solid',
      borderColor: 'divider',
    }}>
      {hours.map(hour => (
        <Box
          key={hour}
          sx={{
            height: slotHeight,
            position: 'relative',
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            pr: 1,
            pt: 0.5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 'medium',
              fontSize: '0.75rem',
            }}
          >
            {format(new Date().setHours(hour, 0, 0, 0), 'HH:mm')}
          </Typography>

          {/* Линии для 15-минутных интервалов */}
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            bgcolor: 'divider',
          }} />

          {/* Дополнительные линии для 15, 30, 45 минут */}
          {[15, 30, 45].map(minute => (
            <Box
              key={minute}
              sx={{
                position: 'absolute',
                top: `${(minute / 60) * 100}%`,
                left: 0,
                right: 0,
                height: 1,
                bgcolor: 'action.hover',
                opacity: 0.5,
              }}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default TimeAxis;