import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { env } from '@/config/env'
import { useAuthStore } from '@/stores/auth.store'
import type { ApiError, TokenPair } from '@/types/auth'

export const api = axios.create({
  baseURL: env.apiUrl,
  // Envia o cookie httpOnly de refresh nas rotas /auth (a API restringe as origens no CORS).
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

let refreshPromise: Promise<TokenPair> | null = null

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { accessToken } = useAuthStore.getState()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    const isAuthRoute = original.url?.startsWith('/auth/')
    if (isAuthRoute) {
      return Promise.reject(error)
    }

    const { setTokens, logout } = useAuthStore.getState()

    original._retry = true

    try {
      refreshPromise ??= axios
        .post<TokenPair>(`${env.apiUrl}/auth/refresh`, null, { withCredentials: true })
        .then((res) => {
          setTokens(res.data)
          return res.data
        })
        .finally(() => {
          refreshPromise = null
        })

      const tokens = await refreshPromise
      original.headers.Authorization = `Bearer ${tokens.accessToken}`
      return api(original)
    } catch {
      logout()
      return Promise.reject(error)
    }
  },
)

export function getErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (axios.isAxiosError<ApiError>(error)) {
    if (!error.response) {
      if (error.code === 'ERR_NETWORK') {
        return 'Erro de rede. Verifique sua conexão ou a configuração de CORS da API.'
      }

      return error.message || fallback
    }

    const message = error.response.data?.message

    if (Array.isArray(message)) {
      return message[0] ?? fallback
    }

    if (typeof message === 'string') {
      return message
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}
