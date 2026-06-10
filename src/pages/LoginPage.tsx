import { AuthLayout } from '@/layouts/AuthLayout'
import { LoginForm } from '@/features/auth/components/LoginForm'

export function LoginPage() {
  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Entre na sua conta para gerenciar chatbots e conversas."
    >
      <LoginForm />
    </AuthLayout>
  )
}
