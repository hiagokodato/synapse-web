import { useQuery } from '@tanstack/react-query'
import { Bot, GitBranch, MessageSquare, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useChatbots } from '@/features/chatbots/hooks/useChatbots'
import { getErrorMessage } from '@/services/api'
import { analyticsService } from '@/services/analytics.service'
import { useAuthStore } from '@/stores/auth.store'
import { queryKeys } from '@/utils/query-keys'

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  const overviewQuery = useQuery({
    queryKey: queryKeys.analytics.overview,
    queryFn: analyticsService.getOverview,
  })

  const chatbotsQuery = useChatbots()

  const overview = overviewQuery.data
  const recentChatbots = chatbotsQuery.data?.slice(0, 3) ?? []

  const stats = overview
    ? [
        {
          label: 'Chatbots',
          value: overview.chatbots.total,
          sub: `${overview.chatbots.active} ativos · ${overview.chatbots.draft} rascunhos`,
          icon: Bot,
        },
        {
          label: 'Conversas',
          value: overview.conversations.total,
          sub: `${overview.conversations.open} abertas · ${overview.conversations.closed} fechadas`,
          icon: MessageSquare,
        },
        {
          label: 'Mensagens',
          value: overview.messages.total,
          sub: `${overview.messages.bot} bot · ${overview.messages.user} usuário`,
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
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Olá, {user?.name?.split(' ')[0] ?? 'usuário'} 👋
          </h1>
          <p className="mt-1 text-muted">Visão geral da sua plataforma conversacional.</p>
        </div>
        <Link to="/analytics">
          <Button variant="secondary">Ver analytics</Button>
        </Link>
      </section>

      {overviewQuery.isLoading && (
        <div className="flex justify-center py-12">
          <Spinner className="text-accent-400" />
        </div>
      )}

      {overviewQuery.isError && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {getErrorMessage(overviewQuery.error, 'Não foi possível carregar as métricas.')}
        </p>
      )}

      {overview && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, sub, icon: Icon }) => (
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
      )}

      <section className="rounded-xl border border-surface-700/80 bg-surface-900/60 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-medium text-white">Chatbots recentes</h2>
          <Link to="/chatbots" className="text-sm text-accent-400 hover:text-accent-400/80">
            Ver todos
          </Link>
        </div>

        {chatbotsQuery.isLoading && (
          <div className="flex justify-center py-8">
            <Spinner className="text-accent-400" />
          </div>
        )}

        {!chatbotsQuery.isLoading && recentChatbots.length === 0 && (
          <p className="text-sm text-muted">
            Nenhum chatbot criado ainda.{' '}
            <Link to="/chatbots" className="text-accent-400 hover:underline">
              Crie o primeiro
            </Link>
          </p>
        )}

        {recentChatbots.length > 0 && (
          <ul className="divide-y divide-surface-700/80">
            {recentChatbots.map((chatbot) => (
              <li key={chatbot.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <Link
                    to={`/chatbots/${chatbot.id}`}
                    className="font-medium text-slate-200 hover:text-accent-400"
                  >
                    {chatbot.name}
                  </Link>
                  <p className="text-xs text-slate-500">
                    {chatbot._count.flows} fluxos · {chatbot._count.conversations} conversas
                  </p>
                </div>
                <span className="text-xs text-slate-500">{chatbot.status}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
