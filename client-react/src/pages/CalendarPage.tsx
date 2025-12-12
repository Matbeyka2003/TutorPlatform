import React from 'react';
import { Box, Alert, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import EnhancedCalendar from '../components/calendar/EnhancedCalendar';
import { clientService } from '../services/clientService';

const CalendarPage: React.FC = () => {
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getAllClients(),
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Ошибка загрузки данных: {(error as Error).message}
      </Alert>
    );
  }

  if (clients.length === 0) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        Сначала добавьте клиентов, чтобы создавать занятия
      </Alert>
    );
  }

  return (
    <Box sx={{
      width: '100%',
      height: 'calc(100vh - 160px)', // Учитываем высоту шапки
      minHeight: '600px',
    }}>
      <EnhancedCalendar />
    </Box>
  );
};

export default CalendarPage;