import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, Copy, Link2, Power, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { INTEGRATION_META } from '@/features/integrations/constants'
import { getErrorMessage } from '@/services/api'
import { integrationService } from '@/services/integration.service'
import type { Integration } from '@/types/integration'
import { queryKeys } from '@/utils/query-keys'

type IntegrationCardProps = {
  chatbotId: string
  integration: Integration
}

export function IntegrationCard({ chatbotId, integration }: IntegrationCardProps) {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<string | null>(null)
  const meta = INTEGRATION_META[integration.provider]
  const Icon = meta.icon

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.integrations.list(chatbotId) })

  const toggleMutation = useMutation({
    mutationFn: () =>
      integrationService.update(chatbotId, integration.id, { enabled: !integration.enabled }),
    onSuccess: async () => {
      await invalidate()
    },
    onError: (error) => setStatus(getErrorMessage(error, 'Erro ao atualizar.')),
  })

  const removeMutation = useMutation({
    mutationFn: () => integrationService.remove(chatbotId, integration.id),
    onSuccess: async () => {
      await invalidate()
    },
    onError: (error) => setStatus(getErrorMessage(error, 'Erro ao remover.')),
  })

  const webhookMutation = useMutation({
    mutationFn: () => integrationService.registerTelegramWebhook(chatbotId, integration.id),
    onSuccess: () => setStatus('Webhook registrado no Telegram com sucesso.'),
    onError: (error) => setStatus(getErrorMessage(error, 'Erro ao registrar webhook.')),
  })

  return (
    <div className="rounded-xl border border-surface-700/80 bg-surface-800/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Icon className={`size-5 ${meta.accent}`} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{meta.label}</span>
              {integration.enabled ? (
                <Badge variant="success">Ativo</Badge>
              ) : (
                <Badge variant="muted">Desativado</Badge>
              )}
            </div>
            {integration.externalRef && (
              <p className="mt-0.5 text-xs text-slate-500">ID: {integration.externalRef}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="secondary"
            size="sm"
            loading={toggleMutation.isPending}
            onClick={() => toggleMutation.mutate()}
          >
            <Power className="size-4" />
            {integration.enabled ? 'Desativar' : 'Ativar'}
          </Button>
          <button
            type="button"
            aria-label="Remover integração"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
            onClick={() => removeMutation.mutate()}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {integration.webhookUrl ? (
          <CopyableField label="Webhook URL" value={integration.webhookUrl} />
        ) : (
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
            Defina <code>PUBLIC_BASE_URL</code> na API para gerar a URL do webhook.
          </p>
        )}

        {integration.provider === 'WHATSAPP' && integration.credentials.verifyToken && (
          <CopyableField label="Verify Token" value={integration.credentials.verifyToken} />
        )}

        {integration.provider === 'TELEGRAM' && (
          <Button
            variant="secondary"
            size="sm"
            loading={webhookMutation.isPending}
            disabled={!integration.webhookUrl}
            onClick={() => webhookMutation.mutate()}
          >
            <Link2 className="size-4" />
            Registrar webhook automaticamente
          </Button>
        )}

        {integration.provider === 'WHATSAPP' && (
          <p className="text-xs text-slate-500">
            No painel da Meta, configure o Webhook URL e o Verify Token acima e assine o evento{' '}
            <code className="text-accent-400">messages</code>.
          </p>
        )}

        {status && <p className="text-xs text-slate-400">{status}</p>}
      </div>
    </div>
  )
}

function CopyableField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="space-y-1">
      <span className="text-xs font-medium text-muted">{label}</span>
      <div className="flex items-center gap-2 rounded-lg border border-surface-700/80 bg-surface-900 px-3 py-2">
        <code className="min-w-0 flex-1 truncate text-xs text-slate-300">{value}</code>
        <button
          type="button"
          aria-label="Copiar"
          onClick={copy}
          className="shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-surface-800 hover:text-white"
        >
          {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
        </button>
      </div>
    </div>
  )
}
