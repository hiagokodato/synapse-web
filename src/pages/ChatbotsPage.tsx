import { useState } from 'react'
import { Bot, Plus } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { ChatbotCard } from '@/features/chatbots/components/ChatbotCard'
import { CreateChatbotModal } from '@/features/chatbots/components/CreateChatbotModal'
import { useChatbots } from '@/features/chatbots/hooks/useChatbots'
import { getErrorMessage } from '@/services/api'

export function ChatbotsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const { data: chatbots, isLoading, isError, error } = useChatbots()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Chatbots</h1>
          <p className="mt-1 text-muted">Gerencie seus chatbots e fluxos conversacionais.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Novo chatbot
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Spinner className="text-accent-400" />
        </div>
      )}

      {isError && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {getErrorMessage(error, 'Não foi possível carregar os chatbots.')}
        </p>
      )}

      {!isLoading && !isError && chatbots?.length === 0 && (
        <EmptyState
          icon={Bot}
          title="Nenhum chatbot ainda"
          description="Crie seu primeiro chatbot para começar a construir fluxos de conversa automatizados."
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" />
              Criar primeiro chatbot
            </Button>
          }
        />
      )}

      {!isLoading && !isError && chatbots && chatbots.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {chatbots.map((chatbot) => (
            <ChatbotCard key={chatbot.id} chatbot={chatbot} />
          ))}
        </div>
      )}

      <CreateChatbotModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}
