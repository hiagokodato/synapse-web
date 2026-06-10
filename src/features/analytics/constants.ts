export const CHART_COLORS = {
  accent: '#8b5cf6',
  emerald: '#34d399',
  blue: '#60a5fa',
  amber: '#fbbf24',
  slate: '#64748b',
  rose: '#fb7185',
} as const

export function formatChartDateFull(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`)
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(date)
}
