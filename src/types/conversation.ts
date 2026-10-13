export type ConversationStatus = 'OPEN' | 'CLOSED'

export type MessageRole = 'USER' | 'BOT' | 'SYSTEM'

export type Message = {
  id: string
  conversationId: string
  role: MessageRole
  content: string
  metadata: Record<string, unknown>
  createdAt: string
}

export type Conversation = {
  id: string
  chatbotId: string
  externalId: string | null
  status: ConversationStatus
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
  _count: {
    messages: number
  }
}

export type ConversationDetail = Conversation & {
  messages: Message[]
}

export type CreateConversationPayload = {
  externalId?: string
  metadata?: Record<string, unknown>
}

export type UpdateConversationPayload = {
  status?: ConversationStatus
  metadata?: Record<string, unknown>
}

export type SendMessagePayload = {
  content: string
}
