import axios from 'axios'

// Базовый URL для API (Vite proxy настроен на 8080 порт)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Важно для сессий и CORS
})

// Interceptor для логирования запросов
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
    if (config.data) {
      console.log('[Request Data]:', config.data)
    }
    return config
  },
  (error) => {
    console.error('[API Request Error]:', error)
    return Promise.reject(error)
  }
)

// Interceptor для логирования ответов и ошибок
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`)
    console.log('[Response Data]:', response.data)
    return response
  },
  (error) => {
    console.error('[API Response Error]:', error)

    if (error.response) {
      console.error('Error Status:', error.response.status)
      console.error('Error Data:', error.response.data)
      console.error('Error Headers:', error.response.headers)
    } else if (error.request) {
      console.error('No response received:', error.request)
    } else {
      console.error('Error setting up request:', error.message)
    }

    return Promise.reject(error)
  }
)

export default api