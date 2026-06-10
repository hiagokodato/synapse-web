import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { registerSchema, type RegisterFormValues } from '@/features/auth/schemas'
import { getErrorMessage } from '@/services/api'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'

export function RegisterForm() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const mutation = useMutation({
    mutationFn: ({ name, email, password }: RegisterFormValues) =>
      authService.register({ name, email, password }),
    onSuccess: (data) => {
      setSession(data)
      navigate('/', { replace: true })
    },
    onError: (error) => {
      setError('root', { message: getErrorMessage(error, 'Não foi possível criar a conta.') })
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          autoComplete="name"
          placeholder="Seu nome"
          error={!!errors.name}
          {...register('name')}
        />
        {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
      </div>

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
          autoComplete="new-password"
          placeholder="••••••••"
          error={!!errors.password}
          {...register('password')}
        />
        {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={!!errors.confirmPassword}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
        )}
      </div>

      {errors.root && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {errors.root.message}
        </p>
      )}

      <Button type="submit" className="w-full" loading={mutation.isPending}>
        Criar conta
      </Button>

      <p className="text-center text-sm text-muted">
        Já tem conta?{' '}
        <Link to="/login" className="font-medium text-accent-400 hover:text-accent-400/80">
          Entrar
        </Link>
      </p>
    </form>
  )
}
