import { AuthLayout } from '@/layouts/AuthLayout'
import { RegisterForm } from '@/features/auth/components/RegisterForm'

export function RegisterPage() {
  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Comece a construir fluxos conversacionais em minutos."
    >
      <RegisterForm />
    </AuthLayout>
  )
}
