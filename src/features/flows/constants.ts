import type { FlowDefinition, FlowNodeType, FlowOption } from '@/types/flow'

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
    description: 'Pergunta de Sim/Não com dois caminhos',
    color: 'blue',
  },
  options: {
    label: 'Opções',
    description: 'Múltipla escolha com um caminho por opção',
    color: 'amber',
  },
  input: {
    label: 'Captura',
    description: 'Captura uma resposta e salva em variável',
    color: 'cyan',
  },
  end: {
    label: 'Fim',
    description: 'Encerra a conversa',
    color: 'slate',
  },
}

export const FLOW_INPUT_TYPE_LABELS: Record<
  NonNullable<FlowDefinition['nodes'][number]['data']['inputType']>,
  string
> = {
  text: 'Texto',
  email: 'E-mail',
  phone: 'Telefone',
  number: 'Número',
  cpf: 'CPF',
}

export function createDefaultFlowDefinition(): FlowDefinition {
  return {
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        position: { x: 280, y: 40 },
        data: { label: 'Início' },
        deletable: false,
      },
    ],
    edges: [],
  }
}

export function normalizeFlowNodes<T extends FlowDefinition['nodes'][number]>(nodes: T[]): T[] {
  return nodes.map((node) =>
    node.type === 'start' ? { ...node, deletable: false } : node,
  )
}

export function createNodeId(type: FlowNodeType): string {
  return `${type}-${crypto.randomUUID().slice(0, 8)}`
}

export function createOptionId(): string {
  return `opt-${crypto.randomUUID().slice(0, 8)}`
}

export function createFlowOption(label: string): FlowOption {
  return { id: createOptionId(), label }
}

export function createFlowNode(type: FlowNodeType, position: { x: number; y: number }) {
  const meta = FLOW_NODE_META[type]

  const data: FlowDefinition['nodes'][number]['data'] = { label: meta.label }

  if (type === 'message' || type === 'question' || type === 'options' || type === 'input') {
    data.text = ''
  }

  if (type === 'options') {
    data.options = [createFlowOption('Opção 1'), createFlowOption('Opção 2')]
    data.listOptions = true
    data.maxAttempts = 1
  }

  if (type === 'input') {
    data.inputType = 'text'
    data.variable = ''
    data.maxAttempts = 2
  }

  return {
    id: createNodeId(type),
    type,
    position,
    data,
    ...(type === 'start' ? { deletable: false } : {}),
  }
}
