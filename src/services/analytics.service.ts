import { api } from '@/services/api'
import type { ChatbotAnalytics, OverviewAnalytics } from '@/types/analytics'

export const analyticsService = {
  async getOverview(): Promise<OverviewAnalytics> {
    const { data } = await api.get<OverviewAnalytics>('/analytics/overview')
    return data
  },

  async getChatbotAnalytics(chatbotId: string, days = 7): Promise<ChatbotAnalytics> {
    const { data } = await api.get<ChatbotAnalytics>(`/chatbots/${chatbotId}/analytics`, {
      params: { days },
    })
    return data
  },
}
