import { type TextareaHTMLAttributes, forwardRef } from 'react'

import { cn } from '@/utils/cn'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-24 w-full resize-y rounded-lg border bg-surface-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/40',
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

Textarea.displayName = 'Textarea'
