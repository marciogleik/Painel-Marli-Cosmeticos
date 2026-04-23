import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import { GlobalSearch } from "@/components/GlobalSearch";
import marliLogo from "@/assets/marli-logo.jpg";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Map routes to display names for the mobile header
const routeNameMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/agenda": "Agenda",
  "/clientes": "Clientes",
  "/financeiro": "Financeiro",
  "/profissionais": "Profissionais",
  "/configuracoes": "Configurações",
  "/historico": "Histórico",
  "/unificar-clientes": "Unificar",
  "/deduplicar-fichas": "Deduplicar",
  "/exportar": "Exportar",
  "/notificacoes": "Notificações",
  "/faq": "Dúvidas",
};

const PainelLayout = () => {
    const location = useLocation();
    
    const { data: clinicSettings } = useQuery({
      queryKey: ["clinic-settings"],
      queryFn: async () => {
        const { data } = await (supabase
          .from("clinic_settings" as any)
          .select("name")
          .eq("id", "00000000-0000-0000-0000-000000000000")
          .single() as any);
        return data || { name: "Marli Cosméticos" };
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const currentRouteName = routeNameMap[location.pathname] || clinicSettings?.name || "Marli Cosméticos";

    return (
        <div className="flex h-screen bg-background overflow-hidden font-sans">
            <AppSidebar />
            <GlobalSearch />
            <main className="flex-1 flex flex-col min-w-0 w-full overflow-hidden relative">
                {/* Mobile Header - only visible when sidebar is collapsed/mobile */}
                <div className="lg:hidden h-14 shrink-0 flex items-center px-4 bg-background/50 backdrop-blur-md border-b border-border/40 z-30 sticky top-0">
                    <div className="w-10 shrink-0" /> {/* Space for the floating button in AppSidebar */}
                    <h1 className="text-sm font-bold uppercase tracking-widest text-foreground/80 ml-2">
                        {currentRouteName}
                    </h1>
                </div>

                <img
                    src={marliLogo}
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none select-none absolute bottom-4 right-4 w-32 sm:w-48 opacity-[0.05] sm:opacity-[0.08]"
                />
                <div className="flex-1 overflow-auto flex flex-col">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default PainelLayout;
