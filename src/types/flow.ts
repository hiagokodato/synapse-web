import type { Edge, Node } from '@xyflow/react'

export type FlowNodeType =
  | 'start'
  | 'message'
  | 'question'
  | 'options'
  | 'list'
  | 'input'
  | 'end'

export type FlowInputType = 'text' | 'email' | 'phone' | 'number' | 'cpf'

export type FlowOption = {
  id: string
  label: string
  value?: string
}

export type FlowNodeData = {
  label: string
  text?: string
  options?: FlowOption[]
  variable?: string
  inputType?: FlowInputType
  maxAttempts?: number
  invalidMessage?: string
  listOptions?: boolean
  multiple?: boolean
}

export type FlowNode = Node<FlowNodeData, FlowNodeType>
export type FlowEdge = Edge

export type FlowDefinition = {
  nodes: FlowNode[]
  edges: FlowEdge[]
}

export type Flow = {
  id: string
  chatbotId: string
  name: string
  definition: FlowDefinition
  version: number
  published: boolean
  createdAt: string
  updatedAt: string
}

export type CreateFlowPayload = {
  name: string
  definition?: FlowDefinition
}

export type UpdateFlowPayload = {
  name?: string
  definition?: FlowDefinition
  published?: boolean
}

export type FlowValidationLevel = 'error' | 'warning'

export type FlowValidationIssue = {
  level: FlowValidationLevel
  code: string
  message: string
  nodeId?: string
  edgeId?: string
}

export type FlowValidationResult = {
  valid: boolean
  issues: FlowValidationIssue[]
}
