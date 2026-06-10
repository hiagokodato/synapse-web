import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { useAuthStore } from '@/stores/auth.store'
import type { ApiError, TokenPair } from '@/types/auth'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/v1'

export const api = axios.create({
  baseURL: API_URL,
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

    const { refreshToken, setTokens, logout } = useAuthStore.getState()

    if (!refreshToken) {
      logout()
      return Promise.reject(error)
    }

    original._retry = true

    try {
      refreshPromise ??= axios
        .post<TokenPair>(`${API_URL}/auth/refresh`, { refreshToken })
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
    const message = error.response?.data?.message

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
