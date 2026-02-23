import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import placeLogo from "@/assets/place-logo.png";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  DollarSign,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Agenda", href: "/agenda", icon: Calendar },
  { label: "Clientes", href: "/clientes", icon: Users },
  { label: "Prontuários", href: "/prontuarios", icon: FileText },
  { label: "Financeiro", href: "/financeiro", icon: DollarSign },
  { label: "Notificações", href: "/notificacoes", icon: Bell },
  { label: "Configurações", href: "/configuracoes", icon: Settings },
];

const AppSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { signOut } = useAuth();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 shrink-0">
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span className="text-primary-foreground text-xs font-bold">M</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-sidebar-accent-foreground truncate">Marli Cosméticos</p>
          <p className="text-[9px] text-primary uppercase tracking-[0.15em]">Prime Estética</p>
        </div>
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
