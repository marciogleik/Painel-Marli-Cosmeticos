import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Globe,
  Users,
  UserCircle,
  Package,
  Scissors,
  DollarSign,
  TrendingUp,
  BarChart3,
  FileText,
  ClipboardList,
  Settings,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface NavSection {
  title: string;
  icon: React.ElementType;
  items: { label: string; href: string; icon: React.ElementType }[];
}

const navSections: NavSection[] = [
  {
    title: "AGENDA",
    icon: Calendar,
    items: [
      { label: "Agenda", href: "/painel", icon: Calendar },
      { label: "Agendamento Online", href: "/agendar", icon: Globe },
    ],
  },
  {
    title: "CADASTROS",
    icon: Users,
    items: [
      { label: "Clientes", href: "/painel/clientes", icon: Users },
      { label: "Profissionais", href: "/painel/profissionais", icon: UserCircle },
      { label: "Serviços", href: "/painel/servicos", icon: Scissors },
    ],
  },
  {
    title: "FINANCEIRO",
    icon: DollarSign,
    items: [
      { label: "Contas a Receber", href: "/painel/financeiro/receber", icon: TrendingUp },
      { label: "Contas a Pagar", href: "/painel/financeiro/pagar", icon: DollarSign },
      { label: "Fluxo de Caixa", href: "/painel/financeiro/caixa", icon: BarChart3 },
    ],
  },
  {
    title: "RELATÓRIOS",
    icon: FileText,
    items: [
      { label: "Dashboard", href: "/painel/dashboard", icon: BarChart3 },
      { label: "Relatórios", href: "/painel/relatorios", icon: FileText },
    ],
  },
  {
    title: "CLÍNICO",
    icon: ClipboardList,
    items: [
      { label: "Anamnese", href: "/painel/anamnese", icon: ClipboardList },
    ],
  },
];

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-gold/10 shrink-0">
        <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-primary">M</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground truncate">Marli Cosméticos</p>
            <p className="text-[9px] text-gold uppercase tracking-widest">Prime Estética</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-4">
        {navSections.map(section => (
          <div key={section.title}>
            {!collapsed && (
              <div className="flex items-center gap-1.5 px-2 mb-1">
                <section.icon className="w-3 h-3 text-gold" />
                <span className="text-[10px] font-semibold text-muted-foreground tracking-wider">{section.title}</span>
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map(item => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === '/painel'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-gold/10 text-gold font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Settings */}
      <div className="px-2 py-3 border-t border-border shrink-0">
        <NavLink
          to="/painel/configuracoes"
          className={({ isActive }) => cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
            isActive ? "bg-gold/10 text-gold" : "text-muted-foreground hover:bg-muted"
          )}
        >
          <Settings className="w-4 h-4" />
          {!collapsed && <span>Configurações</span>}
        </NavLink>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-card rounded-md shadow-md border border-border"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-foreground/50 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "bg-card border-r border-border flex flex-col shrink-0 transition-all duration-200 z-40",
        collapsed ? "w-16" : "w-56",
        // Mobile
        "fixed lg:relative inset-y-0 left-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {sidebarContent}
      </aside>
    </>
  );
};

export default AppSidebar;
