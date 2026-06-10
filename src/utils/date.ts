export function formatDistanceToNow(dateInput: string): string {
  const date = new Date(dateInput)
  const now = Date.now()
  const diffMs = date.getTime() - now
  const absSeconds = Math.round(Math.abs(diffMs) / 1000)

  const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })

  if (absSeconds < 60) return rtf.format(Math.round(diffMs / 1000), 'second')
  if (absSeconds < 3600) return rtf.format(Math.round(diffMs / (1000 * 60)), 'minute')
  if (absSeconds < 86400) return rtf.format(Math.round(diffMs / (1000 * 60 * 60)), 'hour')
  if (absSeconds < 2592000) return rtf.format(Math.round(diffMs / (1000 * 60 * 60 * 24)), 'day')
  if (absSeconds < 31536000) return rtf.format(Math.round(diffMs / (1000 * 60 * 60 * 24 * 30)), 'month')

  return rtf.format(Math.round(diffMs / (1000 * 60 * 60 * 24 * 365)), 'year')
}

export function formatDate(dateInput: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateInput))
}
