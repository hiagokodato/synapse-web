import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MessageSquare, Plus } from 'lucide-react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Select } from '@/components/ui/Select'
import { Spinner } from '@/components/ui/Spinner'
import { ConversationChatPanel } from '@/features/conversations/components/ConversationChatPanel'
import { StartConversationModal } from '@/features/conversations/components/StartConversationModal'
import { conversationStatusConfig } from '@/features/conversations/constants'
import { useConversations } from '@/features/conversations/hooks/useConversations'
import { useChatbots } from '@/features/chatbots/hooks/useChatbots'
import { getErrorMessage } from '@/services/api'
import { formatDistanceToNow } from '@/utils/date'
import { cn } from '@/utils/cn'

export function ConversationsPage() {
  const navigate = useNavigate()
  const { chatbotId: routeChatbotId = '', conversationId = '' } = useParams()
  const [selectedChatbotId, setSelectedChatbotId] = useState(routeChatbotId)
  const [createOpen, setCreateOpen] = useState(false)

  const chatbotsQuery = useChatbots()
  const activeChatbotId = routeChatbotId || selectedChatbotId || chatbotsQuery.data?.[0]?.id || ''

  const conversationsQuery = useConversations(activeChatbotId)

  const activeChatbot = useMemo(
    () => chatbotsQuery.data?.find((item) => item.id === activeChatbotId),
    [activeChatbotId, chatbotsQuery.data],
  )

  const handleChatbotChange = (chatbotId: string) => {
    setSelectedChatbotId(chatbotId)
    navigate('/conversations')
  }

  return (
    <div className="-m-6 flex h-[calc(100dvh-4rem)] overflow-hidden">
      <aside className="flex w-80 shrink-0 flex-col border-r border-surface-700/80 bg-surface-900/80">
        <div className="border-b border-surface-700/80 p-4">
          <h1 className="text-lg font-semibold text-white">Conversas</h1>
          <p className="mt-1 text-xs text-muted">Monitore e responda em tempo real.</p>

          <div className="mt-4 space-y-2">
            <label className="text-xs font-medium text-slate-400" htmlFor="chatbot-filter">
              Chatbot
            </label>
            <Select
              id="chatbot-filter"
              value={activeChatbotId}
              onChange={(e) => handleChatbotChange(e.target.value)}
              disabled={chatbotsQuery.isLoading || !chatbotsQuery.data?.length}
            >
              {!chatbotsQuery.data?.length && <option value="">Nenhum chatbot</option>}
              {chatbotsQuery.data?.map((chatbot) => (
                <option key={chatbot.id} value={chatbot.id}>
                  {chatbot.name}
                </option>
              ))}
            </Select>
          </div>

          <Button
            className="mt-3 w-full"
            size="sm"
            disabled={!activeChatbotId}
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="size-4" />
            Nova conversa
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {conversationsQuery.isLoading && (
            <div className="flex justify-center py-10">
              <Spinner className="text-accent-400" />
            </div>
          )}

          {conversationsQuery.isError && (
            <p className="p-4 text-sm text-red-300">
              {getErrorMessage(conversationsQuery.error, 'Erro ao carregar conversas.')}
            </p>
          )}

          {!conversationsQuery.isLoading &&
            !conversationsQuery.isError &&
            conversationsQuery.data?.length === 0 && (
              <div className="p-4">
                <EmptyState
                  icon={MessageSquare}
                  title="Sem conversas"
                  description="Inicie uma conversa de teste para ver mensagens em tempo real."
                  action={
                    <Button size="sm" disabled={!activeChatbotId} onClick={() => setCreateOpen(true)}>
                      <Plus className="size-4" />
                      Nova conversa
                    </Button>
                  }
                />
              </div>
            )}

          {conversationsQuery.data && conversationsQuery.data.length > 0 && (
            <ul className="divide-y divide-surface-700/80">
              {conversationsQuery.data.map((conversation) => {
                const isActive =
                  conversation.id === conversationId && activeChatbotId === routeChatbotId
                const status = conversationStatusConfig[conversation.status]

                return (
                  <li key={conversation.id}>
                    <Link
                      to={`/conversations/${activeChatbotId}/${conversation.id}`}
                      className={cn(
                        'block px-4 py-3 transition-colors hover:bg-surface-800/60',
                        isActive && 'bg-accent-500/10',
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium text-slate-200">
                          {conversation.externalId ?? `Conversa ${conversation.id.slice(0, 8)}`}
                        </span>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {conversation._count.messages} mensagens ·{' '}
                        {formatDistanceToNow(conversation.updatedAt)}
                      </p>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col bg-surface-950/50">
        {routeChatbotId && conversationId && activeChatbot ? (
          <ConversationChatPanel
            chatbotId={routeChatbotId}
            chatbotName={activeChatbot.name}
            conversationId={conversationId}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center p-6">
            <EmptyState
              icon={MessageSquare}
              title="Selecione uma conversa"
              description="Escolha uma conversa na lista ou crie uma nova para abrir o chat em tempo real."
            />
          </div>
        )}
      </section>

      <StartConversationModal
        chatbotId={activeChatbotId}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  )
}
