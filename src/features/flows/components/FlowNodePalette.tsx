import {
  CirclePlay,
  HelpCircle,
  MessageSquare,
  Octagon,
  type LucideIcon,
} from 'lucide-react'
import { useCallback } from 'react'
import { useReactFlow } from '@xyflow/react'

import { FLOW_NODE_META, createFlowNode } from '@/features/flows/constants'
import type { FlowNodeType } from '@/types/flow'
import { cn } from '@/utils/cn'

const NODE_ICONS: Record<FlowNodeType, LucideIcon> = {
  start: CirclePlay,
  message: MessageSquare,
  question: HelpCircle,
  end: Octagon,
}

const PALETTE_TYPES: FlowNodeType[] = ['message', 'question', 'end']

export function FlowNodePalette() {
  const { screenToFlowPosition, setNodes } = useReactFlow()

  const addNode = useCallback(
    (type: FlowNodeType) => {
      const position = screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      })

      const node = createFlowNode(type, {
        x: position.x + Math.random() * 80 - 40,
        y: position.y + Math.random() * 80 - 40,
      })

      setNodes((nodes) => [...nodes, node])
    },
    [screenToFlowPosition, setNodes],
  )

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-surface-700/80 bg-surface-900/80 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Nós</h3>
      <p className="mt-1 mb-4 text-xs text-slate-500">Clique para adicionar ao canvas</p>

      <div className="space-y-2">
        {PALETTE_TYPES.map((type) => {
          const meta = FLOW_NODE_META[type]
          const Icon = NODE_ICONS[type]

          return (
            <button
              key={type}
              type="button"
              onClick={() => addNode(type)}
              className={cn(
                'flex w-full items-start gap-3 rounded-lg border border-surface-700/80 bg-surface-800/60 p-3 text-left transition-colors hover:border-accent-500/40 hover:bg-surface-800',
              )}
            >
              <Icon className="mt-0.5 size-4 shrink-0 text-accent-400" />
              <div>
                <div className="text-sm font-medium text-slate-200">{meta.label}</div>
                <div className="text-xs text-slate-500">{meta.description}</div>
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
