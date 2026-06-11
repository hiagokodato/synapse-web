export const queryKeys = {
  auth: {
    me: (token: string | null) => ['auth', 'me', token] as const,
  },
  chatbots: {
    all: ['chatbots'] as const,
    detail: (id: string) => ['chatbots', id] as const,
  },
  analytics: {
    overview: ['analytics', 'overview'] as const,
    chatbot: (chatbotId: string, days: number) =>
      ['analytics', 'chatbot', chatbotId, days] as const,
  },
  flows: {
    list: (chatbotId: string) => ['flows', chatbotId] as const,
    detail: (chatbotId: string, flowId: string) => ['flows', chatbotId, flowId] as const,
  },
  integrations: {
    list: (chatbotId: string) => ['integrations', chatbotId] as const,
  },
  conversations: {
    list: (chatbotId: string) => ['conversations', chatbotId] as const,
    detail: (chatbotId: string, conversationId: string) =>
      ['conversations', chatbotId, conversationId] as const,
    messages: (chatbotId: string, conversationId: string) =>
      ['conversations', chatbotId, conversationId, 'messages'] as const,
  },
} as const
