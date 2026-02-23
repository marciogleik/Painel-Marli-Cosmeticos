import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Phone, Mail, ChevronRight, SlidersHorizontal } from "lucide-react";

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  lastVisit: string;
  totalVisits: number;
  initials: string;
}

const sampleClients: Client[] = [
  { id: '1', name: 'Ana Paula Oliveira', phone: '(66) 99901-2345', email: 'ana.paula@email.com', lastVisit: '24/01/2024', totalVisits: 24, initials: 'AP' },
  { id: '2', name: 'Camila Alves Pereira', phone: '(66) 99505-6789', email: 'camila.alves@email.com', lastVisit: '25/01/2024', totalVisits: 18, initials: 'CA' },
  { id: '3', name: 'Fernanda Ribeiro Lima', phone: '(66) 99604-5678', email: 'fernanda.lima@email.com', lastVisit: '26/01/2024', totalVisits: 8, initials: 'FR' },
  { id: '4', name: 'Juliana Costa Mendes', phone: '(66) 99703-4567', email: 'juliana.costa@email.com', lastVisit: '19/01/2024', totalVisits: 12, initials: 'JC' },
  { id: '5', name: 'Maria Helena Santos', phone: '(66) 99802-3456', email: 'maria.helena@email.com', lastVisit: '27/01/2024', totalVisits: 36, initials: 'MH' },
];

const ClientsPage = () => {
  const [search, setSearch] = useState('');

  const filtered = sampleClients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-8 pb-2 shrink-0">
        <div>
          <h1 className="text-2xl font-display font-bold">Clientes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{sampleClients.length} clientes cadastrados</p>
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
        {filtered.map(client => (
          <div key={client.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-card border border-transparent hover:border-border transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {client.initials}
              </div>
              <div>
                <p className="font-semibold text-sm">{client.name}</p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{client.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{client.email}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm font-bold text-primary">{client.totalVisits}</p>
                <p className="text-[10px] text-muted-foreground">visitas</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-foreground">📅 {client.lastVisit}</p>
                <p className="text-[10px] text-muted-foreground">última visita</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsPage;
