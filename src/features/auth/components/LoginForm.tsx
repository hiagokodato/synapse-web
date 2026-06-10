import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas'
import { getErrorMessage } from '@/services/api'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'

export function LoginForm() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setSession(data)
      navigate('/', { replace: true })
    },
    onError: (error) => {
      setError('root', { message: getErrorMessage(error, 'Não foi possível entrar.') })
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          error={!!errors.email}
          {...register('email')}
        />
        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={!!errors.password}
          {...register('password')}
        />
        {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
      </div>

      {errors.root && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {errors.root.message}
        </p>
      )}

      <Button type="submit" className="w-full" loading={mutation.isPending}>
        Entrar
      </Button>

      <p className="text-center text-sm text-muted">
        Não tem conta?{' '}
        <Link to="/register" className="font-medium text-accent-400 hover:text-accent-400/80">
          Criar conta
        </Link>
      </p>
    </form>
  )
}
