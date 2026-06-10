import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GitBranch, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { CreateFlowModal } from '@/features/flows/components/CreateFlowModal'
import { DeleteFlowModal } from '@/features/flows/components/DeleteFlowModal'
import { useFlows } from '@/features/flows/hooks/useFlows'
import { getErrorMessage } from '@/services/api'
import type { Flow } from '@/types/flow'
import { formatDistanceToNow } from '@/utils/date'

type FlowListProps = {
  chatbotId: string
}

export function FlowList({ chatbotId }: FlowListProps) {
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteFlow, setDeleteFlow] = useState<Flow | null>(null)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)

  const { data: flows, isLoading, isError, error } = useFlows(chatbotId)

  return (
    <section className="rounded-xl border border-surface-700/80 bg-surface-900/60 p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-medium text-white">Fluxos conversacionais</h2>
          <p className="mt-1 text-sm text-muted">
            Construa fluxos visuais com drag-and-drop e publique quando estiver pronto.
          </p>
        </div>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" />
          Novo fluxo
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Spinner className="text-accent-400" />
        </div>
      )}

      {isError && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {getErrorMessage(error, 'Não foi possível carregar os fluxos.')}
        </p>
      )}

      {!isLoading && !isError && flows?.length === 0 && (
        <EmptyState
          icon={GitBranch}
          title="Nenhum fluxo criado"
          description="Crie seu primeiro fluxo para definir como o chatbot conversa com os usuários."
          action={
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="size-4" />
              Criar fluxo
            </Button>
          }
        />
      )}

      {flows && flows.length > 0 && (
        <ul className="divide-y divide-surface-700/80">
          {flows.map((flow) => (
            <li key={flow.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={`/chatbots/${chatbotId}/flows/${flow.id}`}
                    className="font-medium text-slate-200 transition-colors hover:text-accent-400"
                  >
                    {flow.name}
                  </Link>
                  <Badge variant="muted">v{flow.version}</Badge>
                  {flow.published ? (
                    <Badge variant="success">Publicado</Badge>
                  ) : (
                    <Badge variant="warning">Rascunho</Badge>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {flow.definition.nodes.length} nós · {flow.definition.edges.length} conexões ·
                  atualizado {formatDistanceToNow(flow.updatedAt)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link to={`/chatbots/${chatbotId}/flows/${flow.id}`}>
                  <Button variant="secondary" size="sm">
                    <Pencil className="size-4" />
                    Editar
                  </Button>
                </Link>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpenId((id) => (id === flow.id ? null : flow.id))}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-surface-800 hover:text-white"
                    aria-label="Mais ações"
                  >
                    <MoreHorizontal className="size-4" />
                  </button>

                  {menuOpenId === flow.id && (
                    <>
                      <button
                        type="button"
                        className="fixed inset-0 z-10"
                        aria-label="Fechar menu"
                        onClick={() => setMenuOpenId(null)}
                      />
                      <div className="absolute right-0 z-20 mt-1 w-36 rounded-lg border border-surface-700 bg-surface-900 py-1 shadow-xl">
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-surface-800"
                          onClick={() => {
                            setMenuOpenId(null)
                            setDeleteFlow(flow)
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
            </li>
          ))}
        </ul>
      )}

      <CreateFlowModal chatbotId={chatbotId} open={createOpen} onClose={() => setCreateOpen(false)} />
      <DeleteFlowModal
        chatbotId={chatbotId}
        flow={deleteFlow}
        open={!!deleteFlow}
        onClose={() => setDeleteFlow(null)}
      />
    </section>
  )
}
