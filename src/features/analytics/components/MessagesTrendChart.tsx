import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { ChartCard } from '@/features/analytics/components/ChartCard'
import { CHART_COLORS, formatChartDateFull } from '@/features/analytics/constants'
import type { DailyCount } from '@/types/analytics'

type MessagesTrendChartProps = {
  title: string
  description?: string
  data: DailyCount[]
}

export function MessagesTrendChart({ title, description, data }: MessagesTrendChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    label: formatChartDateFull(item.date),
  }))

  const hasData = chartData.some((item) => item.count > 0)

  return (
    <ChartCard title={title} description={description}>
      {!hasData ? (
        <div className="flex h-64 items-center justify-center text-sm text-slate-500">
          Nenhuma mensagem no período selecionado.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="messagesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS.accent} stopOpacity={0.35} />
                <stop offset="100%" stopColor={CHART_COLORS.accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#121528',
                border: '1px solid #252b45',
                borderRadius: '8px',
                color: '#e2e8f0',
              }}
              labelFormatter={(_, payload) => {
                const point = payload?.[0]?.payload as { date?: string } | undefined
                return point?.date ? formatChartDateFull(point.date) : ''
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              name="Mensagens"
              stroke={CHART_COLORS.accent}
              fill="url(#messagesGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
}
