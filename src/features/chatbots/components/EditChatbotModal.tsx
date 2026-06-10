import { useMutation, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { statusConfig } from '@/features/chatbots/constants'
import { updateChatbotSchema, type UpdateChatbotFormValues } from '@/features/chatbots/schemas'
import { getErrorMessage } from '@/services/api'
import { chatbotService } from '@/services/chatbot.service'
import type { Chatbot } from '@/types/chatbot'
import { queryKeys } from '@/utils/query-keys'

type EditChatbotModalProps = {
  chatbot: Chatbot | null
  open: boolean
  onClose: () => void
}

export function EditChatbotModal({ chatbot, open, onClose }: EditChatbotModalProps) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<UpdateChatbotFormValues>({
    resolver: zodResolver(updateChatbotSchema),
    defaultValues: { name: '', description: '', status: 'DRAFT' },
  })

  useEffect(() => {
    if (chatbot) {
      reset({
        name: chatbot.name,
        description: chatbot.description ?? '',
        status: chatbot.status,
      })
    }
  }, [chatbot, reset])

  const mutation = useMutation({
    mutationFn: (values: UpdateChatbotFormValues) =>
      chatbotService.update(chatbot!.id, {
        name: values.name,
        description: values.description || undefined,
        status: values.status,
      }),
    onSuccess: async (updated) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.chatbots.all })
      await queryClient.invalidateQueries({ queryKey: queryKeys.chatbots.detail(updated.id) })
      await queryClient.invalidateQueries({ queryKey: queryKeys.analytics.overview })
      onClose()
    },
    onError: (error) => {
      setError('root', {
        message: getErrorMessage(error, 'Não foi possível atualizar o chatbot.'),
      })
    },
  })

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Editar chatbot"
      description="Atualize as informações e o status do chatbot."
    >
      <form
        className="space-y-4"
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="edit-name">Nome</Label>
          <Input id="edit-name" error={!!errors.name} {...register('name')} />
          {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-description">Descrição</Label>
          <Textarea id="edit-description" error={!!errors.description} {...register('description')} />
          {errors.description && (
            <p className="text-xs text-red-400">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-status">Status</Label>
          <Select id="edit-status" error={!!errors.status} {...register('status')}>
            {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => (
              <option key={status} value={status}>
                {statusConfig[status].label}
              </option>
            ))}
          </Select>
        </div>

        {errors.root && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {errors.root.message}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={mutation.isPending}>
            Salvar alterações
          </Button>
        </div>
      </form>
    </Modal>
  )
}
