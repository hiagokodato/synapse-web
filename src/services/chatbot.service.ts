import { api } from '@/services/api'
import type {
  Chatbot,
  CreateChatbotPayload,
  UpdateChatbotPayload,
} from '@/types/chatbot'

export const chatbotService = {
  async list(): Promise<Chatbot[]> {
    const { data } = await api.get<Chatbot[]>('/chatbots')
    return data
  },

  async getById(id: string): Promise<Chatbot> {
    const { data } = await api.get<Chatbot>(`/chatbots/${id}`)
    return data
  },

  async create(payload: CreateChatbotPayload): Promise<Chatbot> {
    const { data } = await api.post<Chatbot>('/chatbots', payload)
    return data
  },

  async update(id: string, payload: UpdateChatbotPayload): Promise<Chatbot> {
    const { data } = await api.patch<Chatbot>(`/chatbots/${id}`, payload)
    return data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/chatbots/${id}`)
  },
}
