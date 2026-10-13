import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { authService } from '@/services/auth.service'
import type { AuthResponse, AuthUser, TokenPair } from '@/types/auth'

type AuthState = {
  user: AuthUser | null
  accessToken: string | null
  isAuthenticated: boolean
  setSession: (response: AuthResponse) => void
  setTokens: (tokens: TokenPair) => void
  setUser: (user: AuthUser) => void
  logout: () => void
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setSession: (response) =>
        set({
          user: response.user,
          accessToken: response.accessToken,
          isAuthenticated: true,
        }),

      setTokens: (tokens) =>
        set({
          accessToken: tokens.accessToken,
          isAuthenticated: true,
        }),

      setUser: (user) => set({ user }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
              isAuthenticated: false,
        }),

      signOut: async () => {
        try {
          await authService.logout()
        } catch {
          // Cookie may already be invalid — clear local session anyway.
        }

        get().logout()
      },
    }),
    {
      name: 'synapse-auth',
      // Nenhum token vai para o localStorage (alvo fácil de XSS): o access token fica em memória
      // e, ao recarregar a página, é renovado pelo cookie httpOnly (ver useAuthInit).
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
