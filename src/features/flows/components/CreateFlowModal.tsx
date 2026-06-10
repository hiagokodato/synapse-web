import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Modal } from '@/components/ui/Modal'
import { createDefaultFlowDefinition } from '@/features/flows/constants'
import { createFlowSchema, type CreateFlowFormValues } from '@/features/flows/schemas'
import { getErrorMessage } from '@/services/api'
import { flowService } from '@/services/flow.service'
import { queryKeys } from '@/utils/query-keys'

type CreateFlowModalProps = {
  chatbotId: string
  open: boolean
  onClose: () => void
}

export function CreateFlowModal({ chatbotId, open, onClose }: CreateFlowModalProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<CreateFlowFormValues>({
    resolver: zodResolver(createFlowSchema),
    defaultValues: { name: '' },
  })

  const mutation = useMutation({
    mutationFn: (values: CreateFlowFormValues) =>
      flowService.create(chatbotId, {
        name: values.name,
        definition: createDefaultFlowDefinition(),
      }),
    onSuccess: async (flow) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.flows.list(chatbotId) })
      await queryClient.invalidateQueries({ queryKey: queryKeys.chatbots.detail(chatbotId) })
      reset()
      onClose()
      navigate(`/chatbots/${chatbotId}/flows/${flow.id}`)
    },
    onError: (error) => {
      setError('root', {
        message: getErrorMessage(error, 'Não foi possível criar o fluxo.'),
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
      title="Novo fluxo"
      description="Crie um fluxo conversacional e abra o editor visual."
    >
      <form
        className="space-y-4"
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="flow-name">Nome do fluxo</Label>
          <Input
            id="flow-name"
            placeholder="Ex: Fluxo principal"
            error={!!errors.name}
            {...register('name')}
          />
          {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
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
            Criar e editar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
