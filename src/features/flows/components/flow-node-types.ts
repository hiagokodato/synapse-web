import { EndNode, MessageNode, QuestionNode, StartNode } from '@/features/flows/components/nodes/FlowNodes'

export const flowNodeTypes = {
  start: StartNode,
  message: MessageNode,
  question: QuestionNode,
  end: EndNode,
}
