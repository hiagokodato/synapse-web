import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { queryKeys } from '@/utils/query-keys'

export function useAuthInit() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const setTokens = useAuthStore((s) => s.setTokens)
  const setUser = useAuthStore((s) => s.setUser)
  const logout = useAuthStore((s) => s.logout)

  // O access token não é persistido: depois de recarregar a página, renova pelo cookie httpOnly.
  const shouldRestore = isAuthenticated && !accessToken
  const restore = useQuery({
    queryKey: ['auth', 'restore'],
    queryFn: authService.refresh,
    enabled: shouldRestore,
    retry: false,
    gcTime: 0,
  })

  const shouldValidate = isAuthenticated && !!accessToken
  const me = useQuery({
    queryKey: queryKeys.auth.me(accessToken),
    queryFn: authService.me,
    enabled: shouldValidate,
    retry: false,
    staleTime: Infinity,
  })

  useEffect(() => {
    if (restore.data) {
      setTokens(restore.data)
    }
  }, [restore.data, setTokens])

  useEffect(() => {
    if (me.data) {
      setUser(me.data)
    }
  }, [me.data, setUser])

  useEffect(() => {
    if (restore.isError || me.isError) {
      logout()
    }
  }, [restore.isError, me.isError, logout])

  return {
    isLoading: (shouldRestore && !restore.isError) || (shouldValidate && me.isPending),
  }
}
