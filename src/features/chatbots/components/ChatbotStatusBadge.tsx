import type { ChatbotStatus } from '@/types/chatbot'
import { Badge } from '@/components/ui/Badge'
import { statusConfig } from '@/features/chatbots/constants'

type ChatbotStatusBadgeProps = {
  status: ChatbotStatus
}

export function ChatbotStatusBadge({ status }: ChatbotStatusBadgeProps) {
  const config = statusConfig[status]

  return <Badge variant={config.variant}>{config.label}</Badge>
}
