import { type SelectHTMLAttributes, forwardRef } from 'react'

import { cn } from '@/utils/cn'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'flex h-11 w-full rounded-lg border bg-surface-900 px-3 text-sm text-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/40',
          error
            ? 'border-red-500/60 focus-visible:ring-red-500/30'
            : 'border-surface-600 hover:border-surface-600 focus-visible:border-accent-500/50',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    )
  },
)

Select.displayName = 'Select'
