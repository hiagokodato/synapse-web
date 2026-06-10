import { messageRoleConfig } from '@/features/conversations/constants'
import type { Message } from '@/types/conversation'
import { cn } from '@/utils/cn'
import { formatDate } from '@/utils/date'

type MessageBubbleProps = {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const config = messageRoleConfig[message.role]

  if (message.role === 'SYSTEM') {
    return (
      <div className="flex justify-center py-1">
        <span className="rounded-full bg-surface-800 px-3 py-1 text-xs text-slate-500">
          {message.content}
        </span>
      </div>
    )
  }

  const isUser = message.role === 'USER'

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm',
          isUser
            ? 'rounded-br-md bg-accent-500 text-white'
            : 'rounded-bl-md border border-surface-700 bg-surface-800 text-slate-200',
        )}
      >
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider opacity-70">
          {config.label}
        </p>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
        <p className={cn('mt-1.5 text-[10px] opacity-60', isUser ? 'text-right' : 'text-left')}>
          {formatDate(message.createdAt)}
        </p>
      </div>
    </div>
  )
}
