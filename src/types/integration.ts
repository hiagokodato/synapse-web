export type IntegrationProvider = 'TELEGRAM' | 'WHATSAPP'

export type IntegrationCredentialsMasked = {
  botToken?: string
  accessToken?: string
  phoneNumberId?: string
  verifyToken?: string
}

export type Integration = {
  id: string
  chatbotId: string
  provider: IntegrationProvider
  enabled: boolean
  externalRef: string | null
  webhookUrl: string | null
  credentials: IntegrationCredentialsMasked
  createdAt: string
  updatedAt: string
}

export type CreateIntegrationPayload = {
  provider: IntegrationProvider
  botToken?: string
  accessToken?: string
  phoneNumberId?: string
  verifyToken?: string
}

export type UpdateIntegrationPayload = {
  enabled?: boolean
  botToken?: string
  accessToken?: string
  phoneNumberId?: string
  verifyToken?: string
}
