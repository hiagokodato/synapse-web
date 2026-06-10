import { useQuery } from '@tanstack/react-query'

import { analyticsService } from '@/services/analytics.service'
import { queryKeys } from '@/utils/query-keys'

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: queryKeys.analytics.overview,
    queryFn: analyticsService.getOverview,
  })
}

export function useChatbotAnalytics(chatbotId: string, days: number) {
  return useQuery({
    queryKey: queryKeys.analytics.chatbot(chatbotId, days),
    queryFn: () => analyticsService.getChatbotAnalytics(chatbotId, days),
    enabled: !!chatbotId,
  })
}
