import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'
import { queryKeys } from '@/utils/query-keys'

export function useAuthInit() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const setUser = useAuthStore((s) => s.setUser)
  const logout = useAuthStore((s) => s.logout)

  const shouldValidate = isAuthenticated && !!accessToken

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.auth.me(accessToken),
    queryFn: authService.me,
    enabled: shouldValidate,
    retry: false,
    staleTime: Infinity,
  })

  useEffect(() => {
    if (data) {
      setUser(data)
    }
  }, [data, setUser])

  useEffect(() => {
    if (isError) {
      logout()
    }
  }, [isError, logout])

  return {
    isLoading: shouldValidate && isPending,
  }
}
