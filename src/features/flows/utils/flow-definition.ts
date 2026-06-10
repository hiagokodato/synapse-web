import type { FlowDefinition, FlowNodeType } from '@/types/flow'

const VALID_NODE_TYPES: FlowNodeType[] = ['start', 'message', 'question', 'end']

export class FlowDefinitionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FlowDefinitionError'
  }
}

export function parseFlowDefinition(raw: unknown): FlowDefinition {
  if (!raw || typeof raw !== 'object') {
    throw new FlowDefinitionError('JSON inválido. Esperado um objeto com nodes e edges.')
  }

  const candidate = raw as Partial<FlowDefinition>

  if (!Array.isArray(candidate.nodes) || !Array.isArray(candidate.edges)) {
    throw new FlowDefinitionError('O fluxo deve conter arrays "nodes" e "edges".')
  }

  const nodes = candidate.nodes.map((node, index) => {
    if (!node || typeof node !== 'object') {
      throw new FlowDefinitionError(`Nó ${index + 1} inválido.`)
    }

    const item = node as Record<string, unknown>
    const type = item.type as FlowNodeType
    const id = item.id
    const position = item.position as { x?: unknown; y?: unknown } | undefined
    const data = item.data as { label?: unknown; text?: unknown } | undefined

    if (typeof id !== 'string' || !id.trim()) {
      throw new FlowDefinitionError(`Nó ${index + 1}: id é obrigatório.`)
    }

    if (!VALID_NODE_TYPES.includes(type)) {
      throw new FlowDefinitionError(`Nó ${index + 1}: tipo "${String(type)}" não suportado.`)
    }

    if (
      !position ||
      typeof position.x !== 'number' ||
      typeof position.y !== 'number'
    ) {
      throw new FlowDefinitionError(`Nó ${index + 1}: position { x, y } inválida.`)
    }

    return {
      id,
      type,
      position: { x: position.x, y: position.y },
      data: {
        label: typeof data?.label === 'string' ? data.label : type,
        text: typeof data?.text === 'string' ? data.text : undefined,
      },
    }
  })

  const edges = candidate.edges.map((edge, index) => {
    if (!edge || typeof edge !== 'object') {
      throw new FlowDefinitionError(`Conexão ${index + 1} inválida.`)
    }

    const item = edge as Record<string, unknown>
    const id = item.id
    const source = item.source
    const target = item.target

    if (typeof source !== 'string' || typeof target !== 'string') {
      throw new FlowDefinitionError(`Conexão ${index + 1}: source e target são obrigatórios.`)
    }

    return {
      id: typeof id === 'string' ? id : `edge-${source}-${target}-${index}`,
      source,
      target,
      ...(typeof item.sourceHandle === 'string' ? { sourceHandle: item.sourceHandle } : {}),
      ...(typeof item.targetHandle === 'string' ? { targetHandle: item.targetHandle } : {}),
    }
  })

  return { nodes, edges }
}

export function readFlowDefinitionFile(file: File): Promise<FlowDefinition> {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      reject(new FlowDefinitionError('Selecione um arquivo .json válido.'))
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as unknown
        resolve(parseFlowDefinition(parsed))
      } catch (error) {
        if (error instanceof FlowDefinitionError) {
          reject(error)
          return
        }

        reject(new FlowDefinitionError('Não foi possível ler o arquivo JSON.'))
      }
    }

    reader.onerror = () => {
      reject(new FlowDefinitionError('Falha ao ler o arquivo.'))
    }

    reader.readAsText(file)
  })
}

export function downloadFlowDefinition(name: string, definition: FlowDefinition) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

  const blob = new Blob([JSON.stringify(definition, null, 2)], {
    type: 'application/json',
  })

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${slug || 'fluxo'}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}
