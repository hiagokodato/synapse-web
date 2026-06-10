import { Link } from 'react-router-dom'
import { GitBranch, MessageSquare, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { ChatbotStatusBadge } from '@/features/chatbots/components/ChatbotStatusBadge'
import { formatDistanceToNow } from '@/utils/date'
import { DeleteChatbotModal } from '@/features/chatbots/components/DeleteChatbotModal'
import { EditChatbotModal } from '@/features/chatbots/components/EditChatbotModal'
import type { Chatbot } from '@/types/chatbot'
import { cn } from '@/utils/cn'

type ChatbotCardProps = {
  chatbot: Chatbot
}

export function ChatbotCard({ chatbot }: ChatbotCardProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <article className="group relative rounded-xl border border-surface-700/80 bg-surface-900/60 p-5 transition-colors hover:border-surface-600 hover:bg-surface-900/80">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={`/chatbots/${chatbot.id}`}
                className="truncate text-lg font-medium text-white transition-colors hover:text-accent-400"
              >
                {chatbot.name}
              </Link>
              <ChatbotStatusBadge status={chatbot.status} />
            </div>
            {chatbot.description ? (
              <p className="mt-2 line-clamp-2 text-sm text-muted">{chatbot.description}</p>
            ) : (
              <p className="mt-2 text-sm italic text-slate-600">Sem descrição</p>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-surface-800 hover:text-white"
              aria-label="Ações do chatbot"
            >
              <MoreHorizontal className="size-4" />
            </button>

            {menuOpen && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-10"
                  aria-label="Fechar menu"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-surface-700 bg-surface-900 py-1 shadow-xl">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-surface-800"
                    onClick={() => {
                      setMenuOpen(false)
                      setEditOpen(true)
                    }}
                  >
                    <Pencil className="size-3.5" />
                    Editar
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-surface-800"
                    onClick={() => {
                      setMenuOpen(false)
                      setDeleteOpen(true)
                    }}
                  >
                    <Trash2 className="size-3.5" />
                    Excluir
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <GitBranch className="size-3.5" />
            {chatbot._count.flows} fluxo{chatbot._count.flows !== 1 ? 's' : ''}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MessageSquare className="size-3.5" />
            {chatbot._count.conversations} conversa{chatbot._count.conversations !== 1 ? 's' : ''}
          </span>
          <span className={cn('ml-auto')}>Atualizado {formatDistanceToNow(chatbot.updatedAt)}</span>
        </div>

        <div className="mt-4">
          <Link to={`/chatbots/${chatbot.id}`}>
            <Button variant="secondary" size="sm" className="w-full">
              Ver detalhes
            </Button>
          </Link>
        </div>
      </article>

      <EditChatbotModal chatbot={chatbot} open={editOpen} onClose={() => setEditOpen(false)} />
      <DeleteChatbotModal chatbot={chatbot} open={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </>
  )
}
