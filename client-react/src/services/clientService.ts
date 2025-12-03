import api from './api'
import { Client } from '../types'

class ClientService {
  // Получить всех клиентов
  async getAllClients(): Promise<Client[]> {
    const response = await api.get<Client[]>('/clients')
    return response.data
  }

  // Получить клиента по ID
  async getClientById(id: number): Promise<Client> {
    const response = await api.get<Client>(`/clients/${id}`)
    return response.data
  }

  // Создать нового клиента
  async createClient(client: Omit<Client, 'id'>): Promise<Client> {
    const response = await api.post<Client>('/clients', client)
    return response.data
  }

  // Обновить клиента
  async updateClient(id: number, client: Partial<Client>): Promise<Client> {
    const response = await api.put<Client>(`/clients/${id}`, client)
    return response.data
  }

  // Удалить клиента
  async deleteClient(id: number): Promise<void> {
    await api.delete(`/clients/${id}`)
  }

  // Поиск клиентов по имени
  async searchClients(name: string): Promise<Client[]> {
    const response = await api.get<Client[]>(`/clients/search?name=${encodeURIComponent(name)}`)
    return response.data
  }
}

export const clientService = new ClientService()