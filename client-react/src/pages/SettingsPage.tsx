import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Slider,
} from '@mui/material'
import {
  Save as SaveIcon,
  Backup as BackupIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'

const SettingsPage: React.FC = () => {
  const { user } = useAuth()
  const [settings, setSettings] = useState({
    timezone: user?.timezone || 'Europe/Moscow',
    telegramNotifications: true,
    emailNotifications: false,
    backupRetention: 14,
    autoBackup: true,
  })

  const timezones = [
    'Europe/Moscow',
    'Europe/London',
    'Europe/Berlin',
    'America/New_York',
    'Asia/Tokyo',
    'Australia/Sydney',
  ]

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    console.log('Saving settings:', settings)
    // Реализовать сохранение настроек
  }

  const handleBackup = () => {
    console.log('Creating backup')
    // Реализовать создание бэкапа
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Настройки
      </Typography>

      <Grid container spacing={3}>
        {/* Основные настройки */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LanguageIcon /> Часовой пояс
            </Typography>

            <FormControl fullWidth sx={{ mt: 2, mb: 3 }}>
              <InputLabel>Часовой пояс преподавателя</InputLabel>
              <Select
                value={settings.timezone}
                label="Часовой пояс преподавателя"
                onChange={(e) => handleSettingChange('timezone', e.target.value)}
              >
                {timezones.map((tz) => (
                  <MenuItem key={tz} value={tz}>
                    {tz}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotificationsIcon /> Уведомления
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.telegramNotifications}
                  onChange={(e) => handleSettingChange('telegramNotifications', e.target.checked)}
                />
              }
              label="Telegram уведомления"
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                />
              }
              label="Email уведомления"
            />
          </Paper>
        </Grid>

        {/* Настройки бэкапа */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BackupIcon /> Резервное копирование
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoBackup}
                  onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                />
              }
              label="Автоматическое ежедневное резервное копирование"
              sx={{ mb: 3 }}
            />

            <Typography variant="body2" gutterBottom>
              Срок хранения бэкапов: {settings.backupRetention} дней
            </Typography>

            <Slider
              value={settings.backupRetention}
              onChange={(_, value) => handleSettingChange('backupRetention', value)}
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

            <Button
              variant="contained"
              startIcon={<BackupIcon />}
              onClick={handleBackup}
              fullWidth
            >
              Создать бэкап сейчас
            </Button>
          </Paper>
        </Grid>

        {/* Безопасность */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon /> Безопасность
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              Для изменения пароля обратитесь к администратору системы
            </Alert>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setSettings({
                  timezone: 'Europe/Moscow',
                  telegramNotifications: true,
                  emailNotifications: false,
                  backupRetention: 14,
                  autoBackup: true,
                })}
              >
                Сбросить
              </Button>

              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                Сохранить настройки
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SettingsPage