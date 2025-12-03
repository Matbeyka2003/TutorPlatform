import api from './api'
import { User } from '../types'

class AuthService {
  async login(username: string, password: string): Promise<User> {
    const response = await api.post<User>('/auth/login', { username, password })
    // Сохраняем ID пользователя для использования в запросах
    localStorage.setItem('currentUserId', response.data.id.toString())
    return response.data
  }

  async register(username: string, password: string): Promise<User> {
    const response = await api.post<User>('/auth/register', { username, password })
    localStorage.setItem('currentUserId', response.data.id.toString())
    return response.data
  }

  async logout(): Promise<void> {
    // Очищаем локальное хранилище
    localStorage.removeItem('currentUserId')
    // Можно добавить вызов API логаута, если он есть
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      // В вашем бэкенде нет /auth/me эндпоинта, так что получаем из localStorage
      const userId = localStorage.getItem('currentUserId')
      if (!userId) return null

      // Если нужно получать данные пользователя, нужно создать эндпоинт
      return {
        id: parseInt(userId),
        username: localStorage.getItem('username') || 'User',
        timezone: 'Europe/Moscow',
      }
    } catch (error) {
      console.error('Failed to get current user:', error)
      return null
    }
  }
}

export const authService = new AuthService()