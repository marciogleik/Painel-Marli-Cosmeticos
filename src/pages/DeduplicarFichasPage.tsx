import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Search,
  ChevronRight,
  ChevronDown,
  Trash2,
  Shield,
  Loader2,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Copy,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────
interface DuplicateGroup {
  clientId: string;
  clientName: string;
  titleGroups: {
    title: string;
    count: number;
    records: RecordItem[];
  }[];
  totalDuplicates: number;
}

interface RecordItem {
  id: string;
  title: string;
  record_type: string;
  content: any;
  created_at: string;
  updated_at: string;
  professional_id: string | null;
  signature_url: string | null;
  signed_at: string | null;
}

// ─── Hooks ───────────────────────────────────────────────
const useDuplicateRecords = () => {
  return useQuery({
    queryKey: ["duplicate-patient-records"],
    queryFn: async () => {
      // Fetch all patient records
      const allRecords: RecordItem[] = [];
      let from = 0;
      const batchSize = 1000;
      while (true) {
        const { data, error } = await supabase
          .from("patient_records")
          .select("id, client_id, title, record_type, content, created_at, updated_at, professional_id, signature_url, signed_at")
          .order("created_at", { ascending: true })
          .range(from, from + batchSize - 1);
        if (error) throw error;
        allRecords.push(...(data as any[]));
        if (data.length < batchSize) break;
        from += batchSize;
      }

      // Get client names
      const clientIds = [...new Set(allRecords.map((r: any) => r.client_id))];
      const clientMap: Record<string, string> = {};
      for (let i = 0; i < clientIds.length; i += 50) {
        const batch = clientIds.slice(i, i + 50);
        const { data } = await supabase.from("clients").select("id, full_name").in("id", batch);
        if (data) data.forEach((c) => (clientMap[c.id] = c.full_name));
      }

      // Group by client_id + title
      const groups: Record<string, { clientId: string; title: string; records: any[] }> = {};
      for (const rec of allRecords) {
        const key = `${(rec as any).client_id}|${rec.title}`;
        if (!groups[key]) groups[key] = { clientId: (rec as any).client_id, title: rec.title || rec.record_type, records: [] };
        groups[key].records.push(rec);
      }

      // Filter to only duplicates
      const dupEntries = Object.values(groups).filter((g) => g.records.length > 1);

      // Group by client
      const byClient: Record<string, DuplicateGroup> = {};
      for (const entry of dupEntries) {
        if (!byClient[entry.clientId]) {
          byClient[entry.clientId] = {
            clientId: entry.clientId,
            clientName: clientMap[entry.clientId] || "Desconhecido",
            titleGroups: [],
            totalDuplicates: 0,
          };
        }
        byClient[entry.clientId].titleGroups.push({
          title: entry.title,
          count: entry.records.length,
          records: entry.records,
        });
        byClient[entry.clientId].totalDuplicates += entry.records.length;
      }

      return Object.values(byClient).sort((a, b) => b.totalDuplicates - a.totalDuplicates);
    },
    staleTime: 1000 * 60 * 5,
  });
};

// ─── Render content helper ───────────────────────────────
const renderContent = (content: any): string => {
  if (!content) return "(vazio)";
  if (Array.isArray(content)) {
    return content.map((item: any) => `${item.label || ""}: ${item.value || ""}`).join("\n");
  }
  if (content.answers && typeof content.answers === "object") {
    return Object.entries(content.answers)
      .map(([, v]) => String(v))
      .join("\n");
  }
  if (typeof content === "string") return content;
  return JSON.stringify(content, null, 2);
};

// ─── Main Page ───────────────────────────────────────────
const DeduplicarFichasPage = () => {
  const queryClient = useQueryClient();
  const { data: duplicates = [], isLoading } = useDuplicateRecords();
  const [search, setSearch] = useState("");
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [expandedTitle, setExpandedTitle] = useState<string | null>(null);
  const [selectedToKeep, setSelectedToKeep] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState<{ groupKey: string; keepId: string; deleteIds: string[]; title: string; clientName: string } | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return duplicates;
    const q = search.toLowerCase();
    return duplicates.filter((d) => d.clientName.toLowerCase().includes(q));
  }, [duplicates, search]);

  const totalDupGroups = useMemo(() => duplicates.reduce((sum, d) => sum + d.titleGroups.length, 0), [duplicates]);

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("patient_records").delete().in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["duplicate-patient-records"] });
      toast.success("Fichas duplicadas excluídas com sucesso!");
      setConfirmDelete(null);
    },
    onError: (err: Error) => {
      toast.error(`Erro ao excluir: ${err.message}`);
    },
  });

  const handleDeleteGroup = (clientId: string, title: string, clientName: string, records: RecordItem[]) => {
    const groupKey = `${clientId}|${title}`;
    const keepId = selectedToKeep[groupKey];
    if (!keepId) {
      toast.error("Selecione qual ficha deseja manter antes de excluir.");
      return;
    }
    const deleteIds = records.filter((r) => r.id !== keepId).map((r) => r.id);
    setConfirmDelete({ groupKey, keepId, deleteIds, title, clientName });
  };

  return (
    <div className="flex flex-col h-full overflow-auto bg-transparent">
      {/* Header */}
      <div className="px-4 sm:px-8 pt-8 sm:pt-12 pb-6 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Copy className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs font-black tracking-[0.3em] text-primary uppercase">Manutenção de Dados</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tighter text-foreground uppercase leading-none">
          Fichas Duplicadas
        </h1>
        <p className="text-muted-foreground font-medium max-w-lg pt-1">
          Revise fichas de prontuário duplicadas, compare o conteúdo lado a lado e decida qual manter.
        </p>
      </div>

      <div className="px-4 sm:px-8 pb-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Stats bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 bg-background/40 backdrop-blur-md rounded-[2rem] border border-white/10 shadow-xl ring-1 ring-white/5">
          <div className="flex items-center gap-3 grow">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-11 bg-white/5 border-white/10 rounded-xl"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-primary/20 bg-primary/5 rounded-xl">
              {duplicates.length} clientes
            </Badge>
            <Badge variant="outline" className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-amber-500/20 bg-amber-500/5 rounded-xl text-amber-600">
              {totalDupGroups} grupos
            </Badge>
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Analisando fichas...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-background/40 backdrop-blur-md rounded-[2.5rem] border border-white/10">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4 opacity-40" />
            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground/40">
              {search ? "Nenhum resultado para a busca" : "Nenhuma duplicata encontrada"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((client) => {
              const isExpanded = expandedClient === client.clientId;
              return (
                <div
                  key={client.clientId}
                  className="bg-background/40 backdrop-blur-md rounded-[2rem] border border-white/10 shadow-xl ring-1 ring-white/5 overflow-hidden transition-all"
                >
                  {/* Client row */}
                  <button
                    onClick={() => {
                      setExpandedClient(isExpanded ? null : client.clientId);
                      setExpandedTitle(null);
                    }}
                    className="w-full flex items-center justify-between p-5 sm:p-6 hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-display font-black text-base sm:text-lg uppercase tracking-tight truncate">
                          {client.clientName}
                        </p>
                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider mt-0.5">
                          {client.titleGroups.length} tipo{client.titleGroups.length > 1 ? "s" : ""} • {client.totalDuplicates} fichas
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] font-black uppercase">
                        {client.totalDuplicates} duplicatas
                      </Badge>
                      {isExpanded ? <ChevronDown className="w-5 h-5 text-muted-foreground" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                    </div>
                  </button>

                  {/* Expanded: title groups */}
                  {isExpanded && (
                    <div className="border-t border-white/5 px-4 sm:px-6 pb-6 space-y-3 pt-4">
                      {client.titleGroups.map((tg) => {
                        const titleKey = `${client.clientId}|${tg.title}`;
                        const isTitleExpanded = expandedTitle === titleKey;
                        return (
                          <div key={titleKey} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                            <button
                              onClick={() => setExpandedTitle(isTitleExpanded ? null : titleKey)}
                              className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors text-left"
                            >
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-[10px] font-black uppercase bg-primary/5 border-primary/20">
                                  {tg.count}×
                                </Badge>
                                <span className="font-bold text-sm">{tg.title}</span>
                              </div>
                              {isTitleExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                            </button>

                            {/* Expanded: records side by side */}
                            {isTitleExpanded && (
                              <div className="border-t border-white/5 p-4 space-y-4">
                                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(tg.count, 3)}, 1fr)` }}>
                                  {tg.records.map((rec) => {
                                    const isKept = selectedToKeep[titleKey] === rec.id;
                                    return (
                                      <div
                                        key={rec.id}
                                        onClick={() => setSelectedToKeep((prev) => ({ ...prev, [titleKey]: rec.id }))}
                                        className={cn(
                                          "rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md",
                                          isKept
                                            ? "border-emerald-500 bg-emerald-500/5 ring-2 ring-emerald-500/20"
                                            : "border-white/10 bg-background/40 hover:border-primary/30"
                                        )}
                                      >
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
                                          <div className="flex items-center gap-2">
                                            {isKept ? (
                                              <Shield className="w-4 h-4 text-emerald-500" />
                                            ) : (
                                              <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                                            )}
                                            <span className={cn("text-[10px] font-black uppercase tracking-wider", isKept ? "text-emerald-600" : "text-muted-foreground/60")}>
                                              {isKept ? "Manter" : "Selecionar"}
                                            </span>
                                          </div>
                                          <span className="text-[9px] font-mono text-muted-foreground/40">{rec.id.slice(0, 8)}</span>
                                        </div>

                                        {/* Metadata */}
                                        <div className="space-y-1.5 mb-3 text-[10px]">
                                          <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            <span className="font-bold">Criado: {format(parseISO(rec.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
                                          </div>
                                          <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            <span className="font-bold">Editado: {format(parseISO(rec.updated_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
                                          </div>
                                          {rec.signature_url && (
                                            <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                                              ✍ Assinada
                                            </Badge>
                                          )}
                                        </div>

                                        {/* Content */}
                                        <div className="bg-black/10 rounded-lg p-3 max-h-48 overflow-y-auto">
                                          <pre className="text-[11px] font-mono whitespace-pre-wrap break-words text-muted-foreground leading-relaxed">
                                            {renderContent(rec.content)}
                                          </pre>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Action button */}
                                <div className="flex items-center justify-between pt-2">
                                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                                    {selectedToKeep[titleKey]
                                      ? `${tg.count - 1} ficha${tg.count - 1 > 1 ? "s" : ""} será${tg.count - 1 > 1 ? "ão" : ""} excluída${tg.count - 1 > 1 ? "s" : ""}`
                                      : "Selecione a ficha que deseja manter"}
                                  </p>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="gap-2 rounded-xl font-bold text-[10px] uppercase tracking-wider"
                                    disabled={!selectedToKeep[titleKey] || deleteMutation.isPending}
                                    onClick={() => handleDeleteGroup(client.clientId, tg.title, client.clientName, tg.records)}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Excluir Duplicatas
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      <AlertDialog open={!!confirmDelete} onOpenChange={(open) => { if (!open) setConfirmDelete(null); }}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-4 space-y-3">
              <p>Você está excluindo fichas duplicadas de:</p>
              <div className="bg-muted/30 p-3 rounded-lg border font-bold">
                {confirmDelete?.clientName} — {confirmDelete?.title}
              </div>
              <p className="text-sm">
                <strong>{confirmDelete?.deleteIds.length}</strong> ficha{(confirmDelete?.deleteIds.length ?? 0) > 1 ? "s serão excluídas" : " será excluída"} permanentemente. A ficha selecionada será mantida.
              </p>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span className="text-xs font-medium">Esta ação não pode ser desfeita.</span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmDelete) deleteMutation.mutate(confirmDelete.deleteIds);
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Excluir {confirmDelete?.deleteIds.length} Ficha{(confirmDelete?.deleteIds.length ?? 0) > 1 ? "s" : ""}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeduplicarFichasPage;
