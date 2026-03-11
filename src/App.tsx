import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleGuard from "@/components/RoleGuard";
import PainelLayout from "./layouts/PainelLayout";
import DashboardPage from "./pages/DashboardPage";
import AgendaPage from "./pages/AgendaPage";
import ClientsPage from "./pages/ClientsPage";
import HistoricPage from "./pages/HistoricPage";
import NotificationsPage from "./pages/NotificationsPage";

import PlaceholderPage from "./pages/PlaceholderPage";
import ClientDetailPage from "./pages/ClientDetailPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import FinanceiroPage from "./pages/FinanceiroPage";
import ProfissionaisPage from "./pages/ProfissionaisPage";
import ProfissionalDetailPage from "./pages/ProfissionalDetailPage";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import FaqPage from "./pages/FaqPage";
import WelcomePage from "./pages/WelcomePage";
import CadastroConvitePage from "./pages/CadastroConvitePage";
import ImportPage from "./pages/ImportPage";
import ImportFichasPage from "./pages/ImportFichasPage";
import ImportClientesPage from "./pages/ImportClientesPage";
import ImportAnexosPage from "./pages/ImportAnexosPage";
import ExportDataPage from "./pages/ExportDataPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/cadastro" element={<CadastroConvitePage />} />
            <Route path="/import" element={<ProtectedRoute><ImportPage /></ProtectedRoute>} />
            <Route path="/import-fichas" element={<ProtectedRoute><ImportFichasPage /></ProtectedRoute>} />
            <Route path="/import-clientes" element={<ProtectedRoute><ImportClientesPage /></ProtectedRoute>} />
            <Route path="/import-anexos" element={<ProtectedRoute><ImportAnexosPage /></ProtectedRoute>} />
            <Route path="/bem-vinda" element={<ProtectedRoute><WelcomePage /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route element={<ProtectedRoute><PainelLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/agenda" element={<AgendaPage />} />
              <Route path="/clientes" element={<ClientsPage />} />
              <Route path="/clientes/:id" element={<ClientDetailPage />} />
              <Route path="/prontuarios" element={<Navigate to="/clientes" replace />} />
              <Route path="/financeiro" element={<FinanceiroPage />} />
              <Route path="/profissionais" element={<RoleGuard denyRoles={["secretaria"]}><ProfissionaisPage /></RoleGuard>} />
              <Route path="/profissionais/:id" element={<RoleGuard denyRoles={["secretaria"]}><ProfissionalDetailPage /></RoleGuard>} />
              <Route path="/notificacoes" element={<PlaceholderPage title="Notificações" />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/configuracoes" element={<RoleGuard denyRoles={["secretaria"]}><ConfiguracoesPage /></RoleGuard>} />
              <Route path="/exportar" element={<RoleGuard denyRoles={["secretaria", "profissional"]}><ExportDataPage /></RoleGuard>} />
              <Route path="/historico" element={<HistoricPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
