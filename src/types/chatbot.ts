export type ChatbotStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED'

export type Chatbot = {
  id: string
  name: string
  description: string | null
  status: ChatbotStatus
  userId: string
  createdAt: string
  updatedAt: string
  _count: {
    flows: number
    conversations: number
  }
}

export type CreateChatbotPayload = {
  name: string
  description?: string
}

export type UpdateChatbotPayload = {
  name?: string
  description?: string
  status?: ChatbotStatus
}
