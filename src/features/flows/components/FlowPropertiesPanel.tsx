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

export function FlowPropertiesPanel({ selectedNode }: FlowPropertiesPanelProps) {
  const { setNodes } = useReactFlow()

  const updateNodeData = useCallback(
    (field: 'label' | 'text', value: string) => {
      if (!selectedNode) return

      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === selectedNode.id
            ? { ...node, data: { ...node.data, [field]: value } }
            : node,
        ),
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

  return (
    <aside className="flex w-72 shrink-0 flex-col border-l border-surface-700/80 bg-surface-900/80 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Propriedades</h3>
      <p className="mt-1 mb-4 text-sm font-medium text-white">{meta.label}</p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="node-label">Rótulo</Label>
          <Input
            id="node-label"
            value={selectedNode.data.label}
            onChange={(e) => updateNodeData('label', e.target.value)}
          />
        </div>

        {hasText && (
          <div className="space-y-2">
            <Label htmlFor="node-text">{type === 'message' ? 'Mensagem' : 'Pergunta'}</Label>
            <Textarea
              id="node-text"
              value={selectedNode.data.text ?? ''}
              onChange={(e) => updateNodeData('text', e.target.value)}
              placeholder={
                type === 'message' ? 'Texto que o bot enviará...' : 'Pergunta para o usuário...'
              }
            />
          </div>
        )}

        <p className="text-xs text-slate-500">ID: {selectedNode.id}</p>
      </div>
    </aside>
  )
}
