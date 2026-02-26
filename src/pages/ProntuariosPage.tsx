import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, FileText, User, Calendar, ChevronRight, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PatientRecordRow {
  id: string;
  client_id: string;
  professional_id: string | null;
  record_type: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  client_name: string | null;
  professional_name: string | null;
}

const usePatientRecordsWithNames = () =>
  useQuery({
    queryKey: ["prontuarios_list"],
    queryFn: async () => {
      // Fetch records
      const { data: records, error } = await supabase
        .from("patient_records")
        .select("id, client_id, professional_id, record_type, title, created_at, updated_at")
        .order("created_at", { ascending: false })
        .limit(1000);
      if (error) throw error;

      // Fetch client names
      const clientIds = [...new Set((records ?? []).map((r) => r.client_id))];
      const { data: clients } = await supabase
        .from("clients")
        .select("id, full_name")
        .in("id", clientIds);
      const clientMap = new Map((clients ?? []).map((c) => [c.id, c.full_name]));

      // Fetch professional names
      const profIds = [...new Set((records ?? []).map((r) => r.professional_id).filter(Boolean))];
      const { data: profs } = await supabase
        .from("professionals")
        .select("id, name")
        .in("id", profIds as string[]);
      const profMap = new Map((profs ?? []).map((p) => [p.id, p.name]));

      return (records ?? []).map((r) => ({
        ...r,
        client_name: clientMap.get(r.client_id) ?? "Cliente",
        professional_name: r.professional_id ? profMap.get(r.professional_id) ?? null : null,
      })) as PatientRecordRow[];
    },
  });

const ProntuariosPage = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const navigate = useNavigate();
  const { data: records = [], isLoading } = usePatientRecordsWithNames();

  const types = useMemo(() => {
    const set = new Set(records.map((r) => r.title).filter(Boolean) as string[]);
    return [...set].sort();
  }, [records]);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        !search ||
        (r.client_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (r.professional_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (r.title ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || r.title === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [records, search, typeFilter]);

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <div className="px-8 pt-8 pb-2 shrink-0">
        <h1 className="text-2xl font-display font-bold">Prontuários</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {records.length} fichas de {new Set(records.map((r) => r.client_id)).size} clientes
        </p>
      </div>

      {/* Filters */}
      <div className="px-8 py-4 shrink-0 flex items-center gap-3 flex-wrap">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente, profissional ou tipo..."
            className="pl-9 bg-card"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[220px] bg-card">
            <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Tipo de ficha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {types.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || typeFilter !== "all") && (
          <Badge variant="secondary" className="text-xs">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Records list */}
      <div className="px-8 pb-8 space-y-2">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nenhum prontuário encontrado</p>
          </div>
        ) : (
          filtered.map((record) => {
            const date = parseISO(record.created_at);
            return (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:shadow-sm hover:border-primary/20 transition-all cursor-pointer group"
                onClick={() => navigate(`/clientes/${record.client_id}`)}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{record.client_name}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                      {record.title && (
                        <Badge variant="outline" className="text-[10px] font-normal py-0">
                          {record.title}
                        </Badge>
                      )}
                      {record.professional_name && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {record.professional_name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(date, "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProntuariosPage;
