import { cn } from '@/utils/cn'

type SpinnerProps = {
  size?: 'sm' | 'md'
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <span
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
        size === 'sm' && 'size-4',
        size === 'md' && 'size-5',
        className,
      )}
      aria-hidden
    />
  )
}
