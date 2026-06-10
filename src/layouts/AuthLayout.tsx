import { Link } from 'react-router-dom'
import { BrainCircuit } from 'lucide-react'

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: React.ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-slate-100">
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent-500/15 text-accent-400 ring-1 ring-accent-500/30">
              <BrainCircuit className="size-5" />
            </span>
            <span className="text-xl font-semibold tracking-tight">Synapse</span>
          </Link>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-white">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
        </div>

        <div className="rounded-2xl border border-surface-700/80 bg-surface-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  )
}
