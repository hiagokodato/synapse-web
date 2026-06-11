import { useCallback } from 'react'
import { useReactFlow } from '@xyflow/react'

import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { FLOW_NODE_META } from '@/features/flows/constants'
import type { FlowNode, FlowNodeType } from '@/types/flow'

type FlowPropertiesPanelProps = {
  selectedNode: FlowNode | null
}

function getEditableNodeText(node: FlowNode, type: FlowNodeType): string {
  if (node.data.text !== undefined && node.data.text !== '') {
    return node.data.text
  }

  const label = node.data.label.trim()
  const defaultLabel = FLOW_NODE_META[type].label
  if (label && label !== defaultLabel) {
    return label
  }

  return ''
}

export function FlowPropertiesPanel({ selectedNode }: FlowPropertiesPanelProps) {
  const { setNodes } = useReactFlow()

  const updateNodeData = useCallback(
    (field: 'label' | 'text', value: string) => {
      if (!selectedNode) return

      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id !== selectedNode.id) return node

          const nodeType = node.type as FlowNodeType
          const nextData = { ...node.data, [field]: value }

          if (field === 'text' && (nodeType === 'message' || nodeType === 'question')) {
            nextData.label = FLOW_NODE_META[nodeType].label
          }

          return { ...node, data: nextData }
        }),
      )
    },
    [selectedNode, setNodes],
  )

  if (!selectedNode) {
    return (
      <aside className="flex w-72 shrink-0 flex-col border-l border-surface-700/80 bg-surface-900/80 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Propriedades</h3>
        <p className="mt-4 text-sm text-slate-500">Selecione um nó para editar suas propriedades.</p>
      </aside>
    )
  }

  const type = selectedNode.type as FlowNodeType
  const meta = FLOW_NODE_META[type]
  const hasText = type === 'message' || type === 'question'
  const hasLabel = type === 'start' || type === 'end'

  return (
    <aside className="flex w-72 shrink-0 flex-col border-l border-surface-700/80 bg-surface-900/80 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Propriedades</h3>
      <p className="mt-1 mb-4 text-sm font-medium text-white">{meta.label}</p>

      <div className="space-y-4">
        {hasLabel && (
          <div className="space-y-2">
            <Label htmlFor="node-label">Rótulo</Label>
            <Input
              id="node-label"
              value={selectedNode.data.label}
              onChange={(e) => updateNodeData('label', e.target.value)}
            />
          </div>
        )}

        {hasText && (
          <div className="space-y-2">
            <Label htmlFor="node-text">{type === 'message' ? 'Texto da mensagem' : 'Texto da pergunta'}</Label>
            <Textarea
              id="node-text"
              value={getEditableNodeText(selectedNode, type)}
              onChange={(e) => updateNodeData('text', e.target.value)}
              placeholder={
                type === 'message' ? 'Texto que o bot enviará...' : 'Pergunta para o usuário...'
              }
            />
            <p className="text-xs text-slate-500">
              O título do bloco ({meta.label}) permanece fixo; apenas este texto é enviado ao usuário.
            </p>
          </div>
        )}

        <p className="text-xs text-slate-500">ID: {selectedNode.id}</p>
      </div>
    </aside>
  )
}
