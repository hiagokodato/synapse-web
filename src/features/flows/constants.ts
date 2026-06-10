import type { FlowDefinition, FlowNodeType } from '@/types/flow'

export const FLOW_NODE_META: Record<
  FlowNodeType,
  { label: string; description: string; color: string }
> = {
  start: {
    label: 'Início',
    description: 'Ponto de entrada do fluxo',
    color: 'emerald',
  },
  message: {
    label: 'Mensagem',
    description: 'Bot envia uma mensagem',
    color: 'violet',
  },
  question: {
    label: 'Pergunta',
    description: 'Bot faz uma pergunta e aguarda resposta',
    color: 'blue',
  },
  end: {
    label: 'Fim',
    description: 'Encerra a conversa',
    color: 'slate',
  },
}

export function createDefaultFlowDefinition(): FlowDefinition {
  return {
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        position: { x: 280, y: 40 },
        data: { label: 'Início' },
      },
    ],
    edges: [],
  }
}

export function createNodeId(type: FlowNodeType): string {
  return `${type}-${crypto.randomUUID().slice(0, 8)}`
}

export function createFlowNode(type: FlowNodeType, position: { x: number; y: number }) {
  const meta = FLOW_NODE_META[type]

  return {
    id: createNodeId(type),
    type,
    position,
    data: {
      label: meta.label,
      text: type === 'message' || type === 'question' ? '' : undefined,
    },
  }
}
