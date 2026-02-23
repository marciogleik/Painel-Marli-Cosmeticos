import { useState } from "react";
import { useClients } from "@/hooks/useClinicData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Phone, Mail, ChevronRight, SlidersHorizontal } from "lucide-react";

const ClientsPage = () => {
  const [search, setSearch] = useState('');
  const { data: clients = [], isLoading } = useClients(search);

  // Fallback to sample data if no DB clients
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
        <Button className="gap-1.5">
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
      <div className="px-8 pb-8 space-y-1">
        {isLoading && (
          <p className="text-sm text-muted-foreground text-center py-8">Carregando...</p>
        )}
        {!isLoading && displayClients.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            {search ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado. Faça login para ver os dados.'}
          </p>
        )}
        {displayClients.map(client => (
          <div key={client.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-card border border-transparent hover:border-border transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {getInitials(client.full_name)}
              </div>
              <div>
                <p className="font-semibold text-sm">{client.full_name}</p>
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
    </div>
  );
};

export default ClientsPage;
