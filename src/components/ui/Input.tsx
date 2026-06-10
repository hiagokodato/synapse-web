import { type InputHTMLAttributes, forwardRef } from 'react'

import { cn } from '@/utils/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'flex h-11 w-full rounded-lg border bg-surface-900 px-3 text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/40',
          error
            ? 'border-red-500/60 focus-visible:ring-red-500/30'
            : 'border-surface-600 hover:border-surface-600 focus-visible:border-accent-500/50',
          className,
        )}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'
