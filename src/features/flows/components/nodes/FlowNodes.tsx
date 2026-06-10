import { Handle, Position, type NodeProps } from '@xyflow/react'

import type { FlowNode } from '@/types/flow'
import { cn } from '@/utils/cn'

type FlowNodeProps = NodeProps<FlowNode>

function NodeShell({
  selected,
  accent,
  title,
  children,
  showTarget = true,
  showSource = true,
}: {
  selected: boolean
  accent: string
  title: string
  children: React.ReactNode
  showTarget?: boolean
  showSource?: boolean
}) {
  return (
    <div
      className={cn(
        'min-w-[200px] rounded-xl border bg-surface-900/95 px-4 py-3 shadow-lg shadow-black/30 backdrop-blur-sm',
        selected ? 'border-accent-500 ring-2 ring-accent-500/40' : 'border-surface-600',
      )}
    >
      {showTarget && (
        <Handle
          type="target"
          position={Position.Top}
          className="!size-2.5 !border-2 !border-surface-700 !bg-accent-500"
        />
      )}
      <div className={cn('mb-1 text-[10px] font-semibold uppercase tracking-wider', accent)}>
        {title}
      </div>
      {children}
      {showSource && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!size-2.5 !border-2 !border-surface-700 !bg-accent-500"
        />
      )}
    </div>
  )
}

export function StartNode({ data, selected }: FlowNodeProps) {
  return (
    <NodeShell selected={!!selected} accent="text-emerald-400" title="Início" showTarget={false}>
      <p className="text-sm font-medium text-white">{data.label}</p>
    </NodeShell>
  )
}

export function MessageNode({ data, selected }: FlowNodeProps) {
  return (
    <NodeShell selected={!!selected} accent="text-accent-400" title="Mensagem">
      <p className="text-sm text-slate-200">{data.text?.trim() || 'Nova mensagem...'}</p>
    </NodeShell>
  )
}

export function QuestionNode({ data, selected }: FlowNodeProps) {
  return (
    <NodeShell selected={!!selected} accent="text-blue-400" title="Pergunta">
      <p className="text-sm text-slate-200">{data.text?.trim() || 'Nova pergunta...'}</p>
    </NodeShell>
  )
}

export function EndNode({ data, selected }: FlowNodeProps) {
  return (
    <NodeShell selected={!!selected} accent="text-slate-400" title="Fim" showSource={false}>
      <p className="text-sm font-medium text-white">{data.label}</p>
    </NodeShell>
  )
}
