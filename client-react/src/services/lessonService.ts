import api from './api'
import { Lesson, LessonCreate } from '../types'

class LessonService {
  // Получить все занятия
  async getAllLessons(): Promise<Lesson[]> {
    const response = await api.get<Lesson[]>('/lessons')
    return response.data
  }

  // Получить занятия по неделе
  async getLessonsForWeek(weekStart: string): Promise<Lesson[]> {
    const response = await api.get<Lesson[]>(`/lessons/week?weekStart=${weekStart}`)
    return response.data
  }

  // Получить занятия по клиенту
  async getLessonsByClient(clientId: number): Promise<Lesson[]> {
    const response = await api.get<Lesson[]>(`/lessons/client/${clientId}`)
    return response.data
  }

  // Создать занятие (отправляем только clientId, а не весь объект клиента)
  async createLesson(lesson: LessonCreate): Promise<Lesson> {
    const response = await api.post<Lesson>('/lessons', lesson)
    return response.data
  }

  // Обновить занятие
  async updateLesson(id: number, lesson: Partial<LessonCreate>): Promise<Lesson> {
    const response = await api.put<Lesson>(`/lessons/${id}`, lesson)
    return response.data
  }

  // Удалить занятие
  async deleteLesson(id: number): Promise<void> {
    await api.delete(`/lessons/${id}`)
  }
}

export const lessonService = new LessonService()