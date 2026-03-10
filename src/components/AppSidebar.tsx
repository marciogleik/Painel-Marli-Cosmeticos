import { NavLink } from "react-router-dom";
import UserAvatarMenu from "@/components/UserAvatarMenu";
import { cn } from "@/lib/utils";
import placeLogo from "@/assets/place-logo.png";
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCog,
  DollarSign,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  X,
  HelpCircle,
  Database,
  History,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const allNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, hideFor: [] as string[] },
  { label: "Agenda", href: "/agenda", icon: Calendar, hideFor: [] as string[] },
  { label: "Clientes", href: "/clientes", icon: Users, hideFor: [] as string[] },
  { label: "Profissionais", href: "/profissionais", icon: UserCog, hideFor: ["secretaria"] },
  { label: "Financeiro", href: "/financeiro", icon: DollarSign, hideFor: [] as string[] },
  { label: "Notificações", href: "/notificacoes", icon: Bell, hideFor: [] as string[] },
  { label: "FAQ", href: "/faq", icon: HelpCircle, hideFor: [] as string[] },
  { label: "Configurações", href: "/configuracoes", icon: Settings, hideFor: ["secretaria"] },
  { label: "Histórico Global", href: "/historico", icon: History, hideFor: [] as string[] },
  { label: "Exportar Dados", href: "/exportar", icon: Database, hideFor: ["secretaria", "profissional"] },
];

const AppSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();

  const { data: userRole } = useQuery({
    queryKey: ["my-role", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .single();
      return data?.role ?? null;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 10,
  });

  const navItems = useMemo(
    () => allNavItems.filter(item => !userRole || !item.hideFor.includes(userRole)),
    [userRole]
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Profile + Clinic */}
      <div className="flex items-center px-4 h-16 shrink-0">
        <UserAvatarMenu />
      </div>

      {/* Collapse */}
      <div className="px-3 mb-1 hidden lg:block">
        <div className="flex justify-end">
          <button className="p-1 rounded-md hover:bg-sidebar-accent text-sidebar-foreground">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(item => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="w-[18px] h-[18px]" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Powered by Place */}
      <div className="flex items-center justify-center gap-2 py-3 shrink-0 opacity-60">
        <span className="text-[10px] text-sidebar-foreground/70">powered by</span>
        <img src={placeLogo} alt="Place" className="h-4" />
      </div>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-sidebar-border shrink-0">
        <button onClick={signOut} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent w-full transition-colors">
          <LogOut className="w-[18px] h-[18px]" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-card rounded-lg shadow-md border border-border"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-foreground/30 z-40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={cn(
        "w-[200px] shrink-0 border-r border-sidebar-border transition-transform duration-200 z-40",
        "fixed lg:relative inset-y-0 left-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {sidebarContent}
      </aside>
    </>
  );
};

export default AppSidebar;
