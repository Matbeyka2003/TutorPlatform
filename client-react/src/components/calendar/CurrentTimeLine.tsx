// src/components/calendar/CurrentTimeLine.tsx
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

interface CurrentTimeLineProps {
  slotHeight: number;
}

const CurrentTimeLine: React.FC<CurrentTimeLineProps> = ({ slotHeight }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Обновлять каждую минуту

    return () => clearInterval(interval);
  }, []);

  // Рассчитываем позицию линии
  const getLinePosition = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    return (hours + minutes / 60) * slotHeight;
  };

  const position = getLinePosition();

  return (
    <Box
      sx={{
        position: 'absolute',
        top: position,
        left: 80, // Отступ для оси времени
        right: 0,
        height: '2px',
        bgcolor: 'error.main',
        zIndex: 1000,
        pointerEvents: 'none',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: -4,
          top: -3,
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: 'error.main',
        },
      }}
    />
  );
};

export default CurrentTimeLine;