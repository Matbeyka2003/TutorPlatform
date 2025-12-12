// src/pages/SettingsPage.tsx - финальная версия
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Label as LabelIcon,
  Backup as BackupIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import LabelManager from '../components/LabelManager';
import GeneralSettings from '../components/settings/GeneralSettings';
import BackupSettings from '../components/settings/BackupSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import { useAuth } from '../context/AuthContext';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      label: 'Основные',
      icon: <SettingsIcon />,
      component: <GeneralSettings />
    },
    {
      label: 'Метки',
      icon: <LabelIcon />,
      component: <LabelManager />
    },
    {
      label: 'Резервные копии',
      icon: <BackupIcon />,
      component: <BackupSettings />
    },
    {
      label: 'Уведомления',
      icon: <NotificationsIcon />,
      component: <NotificationSettings />
    },
  ];

  if (!user) {
    return (
      <Alert severity="warning">
        Для доступа к настройкам необходимо войти в систему
      </Alert>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Настройки
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: 3,
            '& .MuiTab-root': {
              textTransform: 'none',
              minHeight: 48,
            }
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {tabs[activeTab].component}
        </Box>
      </Paper>
    </Box>
  );
};

export default SettingsPage;