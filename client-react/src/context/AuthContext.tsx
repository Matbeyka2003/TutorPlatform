import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService, UserDto } from '../services/auth'

interface AuthContextType {
  user: UserDto | null
  loading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  register: (username: string, password: string) => Promise<boolean>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const userData = await authService.getCurrentUser()
      if (userData) {
        setUser(userData)
        localStorage.setItem('user_data', JSON.stringify(userData))
      }
    } catch (error) {
      console.log('No active session')
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const userData = await authService.login(username, password)
      if (userData) {
        setUser(userData)
        localStorage.setItem('user_data', JSON.stringify(userData))
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Ошибка авторизации')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setError(null)
    authService.logout()
  }

  const register = async (username: string, password: string): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      const userData = await authService.register(username, password)
      if (userData) {
        setUser(userData)
        localStorage.setItem('user_data', JSON.stringify(userData))
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации')
      return false
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        register,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}