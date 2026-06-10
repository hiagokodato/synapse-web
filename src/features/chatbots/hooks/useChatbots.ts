import { useQuery } from '@tanstack/react-query'

import { chatbotService } from '@/services/chatbot.service'
import { queryKeys } from '@/utils/query-keys'

export function useChatbots() {
  return useQuery({
    queryKey: queryKeys.chatbots.all,
    queryFn: chatbotService.list,
  })
}

export function useChatbot(id: string) {
  return useQuery({
    queryKey: queryKeys.chatbots.detail(id),
    queryFn: () => chatbotService.getById(id),
    enabled: !!id,
  })
}
