import type { Edge, Node } from '@xyflow/react'

export type FlowNodeType = 'start' | 'message' | 'question' | 'end'

export type FlowNodeData = {
  label: string
  text?: string
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
