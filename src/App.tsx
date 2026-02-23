import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BookingPage from "./pages/BookingPage";
import DashboardPage from "./pages/DashboardPage";
import ClientsPage from "./pages/ClientsPage";
import ProfessionalsPage from "./pages/ProfessionalsPage";
import ServicesPage from "./pages/ServicesPage";
import ReportsPage from "./pages/ReportsPage";
import FinancialPage from "./pages/FinancialPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import PainelLayout from "./layouts/PainelLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/agendar" element={<BookingPage />} />
          
          {/* Painel routes with sidebar layout */}
          <Route path="/painel" element={<PainelLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="clientes" element={<ClientsPage />} />
            <Route path="profissionais" element={<ProfessionalsPage />} />
            <Route path="servicos" element={<ServicesPage />} />
            <Route path="financeiro/receber" element={<FinancialPage type="receber" />} />
            <Route path="financeiro/pagar" element={<FinancialPage type="pagar" />} />
            <Route path="financeiro/caixa" element={<FinancialPage type="caixa" />} />
            <Route path="dashboard" element={<ReportsPage />} />
            <Route path="relatorios" element={<PlaceholderPage title="Relatórios" />} />
            <Route path="anamnese" element={<PlaceholderPage title="Ficha de Anamnese" />} />
            <Route path="configuracoes" element={<PlaceholderPage title="Configurações" />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
