import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppointments, useProfessionals } from "@/hooks/useClinicData";
import { Search, ChevronDown, FileText, User, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

const ProntuariosPage = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { data: professionals = [] } = useProfessionals();
  const { data: appointments = [] } = useAppointments();

  // Build records from appointments that were attended
  const records = appointments
    .filter(a => a.status === 'atendido')
    .map(a => {
      const prof = professionals.find(p => p.id === a.professional_id);
      return {
        id: a.id,
        clientId: a.client_id,
        clientName: a.client_name || 'Cliente',
        professional: prof?.name || 'Profissional',
        date: a.date,
      };
    });

  const filtered = records.filter(r =>
    r.clientName.toLowerCase().includes(search.toLowerCase()) ||
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
            placeholder="Buscar por cliente ou profissional..."
            className="pl-9 bg-card"
          />
        </div>
      </div>

      {/* Records */}
      <div className="px-8 pb-8 space-y-2">
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">Nenhum prontuário encontrado</p>
        )}
        {filtered.map(record => (
          <div
            key={record.id}
            className="flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:shadow-sm transition-shadow cursor-pointer"
            onClick={() => {
              if (record.clientId) {
                navigate(`/clientes/${record.clientId}`);
              }
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{record.clientName}</p>
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
