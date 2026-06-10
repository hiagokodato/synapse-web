import { useState, type ComponentType } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  GitBranch,
  MessageSquare,
  Pencil,
  Trash2,
  Workflow,
} from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { ChatbotStatusBadge } from '@/features/chatbots/components/ChatbotStatusBadge'
import { DeleteChatbotModal } from '@/features/chatbots/components/DeleteChatbotModal'
import { EditChatbotModal } from '@/features/chatbots/components/EditChatbotModal'
import { FlowList } from '@/features/flows/components/FlowList'
import { useChatbot } from '@/features/chatbots/hooks/useChatbots'
import { getErrorMessage } from '@/services/api'
import { formatDate } from '@/utils/date'

export function ChatbotDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { data: chatbot, isLoading, isError, error } = useChatbot(id)

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="text-accent-400" />
      </div>
    )
  }

  if (isError || !chatbot) {
    return (
      <div className="space-y-4">
        <Link to="/chatbots" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white">
          <ArrowLeft className="size-4" />
          Voltar para chatbots
        </Link>
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {getErrorMessage(error, 'Chatbot não encontrado.')}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Link
            to="/chatbots"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Chatbots
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-white">{chatbot.name}</h1>
            <ChatbotStatusBadge status={chatbot.status} />
          </div>
          {chatbot.description && <p className="max-w-2xl text-muted">{chatbot.description}</p>}
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            <Pencil className="size-4" />
            Editar
          </Button>
          <Button
            variant="secondary"
            className="border-red-500/30 text-red-400 hover:border-red-500/50 hover:bg-red-500/10"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={GitBranch}
          label="Fluxos"
          value={chatbot._count.flows}
          hint="Editor visual"
        />
        <StatCard
          icon={MessageSquare}
          label="Conversas"
          value={chatbot._count.conversations}
          hint="Fase 4 — Tempo real"
        />
        <StatCard icon={Workflow} label="Status" value={chatbot.status} hint="Gerenciado acima" />
        <StatCard
          icon={MessageSquare}
          label="Criado em"
          value={formatDate(chatbot.createdAt)}
          hint={`Atualizado ${formatDate(chatbot.updatedAt)}`}
          small
        />
      </div>

      <FlowList chatbotId={chatbot.id} />

      <EditChatbotModal chatbot={chatbot} open={editOpen} onClose={() => setEditOpen(false)} />
      <DeleteChatbotModal
        chatbot={chatbot}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDeleted={() => navigate('/chatbots', { replace: true })}
      />
    </div>
  )
}

type StatCardProps = {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string | number
  hint: string
  small?: boolean
}

function StatCard({ icon: Icon, label, value, hint, small }: StatCardProps) {
  return (
    <div className="rounded-xl border border-surface-700/80 bg-surface-900/60 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        <Icon className="size-4 text-accent-400" />
      </div>
      <p className={`mt-3 font-semibold text-white ${small ? 'text-base' : 'text-2xl'}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  )
}
