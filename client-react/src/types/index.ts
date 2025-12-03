// Типы, соответствующие бэкенду DTO
export interface User {
  id: number
  username: string
  timezone: string
  telegramChatId?: string
}

export interface Client {
  id: number
  name: string
  phone: string
  timezone: string
  city?: string
  description?: string
  lessonPrice?: number
}
export interface Label {
  id: number
  name: string
  color: string // HEX цвет, например: "#FF5733"
  emoji?: string // Опциональный эмодзи, например: "🔥"
}
export interface Lesson {
  id: number
  dateTime: string
  description?: string
  isPaid: boolean
  requiresPreparation: boolean
  homeworkSent: boolean
  isTrial: boolean
  client: Client
  labels: Label[]
  tutorTimezone?: string
  clientTimezone?: string
}

export interface LessonCreate {
  client: { id: number }
  dateTime: string
  description?: string
  isPaid: boolean
  requiresPreparation?: boolean
  homeworkSent?: boolean
  isTrial?: boolean
  labels?: { id: number }[]
  tutorTimezone?: string
  clientTimezone?: string
}

export interface Lesson extends LessonCreate {
  id: number
  client: Client
}

export interface Label {
  id: number
  name: string
  color: string
}

export interface AuthRequest {
  username: string
  password: string
}

