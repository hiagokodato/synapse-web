import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { Spinner } from '@/components/ui/Spinner'
import { FlowBuilder } from '@/features/flows/components/FlowBuilder'
import { useFlow } from '@/features/flows/hooks/useFlows'
import { getErrorMessage } from '@/services/api'

export function FlowBuilderPage() {
  const { id: chatbotId = '', flowId = '' } = useParams()

  const { data: flow, isLoading, isError, error } = useFlow(chatbotId, flowId)

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="text-accent-400" />
      </div>
    )
  }

  if (isError || !flow) {
    return (
      <div className="space-y-4">
        <Link
          to={`/chatbots/${chatbotId}`}
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Voltar ao chatbot
        </Link>
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {getErrorMessage(error, 'Fluxo não encontrado.')}
        </p>
      </div>
    )
  }

  return <FlowBuilder chatbotId={chatbotId} flow={flow} />
}
