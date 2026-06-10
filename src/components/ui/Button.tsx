import { type ButtonHTMLAttributes, forwardRef } from 'react'

import { cn } from '@/utils/cn'
import { Spinner } from '@/components/ui/Spinner'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/60 disabled:pointer-events-none disabled:opacity-50',
          variant === 'primary' &&
            'bg-accent-500 text-white shadow-lg shadow-accent-500/20 hover:bg-accent-600',
          variant === 'secondary' &&
            'border border-surface-600 bg-surface-800 text-slate-200 hover:border-surface-600 hover:bg-surface-700',
          variant === 'ghost' && 'text-slate-300 hover:bg-surface-800 hover:text-white',
          size === 'sm' && 'h-9 px-3 text-sm',
          size === 'md' && 'h-11 px-4 text-sm',
          size === 'lg' && 'h-12 px-6 text-base',
          className,
        )}
        {...props}
      >
        {loading && <Spinner size="sm" />}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
