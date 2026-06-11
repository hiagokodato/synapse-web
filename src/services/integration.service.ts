import { api } from '@/services/api'
import type {
  CreateIntegrationPayload,
  Integration,
  UpdateIntegrationPayload,
} from '@/types/integration'

export const integrationService = {
  async list(chatbotId: string): Promise<Integration[]> {
    const { data } = await api.get<Integration[]>(`/chatbots/${chatbotId}/integrations`)
    return data
  },

  async create(chatbotId: string, payload: CreateIntegrationPayload): Promise<Integration> {
    const { data } = await api.post<Integration>(`/chatbots/${chatbotId}/integrations`, payload)
    return data
  },

  async update(
    chatbotId: string,
    id: string,
    payload: UpdateIntegrationPayload,
  ): Promise<Integration> {
    const { data } = await api.patch<Integration>(
      `/chatbots/${chatbotId}/integrations/${id}`,
      payload,
    )
    return data
  },

  async remove(chatbotId: string, id: string): Promise<void> {
    await api.delete(`/chatbots/${chatbotId}/integrations/${id}`)
  },

  async registerTelegramWebhook(chatbotId: string, id: string): Promise<{ url: string }> {
    const { data } = await api.post<{ url: string }>(
      `/chatbots/${chatbotId}/integrations/${id}/telegram/webhook`,
      {},
    )
    return data
  },
}
