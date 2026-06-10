import type { ConversationStatus, MessageRole } from '@/types/conversation'

export const conversationStatusConfig: Record<
  ConversationStatus,
  { label: string; variant: 'success' | 'muted' }
> = {
  OPEN: { label: 'Aberta', variant: 'success' },
  CLOSED: { label: 'Fechada', variant: 'muted' },
}

export const messageRoleConfig: Record<
  MessageRole,
  { label: string; align: 'left' | 'right' | 'center' }
> = {
  USER: { label: 'Usuário', align: 'right' },
  BOT: { label: 'Bot', align: 'left' },
  SYSTEM: { label: 'Sistema', align: 'center' },
}
