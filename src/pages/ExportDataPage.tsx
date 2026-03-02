import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Loader2, CheckCircle2, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

type ExportFormat = "xlsx" | "csv";

interface TableConfig {
  key: string;
  label: string;
  description: string;
  table: string;
}

const tables: TableConfig[] = [
  { key: "clients", label: "Clientes", description: "Cadastro completo de clientes", table: "clients" },
  { key: "appointments", label: "Agendamentos", description: "Histórico de agendamentos", table: "appointments" },
  { key: "appointment_services", label: "Serviços dos Agendamentos", description: "Serviços vinculados a cada agendamento", table: "appointment_services" },
  { key: "professionals", label: "Profissionais", description: "Cadastro de profissionais", table: "professionals" },
  { key: "professional_schedules", label: "Horários dos Profissionais", description: "Turnos de trabalho por dia da semana", table: "professional_schedules" },
  { key: "professional_services", label: "Serviços dos Profissionais", description: "Vínculos entre profissionais e serviços", table: "professional_services" },
  { key: "services", label: "Serviços", description: "Catálogo de serviços oferecidos", table: "services" },
  { key: "finance_records", label: "Financeiro", description: "Registros financeiros", table: "finance_records" },
  { key: "patient_records", label: "Prontuários", description: "Fichas e anamneses dos clientes", table: "patient_records" },
  { key: "client_attachments", label: "Anexos", description: "Arquivos anexados aos clientes", table: "client_attachments" },
  { key: "anamnesis_templates", label: "Modelos de Anamnese", description: "Templates de fichas de anamnese", table: "anamnesis_templates" },
  { key: "blocked_slots", label: "Bloqueios de Agenda", description: "Horários bloqueados na agenda", table: "blocked_slots" },
  { key: "profiles", label: "Perfis de Usuário", description: "Dados dos perfis de acesso", table: "profiles" },
  { key: "invitations", label: "Convites", description: "Convites gerados para cadastro", table: "invitations" },
  { key: "user_roles", label: "Funções de Usuário", description: "Papéis atribuídos aos usuários", table: "user_roles" },
];

const ExportDataPage = () => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [exported, setExported] = useState<Record<string, boolean>>({});
  const [exportingAll, setExportingAll] = useState(false);
  const [format, setFormat] = useState<ExportFormat>("xlsx");
  const { toast } = useToast();

  const fetchAllRows = async (tableName: string) => {
    const all: Record<string, unknown>[] = [];
    const pageSize = 1000;
    let from = 0;

    while (true) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from(tableName)
        .select("*")
        .range(from, from + pageSize - 1);

      if (error) throw error;
      if (!data || data.length === 0) break;
      all.push(...data);
      if (data.length < pageSize) break;
      from += pageSize;
    }

    return all;
  };

  const downloadFile = (data: Record<string, unknown>[], fileName: string, sheetName: string) => {
    if (format === "xlsx") {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    } else {
      const ws = XLSX.utils.json_to_sheet(data);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const exportTable = async (config: TableConfig) => {
    setLoading(prev => ({ ...prev, [config.key]: true }));
    try {
      const data = await fetchAllRows(config.table);

      if (data.length === 0) {
        toast({ title: `${config.label}`, description: "Tabela vazia, nada para exportar.", variant: "destructive" });
        return;
      }

      const fileName = `${config.table}_${new Date().toISOString().slice(0, 10)}`;
      downloadFile(data, fileName, config.label);

      setExported(prev => ({ ...prev, [config.key]: true }));
      toast({ title: "Exportado!", description: `${config.label}: ${data.length} registros exportados.` });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      toast({ title: "Erro na exportação", description: message, variant: "destructive" });
    } finally {
      setLoading(prev => ({ ...prev, [config.key]: false }));
    }
  };

  const exportAll = async () => {
    setExportingAll(true);
    try {
      const wb = XLSX.utils.book_new();
      let totalRecords = 0;

      for (const config of tables) {
        setLoading(prev => ({ ...prev, [config.key]: true }));
        try {
          const data = await fetchAllRows(config.table);
          if (data.length > 0) {
            const ws = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, config.label.substring(0, 31));
            totalRecords += data.length;
          }
          setExported(prev => ({ ...prev, [config.key]: true }));
        } catch {
          // Skip tables with permission errors
        } finally {
          setLoading(prev => ({ ...prev, [config.key]: false }));
        }
      }

      if (format === "xlsx") {
        if (totalRecords > 0) {
          XLSX.writeFile(wb, `backup_completo_${new Date().toISOString().slice(0, 10)}.xlsx`);
          toast({ title: "Backup completo!", description: `${totalRecords} registros exportados em ${wb.SheetNames.length} tabelas.` });
        }
      } else {
        // CSV: export each table as separate file
        for (const config of tables) {
          try {
            const data = await fetchAllRows(config.table);
            if (data.length > 0) {
              const ws = XLSX.utils.json_to_sheet(data);
              const csv = XLSX.utils.sheet_to_csv(ws);
              const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${config.table}_${new Date().toISOString().slice(0, 10)}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }
          } catch { /* skip */ }
        }
        toast({ title: "Backup completo!", description: "Arquivos CSV gerados para cada tabela." });
      }
    } finally {
      setExportingAll(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Database className="w-6 h-6 text-primary" />
            Exportar Dados
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Exporte suas tabelas em formato Excel ou CSV para backup ou análise.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
            <SelectTrigger className="w-[110px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
              <SelectItem value="csv">CSV (.csv)</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportAll} disabled={exportingAll}>
            {exportingAll ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            {exportingAll ? "Exportando..." : "Exportar Tudo"}
          </Button>
        </div>
      </div>

      <div className="grid gap-3">
        {tables.map(config => (
          <Card key={config.key} className="flex flex-row items-center justify-between p-4 gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-foreground">{config.label}</span>
                {exported[config.key] && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground truncate">{config.description}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => exportTable(config)}
              disabled={loading[config.key] || exportingAll}
              className="shrink-0"
            >
              {loading[config.key] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExportDataPage;
