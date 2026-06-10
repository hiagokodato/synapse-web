import type { ReactNode } from 'react'

type ChartCardProps = {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function ChartCard({ title, description, children, className = '' }: ChartCardProps) {
  return (
    <div
      className={`rounded-xl border border-surface-700/80 bg-surface-900/60 p-5 ${className}`}
    >
      <div className="mb-4">
        <h3 className="font-medium text-white">{title}</h3>
        {description && <p className="mt-1 text-xs text-muted">{description}</p>}
      </div>
      {children}
    </div>
  )
}
