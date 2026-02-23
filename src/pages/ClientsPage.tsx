import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClients, useInactiveClients } from "@/hooks/useClinicData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Phone, Mail, ChevronRight, SlidersHorizontal, ChevronDown, RotateCcw } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import NewClientDialog from "@/components/client/NewClientDialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const isIncomplete = (c: { phone?: string | null; email?: string | null; birth_date?: string | null }) =>
  !c.phone || !c.email || !c.birth_date;

const ClientsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showNewClient, setShowNewClient] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const { data: clients = [], isLoading } = useClients(search);
  const { data: inactiveClients = [] } = useInactiveClients();
  const queryClient = useQueryClient();

  const reactivateMutation = useMutation({
    mutationFn: async (clientId: string) => {
      const { error } = await supabase
        .from("clients")
        .update({ is_active: true } as any)
        .eq("id", clientId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Cliente reativado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["clients_inactive"] });
    },
    onError: (err: any) => {
      toast.error(err.message ?? "Erro ao reativar cliente");
    },
  });

  const displayClients = clients.length > 0 ? clients : [];

  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-8 pb-2 shrink-0">
        <div>
          <h1 className="text-2xl font-display font-bold">Clientes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {displayClients.length} clientes {search ? 'encontrados' : 'cadastrados'}
          </p>
        </div>
        <Button className="gap-1.5" onClick={() => setShowNewClient(true)}>
          <Plus className="w-4 h-4" /> Novo Cliente
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3 px-8 py-4 shrink-0">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome ou telefone..."
            className="pl-9 bg-card"
          />
        </div>
        <button className="p-2.5 rounded-lg border border-border hover:bg-muted">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
        <select className="text-sm border border-border rounded-lg px-3 py-2.5 bg-card text-foreground">
          <option>Nome (A-Z)</option>
          <option>Última visita</option>
          <option>Total de visitas</option>
        </select>
      </div>

      {/* Client List */}
      <div className="px-8 pb-4 space-y-1">
        {isLoading && (
          <p className="text-sm text-muted-foreground text-center py-8">Carregando...</p>
        )}
        {!isLoading && displayClients.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            {search ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado. Faça login para ver os dados.'}
          </p>
        )}
        {displayClients.map(client => (
          <div key={client.id} onClick={() => navigate(`/clientes/${client.id}`)} className="flex items-center justify-between p-4 rounded-lg hover:bg-card border border-transparent hover:border-border transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {getInitials(client.full_name)}
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {client.full_name}
                  {isIncomplete(client) && (
                    <Badge className="ml-2 bg-blue-900 text-white hover:bg-blue-900 text-[10px] px-1.5 py-0">CADASTRO INCOMPLETO</Badge>
                  )}
                </p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                  {client.phone && (
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{client.phone}</span>
                  )}
                  {client.email && (
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{client.email}</span>
                  )}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {/* Inactive Clients Section */}
      {inactiveClients.length > 0 && (
        <div className="px-8 pb-8">
          <Collapsible open={showInactive} onOpenChange={setShowInactive}>
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
                <ChevronDown className={`w-4 h-4 transition-transform ${showInactive ? 'rotate-0' : '-rotate-90'}`} />
                Clientes inativos ({inactiveClients.length})
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-1 mt-1">
                {inactiveClients.map(client => (
                  <div key={client.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 opacity-70">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                        {getInitials(client.full_name)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-muted-foreground">{client.full_name}</p>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                          {client.phone && (
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{client.phone}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 shrink-0"
                      onClick={() => reactivateMutation.mutate(client.id)}
                      disabled={reactivateMutation.isPending}
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reativar
                    </Button>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}

      <NewClientDialog open={showNewClient} onOpenChange={setShowNewClient} />
    </div>
  );
};

export default ClientsPage;
