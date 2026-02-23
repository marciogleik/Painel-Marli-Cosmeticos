import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PainelLayout from "./layouts/PainelLayout";
import DashboardPage from "./pages/DashboardPage";
import AgendaPage from "./pages/AgendaPage";
import ClientsPage from "./pages/ClientsPage";
import ProntuariosPage from "./pages/ProntuariosPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* All pages use sidebar layout */}
          <Route element={<PainelLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/agenda" element={<AgendaPage />} />
            <Route path="/clientes" element={<ClientsPage />} />
            <Route path="/prontuarios" element={<ProntuariosPage />} />
            <Route path="/notificacoes" element={<PlaceholderPage title="Notificações" />} />
            <Route path="/configuracoes" element={<PlaceholderPage title="Configurações" />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
