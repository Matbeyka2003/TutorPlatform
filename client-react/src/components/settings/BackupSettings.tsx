// src/components/settings/BackupSettings.tsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Slider,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  Backup as BackupIcon,
  Restore as RestoreIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const BackupSettings: React.FC = () => {
  const [retentionDays, setRetentionDays] = useState(14);
  const [backupPath, setBackupPath] = useState('./backups');

  // Заглушка для списка бэкапов
  const backups = [
    { id: 1, date: '2024-01-20 23:59', size: '2.4 MB', type: 'Полный' },
    { id: 2, date: '2024-01-19 23:59', size: '2.3 MB', type: 'Полный' },
    { id: 3, date: '2024-01-18 23:59', size: '1.8 MB', type: 'CSV' },
  ];

  const handleBackup = () => {
    // TODO: Реализовать создание бэкапа
    console.log('Создание бэкапа');
  };

  const handleRestore = (id: number) => {
    // TODO: Реализовать восстановление
    console.log('Восстановление бэкапа:', id);
  };

  const handleDelete = (id: number) => {
    // TODO: Реализовать удаление
    console.log('Удаление бэкапа:', id);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Alert severity="info">
        Бэкапы создаются автоматически каждый день в 23:59
      </Alert>

      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Настройки бэкапов
        </Typography>

        <TextField
          label="Путь для сохранения бэкапов"
          value={backupPath}
          onChange={(e) => setBackupPath(e.target.value)}
          fullWidth
          sx={{ mb: 3 }}
        />

        <Typography gutterBottom>
          Срок хранения бэкапов: {retentionDays} дней
        </Typography>

        <Slider
          value={retentionDays}
          onChange={(_, value) => setRetentionDays(value as number)}
          min={1}
          max={30}
          marks={[
            { value: 1, label: '1' },
            { value: 7, label: '7' },
            { value: 14, label: '14' },
            { value: 30, label: '30' },
          ]}
          valueLabelDisplay="auto"
          sx={{ mb: 3 }}
        />
      </Box>

      <Button
        variant="contained"
        startIcon={<BackupIcon />}
        onClick={handleBackup}
        sx={{ alignSelf: 'flex-start' }}
      >
        Создать бэкап сейчас
      </Button>

      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Существующие бэкапы
        </Typography>

        <List>
          {backups.map(backup => (
            <ListItem
              key={backup.id}
              secondaryAction={
                <Box>
                  <IconButton onClick={() => handleRestore(backup.id)}>
                    <RestoreIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(backup.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={`Бэкап от ${backup.date}`}
                secondary={`${backup.type} • ${backup.size}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default BackupSettings;