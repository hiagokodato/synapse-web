import {
  EndNode,
  InputNode,
  ListNode,
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
  list: ListNode,
  input: InputNode,
  end: EndNode,
}
