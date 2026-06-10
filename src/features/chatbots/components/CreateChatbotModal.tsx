import { useMutation, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Modal } from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Textarea'
import { createChatbotSchema, type CreateChatbotFormValues } from '@/features/chatbots/schemas'
import { getErrorMessage } from '@/services/api'
import { chatbotService } from '@/services/chatbot.service'
import { queryKeys } from '@/utils/query-keys'

type CreateChatbotModalProps = {
  open: boolean
  onClose: () => void
}

export function CreateChatbotModal({ open, onClose }: CreateChatbotModalProps) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<CreateChatbotFormValues>({
    resolver: zodResolver(createChatbotSchema),
    defaultValues: { name: '', description: '' },
  })

  const mutation = useMutation({
    mutationFn: chatbotService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.chatbots.all })
      await queryClient.invalidateQueries({ queryKey: queryKeys.analytics.overview })
      reset()
      onClose()
    },
    onError: (error) => {
      setError('root', {
        message: getErrorMessage(error, 'Não foi possível criar o chatbot.'),
      })
    },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Novo chatbot"
      description="Crie um chatbot para começar a definir fluxos conversacionais."
    >
      <form
        className="space-y-4"
        onSubmit={handleSubmit((values) =>
          mutation.mutate({
            name: values.name,
            description: values.description || undefined,
          }),
        )}
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="create-name">Nome</Label>
          <Input
            id="create-name"
            placeholder="Ex: Bot de Suporte"
            error={!!errors.name}
            {...register('name')}
          />
          {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="create-description">Descrição (opcional)</Label>
          <Textarea
            id="create-description"
            placeholder="Descreva o propósito deste chatbot..."
            error={!!errors.description}
            {...register('description')}
          />
          {errors.description && (
            <p className="text-xs text-red-400">{errors.description.message}</p>
          )}
        </div>

        {errors.root && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {errors.root.message}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={mutation.isPending}>
            Criar chatbot
          </Button>
        </div>
      </form>
    </Modal>
  )
}
