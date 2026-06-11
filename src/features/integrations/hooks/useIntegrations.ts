import { useQuery } from '@tanstack/react-query'

import { integrationService } from '@/services/integration.service'
import { queryKeys } from '@/utils/query-keys'

export function useIntegrations(chatbotId: string) {
  return useQuery({
    queryKey: queryKeys.integrations.list(chatbotId),
    queryFn: () => integrationService.list(chatbotId),
    enabled: !!chatbotId,
  })
}
