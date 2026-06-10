import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AppProviders } from '@/app/providers'
import { AppLayout } from '@/layouts/AppLayout'
import { ChatbotDetailPage } from '@/pages/ChatbotDetailPage'
import { ChatbotsPage } from '@/pages/ChatbotsPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { FlowBuilderPage } from '@/pages/FlowBuilderPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { PublicRoute } from '@/routes/PublicRoute'

export function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="chatbots" element={<ChatbotsPage />} />
              <Route path="chatbots/:id/flows/:flowId" element={<FlowBuilderPage />} />
              <Route path="chatbots/:id" element={<ChatbotDetailPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  )
}
