import { useState } from 'react'
import { Bot, GitBranch, MessageSquare, TrendingUp } from 'lucide-react'

import { Select } from '@/components/ui/Select'
import { Spinner } from '@/components/ui/Spinner'
import { DistributionChart } from '@/features/analytics/components/DistributionChart'
import { MessagesTrendChart } from '@/features/analytics/components/MessagesTrendChart'
import { CHART_COLORS } from '@/features/analytics/constants'
import {
  useAnalyticsOverview,
  useChatbotAnalytics,
} from '@/features/analytics/hooks/useAnalytics'
import { useChatbots } from '@/features/chatbots/hooks/useChatbots'
import { getErrorMessage } from '@/services/api'

const DAY_OPTIONS = [7, 14, 30] as const

export function AnalyticsPage() {
  const [days, setDays] = useState<number>(7)

  const overviewQuery = useAnalyticsOverview()
  const chatbotsQuery = useChatbots()

  const [selectedChatbotId, setSelectedChatbotId] = useState('')
  const activeChatbotId = selectedChatbotId || chatbotsQuery.data?.[0]?.id || ''

  const chatbotAnalyticsQuery = useChatbotAnalytics(activeChatbotId, days)

  const overview = overviewQuery.data
  const chatbotAnalytics = chatbotAnalyticsQuery.data

  const statCards = overview
    ? [
        {
          label: 'Chatbots',
          value: overview.chatbots.total,
          sub: `${overview.chatbots.active} ativos`,
          icon: Bot,
        },
        {
          label: 'Conversas',
          value: overview.conversations.total,
          sub: `${overview.conversations.open} abertas`,
          icon: MessageSquare,
        },
        {
          label: 'Mensagens',
          value: overview.messages.total,
          sub: `${overview.messages.user} usuário · ${overview.messages.bot} bot`,
          icon: TrendingUp,
        },
        {
          label: 'Fluxos',
          value: overview.flows.total,
          sub: `${overview.flows.published} publicados`,
          icon: GitBranch,
        },
      ]
    : []

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Analytics</h1>
          <p className="mt-1 text-muted">Métricas e tendências da plataforma conversacional.</p>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-400" htmlFor="days-filter">
            Período
          </label>
          <Select
            id="days-filter"
            value={String(days)}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-36"
          >
            {DAY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                Últimos {option} dias
              </option>
            ))}
          </Select>
        </div>
      </section>

      {overviewQuery.isLoading && (
        <div className="flex justify-center py-16">
          <Spinner className="text-accent-400" />
        </div>
      )}

      {overviewQuery.isError && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {getErrorMessage(overviewQuery.error, 'Não foi possível carregar o analytics.')}
        </p>
      )}

      {overview && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map(({ label, value, sub, icon: Icon }) => (
              <div
                key={label}
                className="rounded-xl border border-surface-700/80 bg-surface-900/60 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">{label}</span>
                  <Icon className="size-4 text-accent-400" />
                </div>
                <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
                <p className="mt-1 text-xs text-slate-500">{sub}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            <DistributionChart
              title="Chatbots por status"
              data={[
                { name: 'Ativos', value: overview.chatbots.active, color: CHART_COLORS.emerald },
                { name: 'Rascunho', value: overview.chatbots.draft, color: CHART_COLORS.amber },
                { name: 'Arquivados', value: overview.chatbots.archived, color: CHART_COLORS.slate },
              ]}
            />
            <DistributionChart
              title="Conversas por status"
              data={[
                { name: 'Abertas', value: overview.conversations.open, color: CHART_COLORS.emerald },
                { name: 'Fechadas', value: overview.conversations.closed, color: CHART_COLORS.slate },
              ]}
            />
            <DistributionChart
              title="Mensagens por origem"
              data={[
                { name: 'Usuário', value: overview.messages.user, color: CHART_COLORS.blue },
                { name: 'Bot', value: overview.messages.bot, color: CHART_COLORS.accent },
                { name: 'Sistema', value: overview.messages.system, color: CHART_COLORS.slate },
              ]}
            />
          </section>
        </>
      )}

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-white">Analytics por chatbot</h2>
            <p className="mt-1 text-sm text-muted">
              Volume diário de mensagens e distribuição por chatbot.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-400" htmlFor="chatbot-analytics">
              Chatbot
            </label>
            <Select
              id="chatbot-analytics"
              value={activeChatbotId}
              onChange={(e) => setSelectedChatbotId(e.target.value)}
              className="min-w-48"
              disabled={!chatbotsQuery.data?.length}
            >
              {!chatbotsQuery.data?.length && <option value="">Nenhum chatbot</option>}
              {chatbotsQuery.data?.map((chatbot) => (
                <option key={chatbot.id} value={chatbot.id}>
                  {chatbot.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {!activeChatbotId && (
          <p className="rounded-xl border border-dashed border-surface-600 p-8 text-center text-sm text-slate-500">
            Crie um chatbot para visualizar métricas detalhadas.
          </p>
        )}

        {activeChatbotId && chatbotAnalyticsQuery.isLoading && (
          <div className="flex justify-center py-12">
            <Spinner className="text-accent-400" />
          </div>
        )}

        {activeChatbotId && chatbotAnalyticsQuery.isError && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {getErrorMessage(chatbotAnalyticsQuery.error, 'Erro ao carregar analytics do chatbot.')}
          </p>
        )}

        {chatbotAnalytics && (
          <div className="grid gap-4 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <MessagesTrendChart
                title={`Mensagens — ${chatbotAnalytics.chatbotName}`}
                description={`Últimos ${days} dias`}
                data={chatbotAnalytics.messagesByDay}
              />
            </div>

            <div className="space-y-4">
              <DistributionChart
                title="Conversas"
                data={[
                  {
                    name: 'Abertas',
                    value: chatbotAnalytics.conversations.open,
                    color: CHART_COLORS.emerald,
                  },
                  {
                    name: 'Fechadas',
                    value: chatbotAnalytics.conversations.closed,
                    color: CHART_COLORS.slate,
                  },
                ]}
              />
              <DistributionChart
                title="Mensagens"
                data={[
                  {
                    name: 'Usuário',
                    value: chatbotAnalytics.messages.user,
                    color: CHART_COLORS.blue,
                  },
                  { name: 'Bot', value: chatbotAnalytics.messages.bot, color: CHART_COLORS.accent },
                  {
                    name: 'Sistema',
                    value: chatbotAnalytics.messages.system,
                    color: CHART_COLORS.slate,
                  },
                ]}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
