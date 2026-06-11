import { MessageCircle, Send, type LucideIcon } from 'lucide-react'

import type { IntegrationProvider } from '@/types/integration'

export const INTEGRATION_META: Record<
  IntegrationProvider,
  { label: string; description: string; icon: LucideIcon; accent: string }
> = {
  TELEGRAM: {
    label: 'Telegram',
    description: 'Conecte um bot do Telegram via @BotFather.',
    icon: Send,
    accent: 'text-sky-400',
  },
  WHATSAPP: {
    label: 'WhatsApp',
    description: 'Conecte um número via WhatsApp Cloud API (Meta).',
    icon: MessageCircle,
    accent: 'text-emerald-400',
  },
}

export const INTEGRATION_PROVIDERS: IntegrationProvider[] = ['TELEGRAM', 'WHATSAPP']
