import { Handle, Position, type NodeProps } from '@xyflow/react'

import { FLOW_NODE_META } from '@/features/flows/constants'
import type { FlowNode, FlowNodeType } from '@/types/flow'
import { cn } from '@/utils/cn'

const ACCENT_CLASS: Record<FlowNodeType, string> = {
  start: 'text-emerald-400',
  message: 'text-accent-400',
  question: 'text-blue-400',
  options: 'text-amber-400',
  input: 'text-cyan-400',
  end: 'text-slate-400',
}

function nodeName(type: FlowNodeType, data: FlowNode['data']): string {
  const label = data.label?.trim()
  return label || FLOW_NODE_META[type].label
}

type FlowNodeProps = NodeProps<FlowNode>

function NodeFrame({
  selected,
  type,
  children,
  className,
}: {
  selected: boolean
  type: FlowNodeType
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative min-w-[180px] rounded-xl border bg-surface-900/95 px-4 py-3 shadow-lg shadow-black/30 backdrop-blur-sm',
        selected ? 'border-accent-500 ring-2 ring-accent-500/40' : 'border-surface-600',
        className,
      )}
    >
      <div
        className={cn(
          'text-[10px] font-semibold uppercase tracking-wider',
          ACCENT_CLASS[type],
        )}
      >
        {FLOW_NODE_META[type].label}
      </div>
      {children}
    </div>
  )
}

export function StartNode({ data, selected }: FlowNodeProps) {
  return (
    <NodeFrame selected={!!selected} type="start">
      <p className="mt-0.5 text-sm font-medium text-white">{nodeName('start', data)}</p>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!size-2.5 !border-2 !border-surface-700 !bg-accent-500"
      />
    </NodeFrame>
  )
}

export function MessageNode({ data, selected }: FlowNodeProps) {
  return (
    <NodeFrame selected={!!selected} type="message">
      <Handle
        type="target"
        position={Position.Top}
        className="!size-2.5 !border-2 !border-surface-700 !bg-accent-500"
      />
      <p className="mt-0.5 text-sm font-medium text-white">{nodeName('message', data)}</p>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!size-2.5 !border-2 !border-surface-700 !bg-accent-500"
      />
    </NodeFrame>
  )
}

export function QuestionNode({ data, selected }: FlowNodeProps) {
  return (
    <NodeFrame selected={!!selected} type="question" className="min-w-[200px] pb-6">
      <Handle
        type="target"
        position={Position.Top}
        className="!size-2.5 !border-2 !border-surface-700 !bg-accent-500"
      />
      <p className="mt-0.5 text-sm font-medium text-white">{nodeName('question', data)}</p>

      <span className="pointer-events-none absolute bottom-2 left-[20%] text-[10px] font-medium text-emerald-400">
        Sim
      </span>
      <span className="pointer-events-none absolute bottom-2 left-[68%] text-[10px] font-medium text-red-400">
        Não
      </span>
      <Handle
        type="source"
        id="yes"
        position={Position.Bottom}
        style={{ left: '25%' }}
        className="!size-2.5 !border-2 !border-surface-700 !bg-emerald-500"
      />
      <Handle
        type="source"
        id="no"
        position={Position.Bottom}
        style={{ left: '75%' }}
        className="!size-2.5 !border-2 !border-surface-700 !bg-red-500"
      />
      <Handle
        type="source"
        id="fallback"
        position={Position.Right}
        className="!size-2.5 !border-2 !border-surface-700 !bg-slate-500"
      />
    </NodeFrame>
  )
}

export function OptionsNode({ data, selected }: FlowNodeProps) {
  const options = data.options ?? []

  return (
    <NodeFrame selected={!!selected} type="options" className="min-w-[200px]">
      <Handle
        type="target"
        position={Position.Top}
        className="!size-2.5 !border-2 !border-surface-700 !bg-accent-500"
      />
      <p className="mt-0.5 text-sm font-medium text-white">{nodeName('options', data)}</p>

      <div className="mt-2 space-y-1.5">
        {options.length === 0 && (
          <p className="text-xs text-red-300">Adicione ao menos uma opção.</p>
        )}
        {options.map((option, index) => (
          <div
            key={option.id}
            className="relative flex h-6 items-center rounded-md border border-surface-600 bg-surface-800/60 px-2"
          >
            <span className="text-[11px] font-medium text-amber-300">{index + 1}</span>
            <Handle
              type="source"
              id={option.id}
              position={Position.Right}
              className="!size-2.5 !border-2 !border-surface-700 !bg-amber-500"
              style={{ top: '50%', right: -22, transform: 'translateY(-50%)' }}
            />
          </div>
        ))}
      </div>

      <div className="mt-2.5 flex items-center gap-1.5 border-t border-surface-700/70 pt-2">
        <span className="size-1.5 rounded-full bg-slate-500" />
        <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
          Fallback
        </span>
      </div>
      <Handle
        type="source"
        id="fallback"
        position={Position.Bottom}
        className="!size-2.5 !border-2 !border-surface-700 !bg-slate-500"
      />
    </NodeFrame>
  )
}

export function InputNode({ data, selected }: FlowNodeProps) {
  return (
    <NodeFrame selected={!!selected} type="input" className="min-w-[200px] pb-6">
      <Handle
        type="target"
        position={Position.Top}
        className="!size-2.5 !border-2 !border-surface-700 !bg-accent-500"
      />
      <p className="mt-0.5 text-sm font-medium text-white">{nodeName('input', data)}</p>

      <span className="pointer-events-none absolute bottom-2 left-[20%] text-[10px] font-medium text-cyan-400">
        OK
      </span>
      <span className="pointer-events-none absolute bottom-2 left-[64%] text-[10px] font-medium text-slate-400">
        Falha
      </span>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ left: '25%' }}
        className="!size-2.5 !border-2 !border-surface-700 !bg-cyan-500"
      />
      <Handle
        type="source"
        id="fallback"
        position={Position.Bottom}
        style={{ left: '75%' }}
        className="!size-2.5 !border-2 !border-surface-700 !bg-slate-500"
      />
    </NodeFrame>
  )
}

export function EndNode({ data, selected }: FlowNodeProps) {
  return (
    <NodeFrame selected={!!selected} type="end">
      <Handle
        type="target"
        position={Position.Top}
        className="!size-2.5 !border-2 !border-surface-700 !bg-accent-500"
      />
      <p className="mt-0.5 text-sm font-medium text-white">{nodeName('end', data)}</p>
    </NodeFrame>
  )
}
