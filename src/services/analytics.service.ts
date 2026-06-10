import { api } from '@/services/api'
import type { OverviewAnalytics } from '@/types/analytics'

export const analyticsService = {
  async getOverview(): Promise<OverviewAnalytics> {
    const { data } = await api.get<OverviewAnalytics>('/analytics/overview')
    return data
  },
}
