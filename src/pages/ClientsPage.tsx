import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Phone, Mail, MoreHorizontal } from "lucide-react";

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  cpf: string;
  lastVisit: string;
  totalVisits: number;
}

const sampleClients: Client[] = [
  { id: '1', name: 'Maria Silva', phone: '(66) 99999-0001', email: 'maria@email.com', cpf: '111.111.111-11', lastVisit: '2026-02-20', totalVisits: 12 },
  { id: '2', name: 'Ana Oliveira', phone: '(66) 99999-0002', email: 'ana@email.com', cpf: '222.222.222-22', lastVisit: '2026-02-18', totalVisits: 8 },
  { id: '3', name: 'Carla Santos', phone: '(66) 99999-0003', email: 'carla@email.com', cpf: '333.333.333-33', lastVisit: '2026-02-23', totalVisits: 25 },
  { id: '4', name: 'Julia Costa', phone: '(66) 99999-0004', email: 'julia@email.com', cpf: '444.444.444-44', lastVisit: '2026-02-15', totalVisits: 5 },
  { id: '5', name: 'Fernanda Lima', phone: '(66) 99999-0005', email: 'fernanda@email.com', cpf: '555.555.555-55', lastVisit: '2026-02-22', totalVisits: 15 },
];

const ClientsPage = () => {
  const [search, setSearch] = useState('');

  const filtered = sampleClients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.cpf.includes(search)
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <h1 className="text-xl font-display font-bold">Clientes</h1>
        <Button variant="gold" size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" /> Novo Cliente
        </Button>
      </div>

      {/* Search */}
      <div className="px-6 py-3 border-b border-border shrink-0">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome, telefone ou CPF..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 sticky top-0">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cliente</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Telefone</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">CPF</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Última Visita</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Atendimentos</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(client => (
              <tr key={client.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-xs font-bold text-gold">
                      {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <a href={`tel:${client.phone}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                    <Phone className="w-3 h-3" /> {client.phone}
                  </a>
                </td>
                <td className="px-6 py-3 text-muted-foreground hidden md:table-cell">{client.cpf}</td>
                <td className="px-6 py-3 text-muted-foreground hidden lg:table-cell">{client.lastVisit}</td>
                <td className="px-6 py-3 hidden lg:table-cell">
                  <span className="text-gold font-semibold">{client.totalVisits}</span>
                </td>
                <td className="px-3 py-3">
                  <button className="p-1 hover:bg-muted rounded-md">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsPage;
