import { useQuery } from '@tanstack/react-query'

import { conversationService } from '@/services/conversation.service'
import { queryKeys } from '@/utils/query-keys'

export function useConversations(chatbotId: string) {
  return useQuery({
    queryKey: queryKeys.conversations.list(chatbotId),
    queryFn: () => conversationService.list(chatbotId),
    enabled: !!chatbotId,
  })
}

export function useConversation(chatbotId: string, conversationId: string) {
  return useQuery({
    queryKey: queryKeys.conversations.detail(chatbotId, conversationId),
    queryFn: () => conversationService.getById(chatbotId, conversationId),
    enabled: !!chatbotId && !!conversationId,
  })
}
