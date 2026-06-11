import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Modal } from '@/components/ui/Modal'
import { INTEGRATION_META } from '@/features/integrations/constants'
import { getErrorMessage } from '@/services/api'
import { integrationService } from '@/services/integration.service'
import type { CreateIntegrationPayload, IntegrationProvider } from '@/types/integration'
import { queryKeys } from '@/utils/query-keys'

type ConnectIntegrationModalProps = {
  chatbotId: string
  provider: IntegrationProvider | null
  onClose: () => void
}

type FormState = {
  botToken: string
  accessToken: string
  phoneNumberId: string
  verifyToken: string
}

const EMPTY: FormState = { botToken: '', accessToken: '', phoneNumberId: '', verifyToken: '' }

export function ConnectIntegrationModal({
  chatbotId,
  provider,
  onClose,
}: ConnectIntegrationModalProps) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: (payload: CreateIntegrationPayload) => integrationService.create(chatbotId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.integrations.list(chatbotId) })
      handleClose()
    },
    onError: (err) => {
      setError(getErrorMessage(err, 'Não foi possível conectar o canal.'))
    },
  })

  const handleClose = () => {
    setForm(EMPTY)
    setError(null)
    onClose()
  }

  if (!provider) return null

  const meta = INTEGRATION_META[provider]

  const handleSubmit = () => {
    setError(null)

    if (provider === 'TELEGRAM') {
      if (form.botToken.trim().length < 10) {
        setError('Informe um token de bot válido do Telegram.')
        return
      }
      mutation.mutate({ provider, botToken: form.botToken.trim() })
      return
    }

    if (!form.accessToken.trim() || !form.phoneNumberId.trim() || !form.verifyToken.trim()) {
      setError('Preencha accessToken, phoneNumberId e verifyToken.')
      return
    }
    mutation.mutate({
      provider,
      accessToken: form.accessToken.trim(),
      phoneNumberId: form.phoneNumberId.trim(),
      verifyToken: form.verifyToken.trim(),
    })
  }

  const update = (field: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <Modal
      open={!!provider}
      onClose={handleClose}
      title={`Conectar ${meta.label}`}
      description={meta.description}
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        noValidate
      >
        {provider === 'TELEGRAM' && (
          <div className="space-y-2">
            <Label htmlFor="botToken">Token do bot</Label>
            <Input
              id="botToken"
              placeholder="123456:ABC-DEF..."
              value={form.botToken}
              onChange={(e) => update('botToken')(e.target.value)}
            />
            <p className="text-xs text-slate-500">
              Crie um bot com o @BotFather no Telegram e cole o token aqui.
            </p>
          </div>
        )}

        {provider === 'WHATSAPP' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="accessToken">Access Token</Label>
              <Input
                id="accessToken"
                placeholder="EAAG..."
                value={form.accessToken}
                onChange={(e) => update('accessToken')(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumberId">Phone Number ID</Label>
              <Input
                id="phoneNumberId"
                placeholder="1234567890"
                value={form.phoneNumberId}
                onChange={(e) => update('phoneNumberId')(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="verifyToken">Verify Token</Label>
              <Input
                id="verifyToken"
                placeholder="um-segredo-qualquer"
                value={form.verifyToken}
                onChange={(e) => update('verifyToken')(e.target.value)}
              />
              <p className="text-xs text-slate-500">
                Você definirá esse mesmo valor no painel da Meta ao configurar o webhook.
              </p>
            </div>
          </>
        )}

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={mutation.isPending}>
            Conectar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
