import type { ChatbotStatus } from '@/types/chatbot'

export const statusConfig: Record<
  ChatbotStatus,
  { label: string; variant: 'default' | 'success' | 'warning' | 'muted' }
> = {
  DRAFT: { label: 'Rascunho', variant: 'warning' },
  ACTIVE: { label: 'Ativo', variant: 'success' },
  ARCHIVED: { label: 'Arquivado', variant: 'muted' },
}
