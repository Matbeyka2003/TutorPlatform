import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material'
import { Login as LoginIcon, PersonAdd } from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)

  // Исправлено: правильный синтаксис деструктуризации
  const { user, error: authError, login, register, clearError } = useAuth()

  useEffect(() => {
    clearError()
  }, [isLogin]) // remove clearError from dependencies

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setLoading(true)

    try {
      let success
      if (isLogin) {
        success = await login(username, password)
      } else {
        success = await register(username, password)
      }

      if (success) {
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
            {isLogin ? 'Вход в Tutor Scheduler' : 'Регистрация'}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            {isLogin
              ? 'Система управления онлайн-репетиторством'
              : 'Создайте новый аккаунт'}
          </Typography>

          {authError && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {authError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Имя пользователя"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={isLogin ? <LoginIcon /> : <PersonAdd />}
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isLogin ? (
                'Войти'
              ) : (
                'Зарегистрироваться'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <MuiLink
                component="button"
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                sx={{ cursor: 'pointer' }}
              >
                {isLogin
                  ? 'Нет аккаунта? Зарегистрироваться'
                  : 'Уже есть аккаунт? Войти'}
              </MuiLink>
            </Box>
          </Box>

          {/* Тестовые учетные данные */}
          <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1, width: '100%' }}>
            <Typography variant="body2" color="text.secondary">
              Для тестирования используйте:
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              Логин: tutor
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              Пароль: password123
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default LoginPage