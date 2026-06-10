import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { conversationService } from '@/services/conversation.service'
import { getErrorMessage } from '@/services/api'
import { queryKeys } from '@/utils/query-keys'

type StartConversationModalProps = {
  chatbotId: string
  open: boolean
  onClose: () => void
}

export function StartConversationModal({
  chatbotId,
  open,
  onClose,
}: StartConversationModalProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () =>
      conversationService.create(chatbotId, {
        metadata: { channel: 'web' },
      }),
    onSuccess: async (conversation) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.conversations.list(chatbotId) })
      await queryClient.invalidateQueries({ queryKey: queryKeys.chatbots.detail(chatbotId) })
      await queryClient.invalidateQueries({ queryKey: queryKeys.analytics.overview })
      onClose()
      navigate(`/conversations/${chatbotId}/${conversation.id}`)
    },
  })

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nova conversa"
      description="Inicie uma conversa de teste com este chatbot."
    >
      <div className="space-y-4">
        {mutation.isError && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {getErrorMessage(mutation.error, 'Não foi possível criar a conversa.')}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button loading={mutation.isPending} onClick={() => mutation.mutate()}>
            Iniciar conversa
          </Button>
        </div>
      </div>
    </Modal>
  )
}
