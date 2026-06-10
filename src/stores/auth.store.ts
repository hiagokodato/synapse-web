import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { authService } from '@/services/auth.service'
import type { AuthResponse, AuthUser, TokenPair } from '@/types/auth'

type AuthState = {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
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
      refreshToken: null,
      isAuthenticated: false,

      setSession: (response) =>
        set({
          user: response.user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          isAuthenticated: true,
        }),

      setTokens: (tokens) =>
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
        }),

      setUser: (user) => set({ user }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      signOut: async () => {
        const { refreshToken, logout } = get()

        if (refreshToken) {
          try {
            await authService.logout(refreshToken)
          } catch {
            // Token may already be invalid — clear local session anyway.
          }
        }

        logout()
      },
    }),
    {
      name: 'synapse-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
