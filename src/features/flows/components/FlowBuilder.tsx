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
import { ArrowLeft, CloudUpload, Save } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { FlowNodePalette } from '@/features/flows/components/FlowNodePalette'
import { FlowImportExportActions } from '@/features/flows/components/LoadFlowModal'
import { FlowPropertiesPanel } from '@/features/flows/components/FlowPropertiesPanel'
import { flowNodeTypes } from '@/features/flows/components/flow-node-types'
import { getErrorMessage } from '@/services/api'
import { flowService } from '@/services/flow.service'
import type { Flow, FlowNode } from '@/types/flow'
import { queryKeys } from '@/utils/query-keys'

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
  const [nodes, setNodes, onNodesChange] = useNodesState(flow.definition.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(flow.definition.edges)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null
    return (nodes.find((node) => node.id === selectedNodeId) as FlowNode | undefined) ?? null
  }, [nodes, selectedNodeId])

  const definition = useMemo(() => ({ nodes, edges }), [nodes, edges])

  const loadDefinition = useCallback(
    (next: Flow['definition']) => {
      setNodes(next.nodes)
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
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
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
      setStatusMessage('Fluxo publicado com sucesso.')
    },
    onError: (error) => {
      setStatusMessage(getErrorMessage(error, 'Erro ao publicar o fluxo.'))
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

      <div className="flex min-h-0 flex-1">
        <FlowNodePalette />

        <div className="relative min-w-0 flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
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
