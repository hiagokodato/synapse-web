import { useRef, useState, type ChangeEvent } from 'react'
import { Download, FileUp, GitBranch, RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { useFlows } from '@/features/flows/hooks/useFlows'
import {
  downloadFlowDefinition,
  FlowDefinitionError,
  readFlowDefinitionFile,
} from '@/features/flows/utils/flow-definition'
import type { Flow, FlowDefinition } from '@/types/flow'
import { formatDistanceToNow } from '@/utils/date'

type LoadFlowModalProps = {
  chatbotId: string
  currentFlowId: string
  open: boolean
  onClose: () => void
  onLoad: (definition: FlowDefinition) => void
}

export function LoadFlowModal({
  chatbotId,
  currentFlowId,
  open,
  onClose,
  onLoad,
}: LoadFlowModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingFile, setLoadingFile] = useState(false)

  const { data: flows, isLoading } = useFlows(chatbotId)
  const otherFlows = flows?.filter((flow) => flow.id !== currentFlowId) ?? []

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    setError(null)
    setLoadingFile(true)

    try {
      const definition = await readFlowDefinitionFile(file)
      onLoad(definition)
      onClose()
    } catch (err) {
      setError(err instanceof FlowDefinitionError ? err.message : 'Erro ao importar fluxo.')
    } finally {
      setLoadingFile(false)
    }
  }

  const handleLoadFromFlow = (flow: Flow) => {
    onLoad(flow.definition)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Carregar fluxo"
      description="Importe um arquivo JSON ou copie a definição de outro fluxo deste chatbot."
    >
      <div className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-sm font-medium text-white">Arquivo JSON</h3>
          <p className="text-xs text-muted">
            O arquivo deve conter <code className="text-accent-400">nodes</code> e{' '}
            <code className="text-accent-400">edges</code> no formato React Flow.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => void handleFileChange(e)}
          />

          <Button
            variant="secondary"
            className="w-full"
            loading={loadingFile}
            onClick={() => fileInputRef.current?.click()}
          >
            <FileUp className="size-4" />
            Selecionar arquivo .json
          </Button>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-medium text-white">Outro fluxo</h3>

          {isLoading && (
            <div className="flex justify-center py-6">
              <Spinner className="text-accent-400" />
            </div>
          )}

          {!isLoading && otherFlows.length === 0 && (
            <p className="rounded-lg border border-dashed border-surface-600 px-4 py-6 text-center text-sm text-slate-500">
              Nenhum outro fluxo disponível neste chatbot.
            </p>
          )}

          {!isLoading && otherFlows.length > 0 && (
            <ul className="max-h-48 space-y-2 overflow-y-auto">
              {otherFlows.map((flow) => (
                <li key={flow.id}>
                  <button
                    type="button"
                    onClick={() => handleLoadFromFlow(flow)}
                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-surface-700/80 bg-surface-800/50 px-3 py-2.5 text-left transition-colors hover:border-accent-500/40 hover:bg-surface-800"
                  >
                    <span className="inline-flex min-w-0 items-center gap-2">
                      <GitBranch className="size-4 shrink-0 text-accent-400" />
                      <span className="truncate text-sm text-slate-200">{flow.name}</span>
                    </span>
                    <span className="shrink-0 text-xs text-slate-500">
                      {flow.definition.nodes.length} nós · {formatDistanceToNow(flow.updatedAt)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
      </div>
    </Modal>
  )
}

type FlowImportExportActionsProps = {
  flowName: string
  definition: FlowDefinition
  savedDefinition: FlowDefinition
  onLoad: (definition: FlowDefinition) => void
  chatbotId: string
  flowId: string
}

export function FlowImportExportActions({
  flowName,
  definition,
  savedDefinition,
  onLoad,
  chatbotId,
  flowId,
}: FlowImportExportActionsProps) {
  const [loadOpen, setLoadOpen] = useState(false)

  const handleReloadSaved = () => {
    onLoad(savedDefinition)
  }

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setLoadOpen(true)}>
        <FileUp className="size-4" />
        Carregar
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => downloadFlowDefinition(flowName, definition)}
      >
        <Download className="size-4" />
        Exportar
      </Button>
      <Button variant="ghost" size="sm" onClick={handleReloadSaved} title="Descartar alterações locais">
        <RotateCcw className="size-4" />
      </Button>

      <LoadFlowModal
        chatbotId={chatbotId}
        currentFlowId={flowId}
        open={loadOpen}
        onClose={() => setLoadOpen(false)}
        onLoad={onLoad}
      />
    </>
  )
}
