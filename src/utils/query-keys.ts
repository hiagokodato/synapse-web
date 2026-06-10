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
  },
  flows: {
    list: (chatbotId: string) => ['flows', chatbotId] as const,
    detail: (chatbotId: string, flowId: string) => ['flows', chatbotId, flowId] as const,
  },
} as const
