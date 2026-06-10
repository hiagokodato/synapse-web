import { useQuery } from '@tanstack/react-query'

import { flowService } from '@/services/flow.service'
import { queryKeys } from '@/utils/query-keys'

export function useFlows(chatbotId: string) {
  return useQuery({
    queryKey: queryKeys.flows.list(chatbotId),
    queryFn: () => flowService.list(chatbotId),
    enabled: !!chatbotId,
  })
}

export function useFlow(chatbotId: string, flowId: string) {
  return useQuery({
    queryKey: queryKeys.flows.detail(chatbotId, flowId),
    queryFn: () => flowService.getById(chatbotId, flowId),
    enabled: !!chatbotId && !!flowId,
  })
}
