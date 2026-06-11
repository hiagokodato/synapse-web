import {
  EndNode,
  InputNode,
  MessageNode,
  OptionsNode,
  QuestionNode,
  StartNode,
} from '@/features/flows/components/nodes/FlowNodes'

export const flowNodeTypes = {
  start: StartNode,
  message: MessageNode,
  question: QuestionNode,
  options: OptionsNode,
  input: InputNode,
  end: EndNode,
}
