import { api } from '@/services/api'
import type {
  Conversation,
  ConversationDetail,
  CreateConversationPayload,
  Message,
  SendMessagePayload,
  UpdateConversationPayload,
} from '@/types/conversation'

export const conversationService = {
  async list(chatbotId: string): Promise<Conversation[]> {
    const { data } = await api.get<Conversation[]>(`/chatbots/${chatbotId}/conversations`)
    return data
  },

  async getById(chatbotId: string, conversationId: string): Promise<ConversationDetail> {
    const { data } = await api.get<ConversationDetail>(
      `/chatbots/${chatbotId}/conversations/${conversationId}`,
    )
    return data
  },

  async create(chatbotId: string, payload: CreateConversationPayload = {}): Promise<Conversation> {
    const { data } = await api.post<Conversation>(
      `/chatbots/${chatbotId}/conversations`,
      payload,
    )
    return data
  },

  async update(
    chatbotId: string,
    conversationId: string,
    payload: UpdateConversationPayload,
  ): Promise<Conversation> {
    const { data } = await api.patch<Conversation>(
      `/chatbots/${chatbotId}/conversations/${conversationId}`,
      payload,
    )
    return data
  },

  async listMessages(chatbotId: string, conversationId: string): Promise<Message[]> {
    const { data } = await api.get<Message[]>(
      `/chatbots/${chatbotId}/conversations/${conversationId}/messages`,
    )
    return data
  },

  async sendMessage(
    chatbotId: string,
    conversationId: string,
    payload: SendMessagePayload,
  ): Promise<Message> {
    const { data } = await api.post<Message>(
      `/chatbots/${chatbotId}/conversations/${conversationId}/messages`,
      payload,
    )
    return data
  },
}
