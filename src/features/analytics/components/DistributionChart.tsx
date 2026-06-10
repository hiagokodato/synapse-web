import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

import { ChartCard } from '@/features/analytics/components/ChartCard'

type PieSlice = {
  name: string
  value: number
  color: string
}

type DistributionChartProps = {
  title: string
  description?: string
  data: PieSlice[]
  emptyLabel?: string
}

export function DistributionChart({
  title,
  description,
  data,
  emptyLabel = 'Sem dados',
}: DistributionChartProps) {
  const filtered = data.filter((item) => item.value > 0)
  const total = filtered.reduce((sum, item) => sum + item.value, 0)

  return (
    <ChartCard title={title} description={description}>
      {total === 0 ? (
        <div className="flex h-52 items-center justify-center text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={filtered}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={3}
                stroke="transparent"
              >
                {filtered.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#121528',
                  border: '1px solid #252b45',
                  borderRadius: '8px',
                  color: '#e2e8f0',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <ul className="mt-2 space-y-1">
            {filtered.map((item) => (
              <li key={item.name} className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-2 text-slate-400">
                  <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-medium text-slate-200">{item.value}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </ChartCard>
  )
}
