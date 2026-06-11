import { api } from '@/services/api'
import type {
  CreateFlowPayload,
  Flow,
  FlowDefinition,
  FlowValidationResult,
  UpdateFlowPayload,
} from '@/types/flow'

function parseDefinition(raw: unknown): FlowDefinition {
  if (!raw || typeof raw !== 'object') {
    return { nodes: [], edges: [] }
  }

  const def = raw as Partial<FlowDefinition>
  return {
    nodes: Array.isArray(def.nodes) ? def.nodes : [],
    edges: Array.isArray(def.edges) ? def.edges : [],
  }
}

function mapFlow(raw: Flow): Flow {
  return {
    ...raw,
    definition: parseDefinition(raw.definition),
  }
}

export const flowService = {
  async list(chatbotId: string): Promise<Flow[]> {
    const { data } = await api.get<Flow[]>(`/chatbots/${chatbotId}/flows`)
    return data.map(mapFlow)
  },

  async getById(chatbotId: string, flowId: string): Promise<Flow> {
    const { data } = await api.get<Flow>(`/chatbots/${chatbotId}/flows/${flowId}`)
    return mapFlow(data)
  },

  async create(chatbotId: string, payload: CreateFlowPayload): Promise<Flow> {
    const { data } = await api.post<Flow>(`/chatbots/${chatbotId}/flows`, payload)
    return mapFlow(data)
  },

  async update(chatbotId: string, flowId: string, payload: UpdateFlowPayload): Promise<Flow> {
    const { data } = await api.patch<Flow>(`/chatbots/${chatbotId}/flows/${flowId}`, payload)
    return mapFlow(data)
  },

  async remove(chatbotId: string, flowId: string): Promise<void> {
    await api.delete(`/chatbots/${chatbotId}/flows/${flowId}`)
  },

  async validate(
    chatbotId: string,
    flowId: string,
    definition: FlowDefinition,
  ): Promise<FlowValidationResult> {
    const { data } = await api.post<FlowValidationResult>(
      `/chatbots/${chatbotId}/flows/${flowId}/validate`,
      { definition },
    )
    return data
  },
}
