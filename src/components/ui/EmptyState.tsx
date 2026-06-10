import { type LucideIcon } from 'lucide-react'

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-surface-600 bg-surface-900/40 px-6 py-16 text-center">
      <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-surface-800 text-accent-400">
        <Icon className="size-6" />
      </span>
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
