import type { FlowDefinition, FlowInputType, FlowNodeType, FlowOption } from '@/types/flow'

const VALID_NODE_TYPES: FlowNodeType[] = [
  'start',
  'message',
  'question',
  'options',
  'input',
  'end',
]

const VALID_INPUT_TYPES: FlowInputType[] = ['text', 'email', 'phone', 'number', 'cpf']

function parseImportedOptions(raw: unknown): FlowOption[] | undefined {
  if (!Array.isArray(raw)) return undefined

  const options: FlowOption[] = []
  raw.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object') return
    const item = entry as Record<string, unknown>
    const label = typeof item.label === 'string' ? item.label : undefined
    if (!label) return
    const id = typeof item.id === 'string' && item.id.trim() ? item.id : `opt-${index}`
    const value = typeof item.value === 'string' ? item.value : undefined
    options.push({ id, label, ...(value !== undefined ? { value } : {}) })
  })

  return options.length > 0 ? options : undefined
}

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
    const data = item.data as Record<string, unknown> | undefined

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

    const inputType =
      typeof data?.inputType === 'string' &&
      VALID_INPUT_TYPES.includes(data.inputType as FlowInputType)
        ? (data.inputType as FlowInputType)
        : undefined

    return {
      id,
      type,
      position: { x: position.x, y: position.y },
      data: {
        label: typeof data?.label === 'string' ? data.label : type,
        text: typeof data?.text === 'string' ? data.text : undefined,
        options: parseImportedOptions(data?.options),
        variable:
          typeof data?.variable === 'string' && data.variable.trim()
            ? data.variable.trim()
            : undefined,
        inputType,
        maxAttempts:
          typeof data?.maxAttempts === 'number' && Number.isFinite(data.maxAttempts)
            ? Math.max(0, Math.floor(data.maxAttempts))
            : undefined,
        invalidMessage:
          typeof data?.invalidMessage === 'string' ? data.invalidMessage : undefined,
        listOptions: typeof data?.listOptions === 'boolean' ? data.listOptions : undefined,
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
