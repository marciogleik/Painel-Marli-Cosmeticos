import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  DollarSign,
  Bell,
  HelpCircle,
  Settings,
  Search,
  History,
  UserPlus
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: userRole } = useQuery({
    queryKey: ["my-role", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      return data?.role ?? null;
    },
    enabled: !!user,
  });

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Check for Shift + K (case-insensitive 'k' just in case CapsLock is on)
      if (e.key === "K" && e.shiftKey) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: [] },
    { label: "Agenda", href: "/agenda", icon: Calendar, roles: [] },
    { label: "Clientes", href: "/clientes", icon: Users, roles: [] },
    { label: "Unificar Clientes", href: "/unificar-clientes", icon: UserPlus, roles: ["admin", "gestor"] },
    { label: "Financeiro", href: "/financeiro", icon: DollarSign, roles: [] },
    { label: "Notificações", href: "/notificacoes", icon: Bell, roles: [] },
    { label: "FAQ / Dúvidas", href: "/faq", icon: HelpCircle, roles: [] },
    { label: "Configurações", href: "/configuracoes", icon: Settings, roles: ["admin", "gestor"] },
    { label: "Histórico Global", href: "/historico", icon: History, roles: [] },
  ];

  const allowedNavItems = navItems.filter(item => 
    item.roles.length === 0 || (userRole && item.roles.includes(userRole))
  );

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Digite um comando ou procure uma página..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Navegação Rápida">
            {allowedNavItems.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => runCommand(() => navigate(item.href))}
                className="gap-3 py-3"
              >
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Ações">
             <CommandItem onSelect={() => runCommand(() => navigate("/clientes"))} className="gap-3 py-3">
               <Search className="h-4 w-4 text-primary" />
               <span>Buscar Clinte...</span>
             </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
