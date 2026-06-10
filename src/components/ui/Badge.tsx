import { cn } from '@/utils/cn'

type BadgeProps = {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'muted'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-accent-500/15 text-accent-400 ring-1 ring-accent-500/25',
        variant === 'success' && 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25',
        variant === 'warning' && 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/25',
        variant === 'muted' && 'bg-surface-700 text-slate-400 ring-1 ring-surface-600',
        className,
      )}
    >
      {children}
    </span>
  )
}
