import React from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  LinearProgress,
} from '@mui/material'
import {
  CalendarToday,
  People,
  AttachMoney,
  AccessTime,
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'

const DashboardPage: React.FC = () => {
  const { user } = useAuth()

  // Заглушки для данных (позже заменим на реальные)
  const stats = {
    totalClients: 12,
    upcomingLessons: 5,
    monthlyIncome: 45000,
    lessonCompletion: 85,
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Добро пожаловать, {user?.username}!
      </Typography>

      <Grid container spacing={3}>
        {/* Статистика по клиентам */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <People />
                </Avatar>
                <Typography variant="h6">Клиенты</Typography>
              </Box>
              <Typography variant="h3">{stats.totalClients}</Typography>
              <Typography variant="body2" color="text.secondary">
                Всего учеников
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Предстоящие занятия */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <CalendarToday />
                </Avatar>
                <Typography variant="h6">Занятия</Typography>
              </Box>
              <Typography variant="h3">{stats.upcomingLessons}</Typography>
              <Typography variant="body2" color="text.secondary">
                Сегодня
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Доход */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <AttachMoney />
                </Avatar>
                <Typography variant="h6">Доход</Typography>
              </Box>
              <Typography variant="h3">
                {stats.monthlyIncome.toLocaleString()} ₽
              </Typography>
              <Typography variant="body2" color="text.secondary">
                За месяц
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Прогресс */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <AccessTime />
                </Avatar>
                <Typography variant="h6">Выполнение</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={stats.lessonCompletion}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">
                    {`${Math.round(stats.lessonCompletion)}%`}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Занятий проведено
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Блок с ближайшими занятиями */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ближайшие занятия
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Здесь будет список ближайших занятий...
            </Typography>
          </Paper>
        </Grid>

        {/* Блок с активностью */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Последняя активность
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Здесь будет история действий...
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardPage