import { Navigate, Outlet } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'
import { useAuthInit } from '@/hooks/useAuthInit'
import { useAuthStore } from '@/stores/auth.store'

export function PublicRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { isLoading } = useAuthInit()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="text-accent-400" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
