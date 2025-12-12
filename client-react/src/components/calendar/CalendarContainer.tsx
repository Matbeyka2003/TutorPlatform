import React, { useRef, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { CALENDAR_CONFIG } from './CalendarConfig';

interface CalendarContainerProps {
  children: React.ReactNode;
  onResize?: (dimensions: { width: number; height: number }) => void;
}

const CalendarContainer: React.FC<CalendarContainerProps> = ({
  children,
  onResize,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const newDimensions = {
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        };
        setDimensions(newDimensions);
        onResize?.(newDimensions);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, [onResize]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          padding: `${CALENDAR_CONFIG.padding.top}px ${CALENDAR_CONFIG.padding.right}px ${CALENDAR_CONFIG.padding.bottom}px ${CALENDAR_CONFIG.padding.left}px`,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default CalendarContainer;