import { useState } from "react";
import { Search, ChevronDown, FileText, User, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Record {
  id: string;
  clientName: string;
  service: string;
  professional: string;
  date: string;
}

const sampleRecords: Record[] = [
  { id: '1', clientName: 'Maria Helena Santos', service: 'Design de Sobrancelhas', professional: 'Letícia Ramos', date: '27/01/2024' },
  { id: '2', clientName: 'Camila Alves Pereira', service: 'Manutenção Extensão de Cílios', professional: 'Letícia Ramos', date: '25/01/2024' },
  { id: '3', clientName: 'Ana Paula Oliveira', service: 'Hidratação Profunda', professional: 'Carla Souza', date: '24/01/2024' },
  { id: '4', clientName: 'Maria Helena Santos', service: 'Limpeza de Pele', professional: 'Marli Ferreira', date: '14/01/2024' },
  { id: '5', clientName: 'Ana Paula Oliveira', service: 'Coloração', professional: 'Carla Souza', date: '09/01/2024' },
];

const ProntuariosPage = () => {
  const [search, setSearch] = useState('');

  const filtered = sampleRecords.filter(r =>
    r.clientName.toLowerCase().includes(search.toLowerCase()) ||
    r.service.toLowerCase().includes(search.toLowerCase()) ||
    r.professional.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <div className="px-8 pt-8 pb-2 shrink-0">
        <h1 className="text-2xl font-display font-bold">Prontuários</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Histórico completo de atendimentos e observações</p>
      </div>

      {/* Search */}
      <div className="px-8 py-4 shrink-0">
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por cliente, serviço ou profissional..."
            className="pl-9 bg-card"
          />
        </div>
      </div>

      {/* Records */}
      <div className="px-8 pb-8 space-y-2">
        {filtered.map(record => (
          <div key={record.id} className="flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:shadow-sm transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{record.clientName}</p>
                  <span className="text-xs text-primary font-medium">{record.service}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{record.professional}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{record.date}</span>
                </div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProntuariosPage;
