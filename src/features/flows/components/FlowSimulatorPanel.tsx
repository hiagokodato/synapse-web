import { useMutation } from '@tanstack/react-query'
import { Bot, RotateCcw, Send, User, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { getErrorMessage } from '@/services/api'
import { flowService } from '@/services/flow.service'
import type {
  FlowDefinition,
  SimulationMessage,
  SimulationResult,
  SimulationState,
  SimulationStatus,
} from '@/types/flow'
import { cn } from '@/utils/cn'

type FlowSimulatorPanelProps = {
  chatbotId: string
  flowId: string
  definition: FlowDefinition
  onClose: () => void
}

type ChatEntry = {
  id: string
  role: 'bot' | 'user'
  content: string
}

let entrySeq = 0
function nextId() {
  entrySeq += 1
  return `sim-${entrySeq}`
}

function toBotEntries(messages: SimulationMessage[]): ChatEntry[] {
  return messages.map((message) => ({ id: nextId(), role: 'bot', content: message.content }))
}

export function FlowSimulatorPanel({
  chatbotId,
  flowId,
  definition,
  onClose,
}: FlowSimulatorPanelProps) {
  const [chat, setChat] = useState<ChatEntry[]>([])
  const [state, setState] = useState<SimulationState | null>(null)
  const [variables, setVariables] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<SimulationStatus | null>(null)
  const [input, setInput] = useState('')

  const scrollRef = useRef<HTMLDivElement>(null)

  const applyState = (result: SimulationResult) => {
    setState(result.state)
    setVariables(result.variables ?? {})
    setStatus(result.status)
  }

  const startMutation = useMutation({
    mutationFn: () => flowService.simulate(chatbotId, flowId, { definition }),
    onSuccess: (result) => {
      setChat(toBotEntries(result.messages))
      applyState(result)
    },
  })

  const replyMutation = useMutation({
    mutationFn: (text: string) =>
      flowService.simulate(chatbotId, flowId, { definition, message: text, state, variables }),
    onSuccess: (result) => {
      setChat((prev) => [...prev, ...toBotEntries(result.messages)])
      applyState(result)
    },
  })

  const start = startMutation.mutate
  const restart = useCallback(() => {
    setChat([])
    setState(null)
    setVariables({})
    setStatus(null)
    start()
  }, [start])

  useEffect(() => {
    start()
  }, [start])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [chat, startMutation.isPending, replyMutation.isPending])

  const isBusy = startMutation.isPending || replyMutation.isPending
  const canType = status === 'awaiting' && !isBusy
  const error = startMutation.error || replyMutation.error
  const variableEntries = Object.entries(variables)

  const send = () => {
    const text = input.trim()
    if (!text || isBusy || status !== 'awaiting' || !state) return
    setInput('')
    setChat((prev) => [...prev, { id: nextId(), role: 'user', content: text }])
    replyMutation.mutate(text)
  }

  return (
    <div className="absolute right-0 top-0 z-20 flex h-full w-[360px] max-w-[90vw] flex-col border-l border-surface-700/80 bg-surface-900/95 shadow-2xl shadow-black/40 backdrop-blur-sm">
      <header className="flex shrink-0 items-center justify-between border-b border-surface-700/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <Bot className="size-4 text-accent-400" />
          <h3 className="text-sm font-semibold text-white">Simulador</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Reiniciar simulação"
            onClick={restart}
            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-surface-800 hover:text-white"
          >
            <RotateCcw className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Fechar simulador"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-surface-800 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>
      </header>

      <p className="shrink-0 border-b border-surface-700/60 px-4 py-2 text-xs text-slate-500">
        Testa o fluxo atual (mesmo sem salvar). As respostas usam a mesma lógica do bot real.
      </p>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        {chat.map((entry) => (
          <div
            key={entry.id}
            className={cn('flex gap-2', entry.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
          >
            <span
              className={cn(
                'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full',
                entry.role === 'user'
                  ? 'bg-accent-500/20 text-accent-300'
                  : 'bg-surface-700 text-slate-300',
              )}
            >
              {entry.role === 'user' ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
            </span>
            <div
              className={cn(
                'max-w-[80%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm',
                entry.role === 'user' ? 'bg-accent-500 text-white' : 'bg-surface-800 text-slate-100',
              )}
            >
              {entry.content}
            </div>
          </div>
        ))}

        {isBusy && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Spinner size="sm" />
            Processando...
          </div>
        )}

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            {getErrorMessage(error, 'Não foi possível executar a simulação.')}
          </p>
        )}

        {status === 'ended' && !isBusy && (
          <p className="text-center text-xs font-medium text-emerald-400">• Conversa encerrada •</p>
        )}
        {status === 'idle' && !isBusy && (
          <p className="text-center text-xs text-slate-500">
            • Fluxo terminou sem aguardar resposta •
          </p>
        )}
      </div>

      {variableEntries.length > 0 && (
        <div className="shrink-0 border-t border-surface-700/60 px-4 py-2">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Variáveis
          </p>
          <div className="flex flex-wrap gap-1.5">
            {variableEntries.map(([key, value]) => (
              <span
                key={key}
                className="rounded-md border border-surface-700 bg-surface-800/60 px-2 py-0.5 text-[11px] text-slate-300"
              >
                <span className="text-accent-400">{key}</span>: {value || '—'}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="shrink-0 border-t border-surface-700/80 p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            disabled={!canType}
            rows={1}
            placeholder={canType ? 'Digite a resposta do usuário...' : 'Reinicie para testar de novo'}
            className="max-h-28 min-h-[40px] flex-1 resize-none rounded-lg border border-surface-600 bg-surface-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-accent-500 focus:outline-none disabled:opacity-50"
          />
          <Button size="sm" disabled={!canType || !input.trim()} onClick={send}>
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
