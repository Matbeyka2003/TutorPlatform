// src/components/settings/GeneralSettings.tsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const GeneralSettings: React.FC = () => {
  const { user } = useAuth();
  const [timezone, setTimezone] = useState(user?.timezone || 'Europe/Moscow');
  const [saved, setSaved] = useState(false);

  const timezones = [
    'Europe/Moscow',
    'Europe/London',
    'Europe/Berlin',
    'America/New_York',
    'Asia/Tokyo',
    'Asia/Almaty',
    'Europe/Samara',
  ];

  const handleSave = () => {
    // TODO: Реализовать сохранение через API
    console.log('Сохранение настроек:', { timezone });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box sx={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {saved && (
        <Alert severity="success" onClose={() => setSaved(false)}>
          Настройки сохранены
        </Alert>
      )}

      <FormControl fullWidth>
        <InputLabel>Часовой пояс преподавателя</InputLabel>
        <Select
          value={timezone}
          label="Часовой пояс преподавателя"
          onChange={(e) => setTimezone(e.target.value)}
        >
          {timezones.map((tz) => (
            <MenuItem key={tz} value={tz}>
              {tz}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Путь для резервных копий"
        defaultValue="./backups"
        fullWidth
        helperText="Относительный или абсолютный путь к папке с резервными копиями"
      />

      <TextField
        label="Часы работы (начало)"
        type="time"
        defaultValue="09:00"
        InputLabelProps={{ shrink: true }}
        fullWidth
      />

      <TextField
        label="Часы работы (конец)"
        type="time"
        defaultValue="21:00"
        InputLabelProps={{ shrink: true }}
        fullWidth
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Сохранить настройки
        </Button>
      </Box>
    </Box>
  );
};

export default GeneralSettings;