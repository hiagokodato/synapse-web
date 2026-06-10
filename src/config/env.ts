const DEFAULT_API_URL = 'http://localhost:3000/v1'

function normalizeApiUrl(raw: string): string {
  return raw.replace(/\/+$/, '')
}

function resolveApiUrl(): string {
  const fromEnv = import.meta.env.VITE_API_URL

  if (typeof fromEnv === 'string' && fromEnv.trim().length > 0) {
    return normalizeApiUrl(fromEnv.trim())
  }

  return DEFAULT_API_URL
}

function resolveWsUrl(apiUrl: string): string {
  const fromEnv = import.meta.env.VITE_WS_URL

  if (typeof fromEnv === 'string' && fromEnv.trim().length > 0) {
    return fromEnv.trim().replace(/\/+$/, '')
  }

  const url = new URL(apiUrl)
  url.pathname = '/realtime'
  url.search = ''
  url.hash = ''

  if (url.protocol === 'https:') {
    url.protocol = 'wss:'
  } else {
    url.protocol = 'ws:'
  }

  return url.toString().replace(/\/+$/, '')
}

export const env = {
  apiUrl: resolveApiUrl(),
  wsUrl: resolveWsUrl(resolveApiUrl()),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
