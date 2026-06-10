import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Bot,
  BrainCircuit,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
} from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/auth.store'
import { cn } from '@/utils/cn'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/chatbots', label: 'Chatbots', icon: Bot },
  { to: '/conversations', label: 'Conversas', icon: MessageSquare },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Configurações', icon: Settings, disabled: true },
]

export function AppLayout() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-surface-700/80 bg-surface-900/90 backdrop-blur-md">
        <div className="flex h-16 items-center gap-2 border-b border-surface-700/80 px-5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-accent-500/15 text-accent-400 ring-1 ring-accent-500/30">
            <BrainCircuit className="size-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Synapse</span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map(({ to, label, icon: Icon, end, disabled }) =>
            disabled ? (
              <span
                key={to}
                className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600"
                title="Em breve"
              >
                <Icon className="size-4" />
                {label}
              </span>
            ) : (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                    isActive
                      ? 'bg-accent-500/15 text-accent-400'
                      : 'text-slate-400 hover:bg-surface-800 hover:text-slate-200',
                  )
                }
              >
                <Icon className="size-4" />
                {label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="border-t border-surface-700/80 p-4">
          <div className="mb-3 truncate text-sm font-medium text-slate-200">{user?.name}</div>
          <div className="mb-3 truncate text-xs text-muted">{user?.email}</div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start px-2"
            onClick={() => void handleSignOut()}
          >
            <LogOut className="size-4" />
            Sair
          </Button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-surface-700/80 bg-surface-950/80 px-6 backdrop-blur-md">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted">Plataforma</p>
            <h2 className="text-sm font-medium text-slate-200">Painel de controle</h2>
          </div>
          <span className="rounded-full border border-surface-600 bg-surface-800 px-3 py-1 text-xs text-slate-400">
            {user?.role ?? 'USER'}
          </span>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
