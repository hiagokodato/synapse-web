import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Send, Wifi, WifiOff } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { MessageBubble } from '@/features/conversations/components/MessageBubble'
import { conversationStatusConfig } from '@/features/conversations/constants'
import { useConversationRealtime } from '@/features/conversations/hooks/useConversationRealtime'
import { useConversation } from '@/features/conversations/hooks/useConversations'
import { getErrorMessage } from '@/services/api'
import { conversationService } from '@/services/conversation.service'
import type { ConversationStatus } from '@/types/conversation'
import { queryKeys } from '@/utils/query-keys'
import { Badge } from '@/components/ui/Badge'

type ConversationChatPanelProps = {
  chatbotId: string
  chatbotName: string
  conversationId: string
}

export function ConversationChatPanel({
  chatbotId,
  chatbotName,
  conversationId,
}: ConversationChatPanelProps) {
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { data: conversation, isLoading, isError, error: loadError } = useConversation(
    chatbotId,
    conversationId,
  )

  const { isConnected, isJoined, sendMessage } = useConversationRealtime({
    chatbotId,
    conversationId,
    enabled: conversation?.status === 'OPEN',
  })

  const statusMutation = useMutation({
    mutationFn: (status: ConversationStatus) =>
      conversationService.update(chatbotId, conversationId, { status }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.conversations.detail(chatbotId, conversationId),
      })
      await queryClient.invalidateQueries({ queryKey: queryKeys.conversations.list(chatbotId) })
    },
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation?.messages.length])

  const handleSend = async () => {
    const content = draft.trim()
    if (!content) return

    setError(null)

    try {
      await sendMessage(content)
      setDraft('')
    } catch (err) {
      setError(getErrorMessage(err, 'Não foi possível enviar a mensagem.'))
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner className="text-accent-400" />
      </div>
    )
  }

  if (isError || !conversation) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-red-300">
          {getErrorMessage(loadError, 'Conversa não encontrada.')}
        </p>
      </div>
    )
  }

  const statusConfig = conversationStatusConfig[conversation.status]

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-surface-700/80 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{chatbotName}</p>
          <p className="truncate text-xs text-slate-500">
            {conversation.externalId ?? conversation.id.slice(0, 12)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1 text-xs text-slate-500"
            title={isConnected && isJoined ? 'Conectado' : 'Desconectado'}
          >
            {isConnected && isJoined ? (
              <Wifi className="size-3.5 text-emerald-400" />
            ) : (
              <WifiOff className="size-3.5 text-amber-400" />
            )}
            Realtime
          </span>
          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
          {conversation.status === 'OPEN' ? (
            <Button
              variant="secondary"
              size="sm"
              loading={statusMutation.isPending}
              onClick={() => statusMutation.mutate('CLOSED')}
            >
              Encerrar
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              loading={statusMutation.isPending}
              onClick={() => statusMutation.mutate('OPEN')}
            >
              Reabrir
            </Button>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {conversation.messages.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">
            Nenhuma mensagem ainda. Envie a primeira abaixo.
          </p>
        )}

        {conversation.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 border-t border-surface-700/80 p-4">
        {conversation.status === 'CLOSED' ? (
          <p className="text-center text-sm text-slate-500">
            Conversa encerrada. Reabra para enviar novas mensagens.
          </p>
        ) : (
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              void handleSend()
            }}
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Digite uma mensagem..."
              disabled={!isJoined}
            />
            <Button type="submit" disabled={!draft.trim() || !isJoined}>
              <Send className="size-4" />
            </Button>
          </form>
        )}

        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </div>
    </div>
  )
}
