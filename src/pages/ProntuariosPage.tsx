import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePatientRecords } from "@/hooks/useClinicData";
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

const ProntuariosPage = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const navigate = useNavigate();

  // New optimized hook usage
  const { data: recordsData, isLoading } = usePatientRecords({
    search,
    page: currentPage,
    pageSize,
    typeFilter
  });

  const records = recordsData?.data ?? [];
  const totalItems = recordsData?.count ?? 0;

  // Separate query for unique types to populate the filter dropdown
  const { data: allTypes = [] } = useQuery({
    queryKey: ["patient_records_types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patient_records")
        .select("title")
        .not("title", "is", null);
      if (error) throw error;
      const set = new Set(data.map(d => d.title));
      return Array.from(set).sort() as string[];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;

  const handleSearchChange = (value: string) => { setSearch(value); setCurrentPage(1); };
  const handleTypeChange = (value: string) => { setTypeFilter(value); setCurrentPage(1); };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <div className="px-8 pt-8 pb-2 shrink-0">
        <h1 className="text-2xl font-display font-bold">Prontuários</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Gerenciando {totalItems} fichas de clientes com performance otimizada.
        </p>
      </div>

      {/* Filters */}
      <div className="px-8 py-4 shrink-0 flex items-center gap-3 flex-wrap">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Buscar por tipo ou identificador..."
            className="pl-9 bg-card"
          />
        </div>
        <Select value={typeFilter} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[220px] bg-card">
            <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Tipo de ficha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {allTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || typeFilter !== "all") && (
          <Badge variant="secondary" className="text-xs">
            {totalItems} resultado{totalItems !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Records list */}
      <div className="flex-1 px-8 pb-4 space-y-2">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nenhum prontuário encontrado</p>
          </div>
        ) : (
          records.map((record) => {
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
                    <p className="font-semibold text-sm truncate">{(record as any).client_name}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                      {record.title && (
                        <Badge variant="outline" className="text-[10px] font-normal py-0">
                          {record.title}
                        </Badge>
                      )}
                      {(record as any).professional_name && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {(record as any).professional_name}
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

      {/* Pagination Controls */}
      {!isLoading && totalItems > 0 && (
        <div className="px-8 pb-8 flex items-center justify-between shrink-0">
          <p className="text-xs text-muted-foreground">
            Mostrando <strong>{startIndex + 1}</strong> a <strong>{Math.min(startIndex + pageSize, totalItems)}</strong> de <strong>{totalItems}</strong> registros
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="text-xs font-bold"
            >
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold px-2 py-1 rounded bg-primary/10 text-primary">
                {currentPage}
              </span>
              <span className="text-xs text-muted-foreground px-1">de</span>
              <span className="text-xs font-bold px-2 py-1">
                {totalPages}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="text-xs font-bold"
            >
              Próximo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProntuariosPage;
