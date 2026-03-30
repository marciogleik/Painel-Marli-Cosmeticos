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
  UserPlus,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const allNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, hideFor: [] as string[] },
  { label: "Agenda", href: "/agenda", icon: Calendar, hideFor: [] as string[] },
  { label: "Clientes", href: "/clientes", icon: Users, hideFor: [] as string[] },
  { label: "Unificar Clientes", href: "/unificar-clientes", icon: UserPlus, hideFor: ["secretaria", "profissional"] },
  { label: "Deduplicar Fichas", href: "/deduplicar-fichas", icon: Database, hideFor: ["secretaria", "profissional"] },
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
    <div className="flex flex-col h-full bg-[#0A192F] border-r border-white/10 shadow-2xl overflow-hidden">
      {/* Profile + Clinic */}
      <div className="flex items-center px-6 h-20 shrink-0 border-b border-white/10 bg-white/5">
        <UserAvatarMenu />
      </div>

      {/* Collapse */}
      <div className="px-3 mb-1 hidden lg:block">
        <div className="flex justify-end pt-2">
          <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/80 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map(item => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => cn(
              "flex items-center gap-4 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 group",
              isActive
                ? "bg-primary text-white shadow-xl shadow-primary/40 ring-1 ring-white/20"
                : "text-slate-400 hover:bg-white/10 hover:text-white"
            )}
          >
            <item.icon className={cn(
              "w-4 h-4 transition-transform duration-300 group-hover:scale-110",
              "opacity-60 group-[.active]:opacity-100"
            )} />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Powered by Place */}
      <div className="flex items-center justify-center gap-2 py-4 shrink-0 opacity-40">
        <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest">powered by</span>
        <img src={placeLogo} alt="Place" className="h-3 brightness-0 invert" />
      </div>

      {/* Footer */}
      <div className="px-4 py-6 border-t border-white/10 bg-white/5">
        <button 
          onClick={signOut} 
          className="flex items-center gap-4 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 hover:bg-rose-500/10 hover:text-rose-500 w-full transition-all duration-300"
        >
          <LogOut className="w-4 h-4" />
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
        "w-[220px] shrink-0 border-r border-sidebar-border transition-transform duration-300 z-50",
        "fixed lg:relative inset-y-0 left-0 shadow-xl lg:shadow-none",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {sidebarContent}
      </aside>
    </>
  );
};

export default AppSidebar;
