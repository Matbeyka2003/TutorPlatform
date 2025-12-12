// src/components/settings/NotificationSettings.tsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Typography,
  Divider,
} from '@mui/material';
import {
  Send as SendIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

const NotificationSettings: React.FC = () => {
  const [telegramEnabled, setTelegramEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [telegramToken, setTelegramToken] = useState('');
  const [testMessage, setTestMessage] = useState('');

  const handleTestNotification = () => {
    // TODO: Реализовать тестовое уведомление
    console.log('Отправка тестового уведомления:', testMessage);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Alert severity="info">
        Для работы уведомлений через Telegram необходимо создать бота через @BotFather
      </Alert>

      <Box>
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NotificationsIcon /> Настройки уведомлений
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={telegramEnabled}
              onChange={(e) => setTelegramEnabled(e.target.checked)}
            />
          }
          label="Telegram уведомления"
          sx={{ mb: 2 }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={emailEnabled}
              onChange={(e) => setEmailEnabled(e.target.checked)}
            />
          }
          label="Email уведомления"
        />
      </Box>

      {telegramEnabled && (
        <>
          <Divider />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Настройки Telegram
            </Typography>

            <TextField
              label="Telegram Bot Token"
              value={telegramToken}
              onChange={(e) => setTelegramToken(e.target.value)}
              fullWidth
              type="password"
              helperText="Получите у @BotFather"
              sx={{ mb: 3 }}
            />

            <Typography variant="body2" color="text.secondary" gutterBottom>
              Chat ID преподавателя будет сохранен автоматически после первого сообщения боту
            </Typography>
          </Box>
        </>
      )}

      <Divider />

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Тестирование уведомлений
        </Typography>

        <TextField
          label="Тестовое сообщение"
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          placeholder="Привет! Это тестовое уведомление"
        />

        <Button
          variant="outlined"
          startIcon={<SendIcon />}
          onClick={handleTestNotification}
          disabled={!telegramEnabled || !telegramToken}
        >
          Отправить тестовое уведомление
        </Button>
      </Box>
    </Box>
  );
};

export default NotificationSettings;