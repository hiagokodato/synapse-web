import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useOnSelectionChange,
  type Connection,
  type Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  CloudUpload,
  Save,
  ShieldCheck,
  X,
  XCircle,
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { FlowNodePalette } from '@/features/flows/components/FlowNodePalette'
import { FlowImportExportActions } from '@/features/flows/components/LoadFlowModal'
import { FlowPropertiesPanel } from '@/features/flows/components/FlowPropertiesPanel'
import { flowNodeTypes } from '@/features/flows/components/flow-node-types'
import { normalizeFlowNodes } from '@/features/flows/constants'
import { getErrorMessage } from '@/services/api'
import { flowService } from '@/services/flow.service'
import type {
  Flow,
  FlowNode,
  FlowNodeData,
  FlowValidationIssue,
  FlowValidationResult,
} from '@/types/flow'
import { cn } from '@/utils/cn'
import { queryKeys } from '@/utils/query-keys'

function edgeLabelFor(
  sourceHandle: string | null | undefined,
  source: string | null | undefined,
  nodes: FlowNode[],
): string | undefined {
  if (!sourceHandle) return undefined
  if (sourceHandle === 'yes') return 'Sim'
  if (sourceHandle === 'no') return 'Não'
  if (sourceHandle === 'fallback') return 'Fallback'

  const node = nodes.find((item) => item.id === source)
  const option = (node?.data as FlowNodeData | undefined)?.options?.find(
    (opt) => opt.id === sourceHandle,
  )
  return option?.label
}

function extractIssues(error: unknown): FlowValidationIssue[] | null {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { issues?: FlowValidationIssue[] } | undefined
    if (Array.isArray(data?.issues)) {
      return data.issues
    }
  }
  return null
}

type FlowBuilderProps = {
  chatbotId: string
  flow: Flow
}

export function FlowBuilder({ chatbotId, flow }: FlowBuilderProps) {
  return (
    <ReactFlowProvider>
      <FlowBuilderEditor key={flow.updatedAt} chatbotId={chatbotId} flow={flow} />
    </ReactFlowProvider>
  )
}

function FlowBuilderEditor({ chatbotId, flow }: FlowBuilderProps) {
  const queryClient = useQueryClient()
  const [nodes, setNodes, onNodesChange] = useNodesState(normalizeFlowNodes(flow.definition.nodes))
  const [edges, setEdges, onEdgesChange] = useEdgesState(flow.definition.edges)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [validation, setValidation] = useState<FlowValidationResult | null>(null)

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null
    return (nodes.find((node) => node.id === selectedNodeId) as FlowNode | undefined) ?? null
  }, [nodes, selectedNodeId])

  const definition = useMemo(() => ({ nodes, edges }), [nodes, edges])

  const loadDefinition = useCallback(
    (next: Flow['definition']) => {
      setNodes(normalizeFlowNodes(next.nodes))
      setEdges(next.edges)
      setSelectedNodeId(null)
      setStatusMessage('Fluxo carregado no editor. Salve para persistir.')
    },
    [setEdges, setNodes],
  )

  const isDirty = useMemo(() => {
    return JSON.stringify(definition) !== JSON.stringify(flow.definition)
  }, [definition, flow.definition])

  useOnSelectionChange({
    onChange: ({ nodes: selected }) => {
      setSelectedNodeId(selected[0]?.id ?? null)
    },
  })

  const onConnect = useCallback(
    (connection: Connection) => {
      const label = edgeLabelFor(connection.sourceHandle, connection.source, nodes)

      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            label,
            labelStyle: { fill: '#94a3b8', fontSize: 11, fontWeight: 500 },
            labelBgStyle: { fill: '#0f172a', fillOpacity: 0.85 },
            labelBgPadding: [4, 6] as [number, number],
            labelBgBorderRadius: 4,
          },
          eds,
        ),
      )
    },
    [nodes, setEdges],
  )

  const onBeforeDelete = useCallback(
    async ({ nodes: nodesToDelete }: { nodes: Node[]; edges: unknown[] }) => {
      if (nodesToDelete.some((node) => node.type === 'start')) {
        setStatusMessage('O bloco Início não pode ser removido.')
        return false
      }
      return true
    },
    [],
  )

  const invalidate = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.flows.list(chatbotId) }),
      queryClient.invalidateQueries({ queryKey: queryKeys.flows.detail(chatbotId, flow.id) }),
      queryClient.invalidateQueries({ queryKey: queryKeys.chatbots.detail(chatbotId) }),
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.overview }),
    ])
  }, [chatbotId, flow.id, queryClient])

  const saveMutation = useMutation({
    mutationFn: () => flowService.update(chatbotId, flow.id, { definition }),
    onSuccess: async () => {
      await invalidate()
      setStatusMessage('Fluxo salvo com sucesso.')
    },
    onError: (error) => {
      setStatusMessage(getErrorMessage(error, 'Erro ao salvar o fluxo.'))
    },
  })

  const publishMutation = useMutation({
    mutationFn: () => flowService.update(chatbotId, flow.id, { definition, published: true }),
    onSuccess: async () => {
      await invalidate()
      setValidation(null)
      setStatusMessage('Fluxo publicado com sucesso.')
    },
    onError: (error) => {
      const issues = extractIssues(error)
      if (issues) {
        setValidation({ valid: false, issues })
      }
      setStatusMessage(getErrorMessage(error, 'Erro ao publicar o fluxo.'))
    },
  })

  const validateMutation = useMutation({
    mutationFn: () => flowService.validate(chatbotId, flow.id, definition),
    onSuccess: (result) => {
      setValidation(result)
      setStatusMessage(
        result.valid ? 'Fluxo válido.' : 'Foram encontrados problemas no fluxo.',
      )
    },
    onError: (error) => {
      setStatusMessage(getErrorMessage(error, 'Erro ao validar o fluxo.'))
    },
  })

  return (
    <div className="-m-6 flex h-[calc(100dvh-4rem)] flex-col overflow-hidden">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-surface-700/80 bg-surface-900/90 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to={`/chatbots/${chatbotId}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-lg font-semibold text-white">{flow.name}</h1>
              <Badge variant="muted">v{flow.version}</Badge>
              {flow.published && <Badge variant="success">Publicado</Badge>}
              {isDirty && <Badge variant="warning">Não salvo</Badge>}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {statusMessage && (
            <span className="hidden text-xs text-muted sm:inline">{statusMessage}</span>
          )}
          <FlowImportExportActions
            flowName={flow.name}
            definition={definition}
            savedDefinition={flow.definition}
            onLoad={loadDefinition}
            chatbotId={chatbotId}
            flowId={flow.id}
          />
          <Button
            variant="secondary"
            size="sm"
            loading={validateMutation.isPending}
            onClick={() => validateMutation.mutate()}
          >
            <ShieldCheck className="size-4" />
            Validar
          </Button>
          <Button
            variant="secondary"
            size="sm"
            loading={saveMutation.isPending}
            disabled={!isDirty}
            onClick={() => saveMutation.mutate()}
          >
            <Save className="size-4" />
            Salvar
          </Button>
          <Button
            size="sm"
            loading={publishMutation.isPending}
            onClick={() => publishMutation.mutate()}
          >
            <CloudUpload className="size-4" />
            Publicar
          </Button>
        </div>
      </header>

      <FlowValidationBanner result={validation} onClose={() => setValidation(null)} />

      <div className="flex min-h-0 flex-1">
        <FlowNodePalette />

        <div className="relative min-w-0 flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onBeforeDelete={onBeforeDelete}
            nodeTypes={flowNodeTypes}
            fitView
            deleteKeyCode={['Backspace', 'Delete']}
            className="bg-surface-950"
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1e293b" />
            <Controls className="!border-surface-700 !bg-surface-900 [&>button]:!border-surface-600 [&>button]:!bg-surface-800 [&>button]:!fill-slate-300 [&>button:hover]:!bg-surface-700" />
            <MiniMap
              className="!border-surface-700 !bg-surface-900"
              nodeColor={(node: Node) => {
                if (node.type === 'start') return '#34d399'
                if (node.type === 'end') return '#94a3b8'
                if (node.type === 'question') return '#60a5fa'
                if (node.type === 'options') return '#fbbf24'
                if (node.type === 'input') return '#22d3ee'
                return '#a78bfa'
              }}
              maskColor="rgb(7 8 15 / 0.75)"
            />
          </ReactFlow>
        </div>

        <FlowPropertiesPanel selectedNode={selectedNode} />
      </div>
    </div>
  )
}

function FlowValidationBanner({
  result,
  onClose,
}: {
  result: FlowValidationResult | null
  onClose: () => void
}) {
  if (!result) return null

  const errors = result.issues.filter((issue) => issue.level === 'error')
  const warnings = result.issues.filter((issue) => issue.level === 'warning')

  return (
    <div
      className={cn(
        'flex shrink-0 items-start gap-3 border-b px-4 py-3',
        errors.length > 0
          ? 'border-red-500/30 bg-red-500/10'
          : warnings.length > 0
            ? 'border-amber-500/30 bg-amber-500/10'
            : 'border-emerald-500/30 bg-emerald-500/10',
      )}
    >
      <div className="mt-0.5 shrink-0">
        {errors.length > 0 ? (
          <XCircle className="size-5 text-red-400" />
        ) : warnings.length > 0 ? (
          <AlertTriangle className="size-5 text-amber-400" />
        ) : (
          <CheckCircle2 className="size-5 text-emerald-400" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        {result.issues.length === 0 ? (
          <p className="text-sm font-medium text-emerald-200">
            Tudo certo! O fluxo está pronto para publicar.
          </p>
        ) : (
          <>
            <p className="text-sm font-medium text-white">
              {errors.length > 0
                ? `${errors.length} erro(s) impedem a publicação`
                : `${warnings.length} aviso(s) encontrados`}
            </p>
            <ul className="mt-1.5 max-h-40 space-y-1 overflow-y-auto text-xs">
              {errors.map((issue, index) => (
                <li key={`err-${index}`} className="flex gap-1.5 text-red-200">
                  <span className="text-red-400">•</span>
                  <span>{issue.message}</span>
                </li>
              ))}
              {warnings.map((issue, index) => (
                <li key={`warn-${index}`} className="flex gap-1.5 text-amber-200">
                  <span className="text-amber-400">•</span>
                  <span>{issue.message}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-surface-700/50 hover:text-white"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
