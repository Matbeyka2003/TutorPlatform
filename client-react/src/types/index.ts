export interface Lesson {
  id: number
  dateTime: string
  endTime?: string // Добавляем время окончания
  durationMinutes?: number  // Добавлено
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
  endTime?: string // Добавляем
  durationMinutes?: number  // Добавлено
  description?: string
  isPaid: boolean
  requiresPreparation?: boolean
  homeworkSent?: boolean
  isTrial?: boolean
  labels?: { id: number }[]
  tutorTimezone?: string
  clientTimezone?: string
}