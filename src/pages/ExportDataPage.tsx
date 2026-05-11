import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Download, 
  Loader2, 
  CheckCircle2, 
  Database as DatabaseIcon, 
  Calendar as CalendarIcon, 
  Filter, 
  FileText, 
  FileSpreadsheet, 
  History,
  Users,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import type { Database } from "@/integrations/supabase/types";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type TableName = Extract<keyof Database["public"]["Tables"], string>;

type ExportFormat = "xlsx" | "csv" | "pdf";

interface TableConfig {
  key: string;
  label: string;
  description: string;
  table: TableName;
  dateField?: string;
  statusField?: string;
  professionalField?: string;
}

const tables: TableConfig[] = [
  { key: "appointments", label: "Agendamentos", description: "Histórico de agendamentos", table: "appointments", dateField: "date", statusField: "status", professionalField: "professional_id" },
  { key: "clients", label: "Clientes", description: "Cadastro completo de clientes", table: "clients", dateField: "created_at" },
  { key: "finance_records", label: "Financeiro", description: "Registros financeiros", table: "finance_records", dateField: "date", statusField: "payment_status", professionalField: "professional_id" },
  { key: "patient_records", label: "Prontuários", description: "Fichas e anamneses dos clientes", table: "patient_records", dateField: "created_at", professionalField: "professional_id" },
  { key: "services", label: "Serviços", description: "Catálogo de serviços oferecidos", table: "services", dateField: "created_at" },
  { key: "professionals", label: "Profissionais", description: "Cadastro de profissionais", table: "professionals", dateField: "created_at" },
  { key: "appointment_services", label: "Serviços dos Agendamentos", description: "Serviços vinculados a cada agendamento", table: "appointment_services" },
  { key: "client_attachments", label: "Anexos", description: "Arquivos anexados aos clientes", table: "client_attachments", dateField: "created_at", professionalField: "professional_id" },
];

const STATUS_OPTIONS: Record<string, string[]> = {
  appointments: ["agendado", "confirmado", "cancelado", "atendido", "espera", "atendendo", "atrasado", "falta", "removido", "bloqueado"],
  finance_records: ["pendente", "pago", "cancelado"],
};

const ExportDataPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // States
  const [loading, setLoading] = useState(false);
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [calculating, setCalculating] = useState(false);
  
  // Filters
  const [selectedTable, setSelectedTable] = useState<string>("appointments");
  const [formatType, setFormatType] = useState<ExportFormat>("xlsx");
  const [status, setStatus] = useState<string>("all");
  const [professionalId, setProfessionalId] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  // Load professionals
  const { data: professionals = [] } = useQuery({
    queryKey: ["professionals-export"],
    queryFn: async () => {
      const { data } = await supabase.from("professionals").select("id, name").order("name");
      return data || [];
    },
  });

  // Load history
  const { data: history = [], refetch: refetchHistory } = useQuery({
    queryKey: ["export-history"],
    queryFn: async () => {
      const { data } = await supabase
        .from("export_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      return data || [];
    },
  });

  const tableConfig = tables.find(t => t.key === selectedTable)!;

  const buildQuery = (tableName: TableName, config: TableConfig, forCount = false) => {
    let query = supabase.from(tableName).select(forCount ? "*" : "*", forCount ? { count: 'exact', head: true } : {});

    // Date filter
    if (config.dateField && dateRange.from) {
      const fromStr = format(dateRange.from, "yyyy-MM-dd");
      query = query.gte(config.dateField, fromStr);
    }
    if (config.dateField && dateRange.to) {
      const toStr = format(dateRange.to, "yyyy-MM-dd");
      query = query.lte(config.dateField, toStr);
    }

    // Status filter
    if (config.statusField && status !== "all") {
      query = query.eq(config.statusField, status);
    }

    // Professional filter
    if (config.professionalField && professionalId !== "all") {
      query = query.eq(config.professionalField, professionalId);
    }

    return query.order(config.dateField || "created_at", { ascending: false });
  };

  const updatePreview = async () => {
    if (!tableConfig) return;
    setCalculating(true);
    try {
      const { count, error } = await buildQuery(tableConfig.table, tableConfig, true);
      if (error) throw error;
      setPreviewCount(count);
    } catch (err) {
      console.error(err);
      setPreviewCount(null);
    } finally {
      setCalculating(false);
    }
  };

  useEffect(() => {
    updatePreview();
  }, [selectedTable, status, professionalId, dateRange]);

  const setPeriod = (type: "today" | "week" | "month" | "lastMonth") => {
    const today = new Date();
    switch (type) {
      case "today":
        setDateRange({ from: startOfDay(today), to: endOfDay(today) });
        break;
      case "week":
        setDateRange({ from: startOfWeek(today, { weekStartsOn: 0 }), to: endOfWeek(today, { weekStartsOn: 0 }) });
        break;
      case "month":
        setDateRange({ from: startOfMonth(today), to: endOfMonth(today) });
        break;
      case "lastMonth":
        const last = subMonths(today, 1);
        setDateRange({ from: startOfMonth(last), to: endOfMonth(last) });
        break;
    }
  };

  const logHistory = async (fileName: string, recordCount: number) => {
    if (!user) return;
    try {
      await supabase.from("export_history").insert({
        user_id: user.id,
        table_name: tableConfig.label,
        filters: { status, professionalId, from: dateRange.from, to: dateRange.to },
        record_count: recordCount,
        format: formatType,
        file_name: fileName,
      });
      refetchHistory();
    } catch (err) {
      console.error("Erro ao registrar histórico:", err);
    }
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const { data, error } = await buildQuery(tableConfig.table, tableConfig);
      if (error) throw error;

      if (!data || data.length === 0) {
        toast({ title: "Sem dados", description: "Não há registros para os filtros selecionados.", variant: "destructive" });
        return;
      }

      const timestamp = format(new Date(), "yyyyMMdd_HHmm");
      const fileName = `${tableConfig.table}_export_${timestamp}`;
      
      if (formatType === "xlsx") {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, tableConfig.label);
        XLSX.writeFile(wb, `${fileName}.xlsx`);
      } else if (formatType === "csv") {
        const ws = XLSX.utils.json_to_sheet(data);
        const csv = XLSX.utils.sheet_to_csv(ws);
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName}.csv`;
        a.click();
      } else if (formatType === "pdf") {
        const doc = new jsPDF("l", "pt", "a4");
        
        // Header
        doc.setFontSize(18);
        doc.text(`Relatório de ${tableConfig.label}`, 40, 40);
        doc.setFontSize(10);
        doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 40, 60);
        doc.text(`Período: ${dateRange.from ? format(dateRange.from, "dd/MM/yyyy") : ""} até ${dateRange.to ? format(dateRange.to, "dd/MM/yyyy") : ""}`, 40, 75);
        
        const headers = Object.keys(data[0]);
        const body = data.map(row => headers.map(h => {
          const val = row[h];
          if (val && typeof val === 'object') return JSON.stringify(val);
          return String(val ?? "");
        }));

        autoTable(doc, {
          startY: 90,
          head: [headers],
          body: body,
          styles: { fontSize: 8 },
          headStyles: { fillStyle: 'f', fillColor: [193, 157, 83] }, // Primary color approx
        });

        doc.save(`${fileName}.pdf`);
      }

      await logHistory(fileName, data.length);
      toast({ title: "Sucesso!", description: `${data.length} registros exportados.` });
    } catch (err) {
      console.error(err);
      toast({ title: "Erro", description: "Falha ao exportar dados.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-foreground">
            <DatabaseIcon className="w-8 h-8 text-primary" />
            CENTRAL DE EXPORTAÇÃO
          </h1>
          <p className="text-muted-foreground font-medium mt-1 uppercase text-[10px] tracking-widest">
            Filtre, visualize e extraia dados estratégicos do sistema
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Filtros */}
        <Card className="lg:col-span-2 border-border/40 shadow-xl rounded-[2rem] bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-border/10 pb-4 bg-muted/20">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary" />
              Configuração dos Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tipo de Dado */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tabela de Dados</label>
                <Select value={selectedTable} onValueChange={(v) => { setSelectedTable(v); setStatus("all"); }}>
                  <SelectTrigger className="h-12 bg-background/50 border-border/40 rounded-xl font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tables.map(t => (
                      <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Status</label>
                <Select 
                  value={status} 
                  onValueChange={setStatus} 
                  disabled={!tableConfig?.statusField}
                >
                  <SelectTrigger className="h-12 bg-background/50 border-border/40 rounded-xl font-bold">
                    <SelectValue placeholder="Todos os Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    {(tableConfig?.table && STATUS_OPTIONS[tableConfig.table])?.map(s => (
                      <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Profissional */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Filtrar por Profissional</label>
                <Select 
                  value={professionalId} 
                  onValueChange={setProfessionalId}
                  disabled={!tableConfig?.professionalField}
                >
                  <SelectTrigger className="h-12 bg-background/50 border-border/40 rounded-xl font-bold">
                    <SelectValue placeholder="Todos os Profissionais" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Profissionais</SelectItem>
                    {professionals.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Formato */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Formato de Saída</label>
                <div className="flex gap-2">
                  <Button 
                    variant={formatType === "xlsx" ? "default" : "outline"} 
                    className="flex-1 h-12 rounded-xl gap-2 font-bold"
                    onClick={() => setFormatType("xlsx")}
                  >
                    <FileSpreadsheet className="w-4 h-4" /> EXCEL
                  </Button>
                  <Button 
                    variant={formatType === "csv" ? "default" : "outline"} 
                    className="flex-1 h-12 rounded-xl gap-2 font-bold"
                    onClick={() => setFormatType("csv")}
                  >
                    <FileText className="w-4 h-4" /> CSV
                  </Button>
                  <Button 
                    variant={formatType === "pdf" ? "default" : "outline"} 
                    className="flex-1 h-12 rounded-xl gap-2 font-bold"
                    onClick={() => setFormatType("pdf")}
                  >
                    <FileText className="w-4 h-4" /> PDF
                  </Button>
                </div>
              </div>
            </div>

            {/* Período */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Período de Referência</label>
                <div className="flex gap-2">
                  {["today", "week", "month", "lastMonth"].map((p) => (
                    <Button 
                      key={p} 
                      variant="ghost" 
                      size="sm" 
                      className="text-[9px] h-6 font-black uppercase tracking-tighter rounded-full bg-muted/50 hover:bg-primary hover:text-white"
                      onClick={() => setPeriod(p as any)}
                    >
                      {p === "today" ? "Hoje" : p === "week" ? "Semana" : p === "month" ? "Mês" : "Mês Ant."}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-12 justify-start text-left font-bold border-border/40 rounded-xl bg-background/50">
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {dateRange.from ? format(dateRange.from, "PPP", { locale: ptBR }) : "Início"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-2xl overflow-hidden shadow-2xl border-border/10" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(d) => setDateRange(prev => ({ ...prev, from: d }))}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-12 justify-start text-left font-bold border-border/40 rounded-xl bg-background/50">
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {dateRange.to ? format(dateRange.to, "PPP", { locale: ptBR }) : "Fim"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-2xl overflow-hidden shadow-2xl border-border/10" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(d) => setDateRange(prev => ({ ...prev, to: d }))}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumo/Preview */}
        <div className="space-y-6">
          <Card className="border-border/40 shadow-xl rounded-[2rem] bg-primary text-primary-foreground overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                {calculating ? <Loader2 className="w-8 h-8 animate-spin" /> : <DatabaseIcon className="w-8 h-8" />}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Registros Encontrados</p>
                <h2 className="text-5xl font-black tracking-tighter">
                  {calculating ? "..." : (previewCount ?? 0)}
                </h2>
              </div>
              <p className="text-xs font-medium opacity-70 px-4">
                Total de itens baseados nos filtros selecionados acima.
              </p>
              <Button 
                onClick={handleExport} 
                disabled={loading || calculating || !previewCount}
                className="w-full h-14 rounded-2xl bg-white text-primary hover:bg-white/90 font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all mt-4"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Download className="w-5 h-5 mr-2" />}
                Exportar Agora
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-lg rounded-[2rem] bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest">Aviso</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Grandes volumes de dados podem levar alguns segundos para processar. Certifique-se de filtrar por período para melhores resultados.
            </p>
          </Card>
        </div>
      </div>

      {/* Histórico */}
      <div className="space-y-4">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 text-muted-foreground">
          <History className="w-4 h-4" />
          Últimas Exportações
        </h2>
        <div className="bg-card/50 backdrop-blur-sm rounded-[2rem] border border-border/40 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-6 py-4 font-black uppercase tracking-widest opacity-60">Data</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest opacity-60">Usuário</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest opacity-60">Tabela</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest opacity-60">Registros</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest opacity-60">Formato</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest opacity-60">Arquivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {history.length > 0 ? history.map((item: any) => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-bold">{format(new Date(item.created_at), "dd/MM/yyyy HH:mm")}</td>
                    <td className="px-6 py-4 font-medium opacity-70">Você</td>
                    <td className="px-6 py-4 font-bold text-primary">{item.table_name}</td>
                    <td className="px-6 py-4 font-black">{item.record_count}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-md bg-muted font-black text-[10px] uppercase">{item.format}</span>
                    </td>
                    <td className="px-6 py-4 font-medium opacity-60 truncate max-w-[150px]">{item.file_name}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground font-medium uppercase tracking-widest opacity-40">
                      Nenhuma exportação registrada ainda
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportDataPage;
