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
} as const
