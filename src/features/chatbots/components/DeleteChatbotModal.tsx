import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { getErrorMessage } from '@/services/api'
import { chatbotService } from '@/services/chatbot.service'
import type { Chatbot } from '@/types/chatbot'
import { queryKeys } from '@/utils/query-keys'

type DeleteChatbotModalProps = {
  chatbot: Chatbot | null
  open: boolean
  onClose: () => void
  onDeleted?: () => void
}

export function DeleteChatbotModal({
  chatbot,
  open,
  onClose,
  onDeleted,
}: DeleteChatbotModalProps) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => chatbotService.remove(chatbot!.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.chatbots.all })
      await queryClient.invalidateQueries({ queryKey: queryKeys.analytics.overview })
      onClose()
      onDeleted?.()
    },
  })

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Excluir chatbot"
      description="Esta ação é permanente e remove todos os fluxos associados."
    >
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-4">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-400" />
          <p className="text-sm text-slate-300">
            Tem certeza que deseja excluir <strong className="text-white">{chatbot?.name}</strong>?
            Todas as conversas e fluxos vinculados serão removidos.
          </p>
        </div>

        {mutation.isError && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {getErrorMessage(mutation.error, 'Não foi possível excluir o chatbot.')}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            className="bg-red-600 shadow-red-600/20 hover:bg-red-700"
            loading={mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            Excluir permanentemente
          </Button>
        </div>
      </div>
    </Modal>
  )
}
