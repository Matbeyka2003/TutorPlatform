// src/services/labelService.ts
import api from './api'
import { Label } from '../types'

class LabelService {
  // Получить все метки
  async getAllLabels(): Promise<Label[]> {
    const response = await api.get<Label[]>('/labels')
    return response.data
  }

  // Создать метку
  async createLabel(label: Omit<Label, 'id'>): Promise<Label> {
    const response = await api.post<Label>('/labels', label)
    return response.data
  }

  // Обновить метку
  async updateLabel(id: number, label: Partial<Label>): Promise<Label> {
    const response = await api.put<Label>(`/labels/${id}`, label)
    return response.data
  }

  // Удалить метку
  async deleteLabel(id: number): Promise<void> {
    await api.delete(`/labels/${id}`)
  }

  // Добавить метку к занятию
  async addLabelToLesson(lessonId: number, labelId: number): Promise<void> {
    await api.post(`/lessons/${lessonId}/labels/${labelId}`)
  }

  // Удалить метку с занятия
  async removeLabelFromLesson(lessonId: number, labelId: number): Promise<void> {
    await api.delete(`/lessons/${lessonId}/labels/${labelId}`)
  }

  // Обновить статусы занятия
  async updateLessonStatus(
    lessonId: number,
    status: {
      isPaid?: boolean
      requiresPreparation?: boolean
      homeworkSent?: boolean
      isTrial?: boolean
    }
  ): Promise<void> {
    await api.patch(`/lessons/${lessonId}/status`, status)
  }
}

export const labelService = new LabelService()