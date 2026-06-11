import { useState } from 'react'
import { Plug, Plus } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { ConnectIntegrationModal } from '@/features/integrations/components/ConnectIntegrationModal'
import { IntegrationCard } from '@/features/integrations/components/IntegrationCard'
import { INTEGRATION_META, INTEGRATION_PROVIDERS } from '@/features/integrations/constants'
import { useIntegrations } from '@/features/integrations/hooks/useIntegrations'
import { getErrorMessage } from '@/services/api'
import type { IntegrationProvider } from '@/types/integration'

type IntegrationListProps = {
  chatbotId: string
}

export function IntegrationList({ chatbotId }: IntegrationListProps) {
  const [connectProvider, setConnectProvider] = useState<IntegrationProvider | null>(null)

  const { data: integrations, isLoading, isError, error } = useIntegrations(chatbotId)

  const connectedProviders = new Set(integrations?.map((item) => item.provider))

  return (
    <section className="rounded-xl border border-surface-700/80 bg-surface-900/60 p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-medium text-white">Canais & Integrações</h2>
          <p className="mt-1 text-sm text-muted">
            Conecte este chatbot ao Telegram e ao WhatsApp para conversar com usuários reais.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {INTEGRATION_PROVIDERS.map((provider) => {
            const meta = INTEGRATION_META[provider]
            const Icon = meta.icon
            const connected = connectedProviders.has(provider)
            return (
              <Button
                key={provider}
                size="sm"
                variant="secondary"
                disabled={connected}
                onClick={() => setConnectProvider(provider)}
              >
                <Icon className="size-4" />
                {connected ? `${meta.label} conectado` : `Conectar ${meta.label}`}
              </Button>
            )
          })}
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Spinner className="text-accent-400" />
        </div>
      )}

      {isError && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {getErrorMessage(error, 'Não foi possível carregar as integrações.')}
        </p>
      )}

      {!isLoading && !isError && integrations?.length === 0 && (
        <EmptyState
          icon={Plug}
          title="Nenhum canal conectado"
          description="Conecte o Telegram ou o WhatsApp para que o chatbot atenda nesses canais."
          action={
            <Button size="sm" onClick={() => setConnectProvider('TELEGRAM')}>
              <Plus className="size-4" />
              Conectar canal
            </Button>
          }
        />
      )}

      {integrations && integrations.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          {integrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              chatbotId={chatbotId}
              integration={integration}
            />
          ))}
        </div>
      )}

      <ConnectIntegrationModal
        chatbotId={chatbotId}
        provider={connectProvider}
        onClose={() => setConnectProvider(null)}
      />
    </section>
  )
}
