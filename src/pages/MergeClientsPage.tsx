import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useClients } from "@/hooks/useClinicData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  Users, 
  ArrowRight, 
  Search, 
  AlertTriangle, 
  UserMinus, 
  UserCheck,
  Calendar,
  FileText,
  Paperclip,
  DollarSign,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { matchesPhone } from "@/utils/phoneUtils";
import { toast } from "sonner";
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
import { motion, AnimatePresence } from "framer-motion";

const MergeClientsPage = () => {
  const queryClient = useQueryClient();
  const [sourceSearch, setSourceSearch] = useState("");
  const [targetSearch, setTargetSearch] = useState("");
  const [sourceClientId, setSourceClientId] = useState<string | null>(null);
  const [targetClientId, setTargetClientId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isMerging, setIsMerging] = useState(false);

  const { data: sourceClientsData } = useClients({ search: sourceSearch, pageSize: 10 });
  const { data: targetClientsData } = useClients({ search: targetSearch, pageSize: 10 });

  const sourceClients = sourceClientsData?.data ?? [];
  const targetClients = targetClientsData?.data ?? [];

  const filteredSource = sourceSearch.trim().length >= 2
    ? sourceClients.filter(c =>
        c.full_name.toLowerCase().includes(sourceSearch.toLowerCase()) ||
        matchesPhone(c.phone, sourceSearch)
      )
    : [];

  const filteredTarget = targetSearch.trim().length >= 2
    ? targetClients.filter(c =>
        c.full_name.toLowerCase().includes(targetSearch.toLowerCase()) ||
        matchesPhone(c.phone, targetSearch)
      )
    : [];

  const { data: sourceStats } = useQuery({
    queryKey: ["client_stats", sourceClientId],
    queryFn: async () => {
      if (!sourceClientId) return null;
      const [appts, records, files, finance] = await Promise.all([
        supabase.from("appointments").select("id", { count: "exact", head: true }).eq("client_id", sourceClientId),
        supabase.from("patient_records").select("id", { count: "exact", head: true }).eq("client_id", sourceClientId),
        supabase.from("client_attachments").select("id", { count: "exact", head: true }).eq("client_id", sourceClientId),
        supabase.from("finance_records").select("id", { count: "exact", head: true }).eq("client_id", sourceClientId),
      ]);
      return {
        appointments: appts.count || 0,
        records: records.count || 0,
        attachments: files.count || 0,
        finance: finance.count || 0,
      };
    },
    enabled: !!sourceClientId,
  });

  const { data: targetStats } = useQuery({
    queryKey: ["client_stats", targetClientId],
    queryFn: async () => {
      if (!targetClientId) return null;
      const [appts, records, files, finance] = await Promise.all([
        supabase.from("appointments").select("id", { count: "exact", head: true }).eq("client_id", targetClientId),
        supabase.from("patient_records").select("id", { count: "exact", head: true }).eq("client_id", targetClientId),
        supabase.from("client_attachments").select("id", { count: "exact", head: true }).eq("client_id", targetClientId),
        supabase.from("finance_records").select("id", { count: "exact", head: true }).eq("client_id", targetClientId),
      ]);
      return {
        appointments: appts.count || 0,
        records: records.count || 0,
        attachments: files.count || 0,
        finance: finance.count || 0,
      };
    },
    enabled: !!targetClientId,
  });

  const selectedSourceClient = sourceClients.find(c => c.id === sourceClientId);
  const selectedTargetClient = targetClients.find(c => c.id === targetClientId);

  const handleMerge = async () => {
    if (!sourceClientId || !targetClientId) return;
    if (sourceClientId === targetClientId) {
      toast.error("Não é possível unificar o mesmo cliente.");
      return;
    }

    setIsMerging(true);
    try {
      // 1. Update references
      const tables = ["appointments", "patient_records", "client_attachments", "finance_records"];
      for (const table of tables) {
        const { error } = await supabase
          .from(table as any)
          .update({ client_id: targetClientId })
          .eq("client_id", sourceClientId);
        
        if (error) throw new Error(`Erro ao transferir dados de ${table}: ${error.message}`);
      }

      // 2. Delete source client
      const { error: deleteError } = await supabase
        .from("clients")
        .delete()
        .eq("id", sourceClientId);

      if (deleteError) throw new Error(`Erro ao excluir cliente de origem: ${deleteError.message}`);

      toast.success("Clientes unificados com sucesso!");
      setSourceClientId(null);
      setSourceSearch("");
      setTargetClientId(null);
      setTargetSearch("");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsMerging(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2 mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-foreground">Unificar Cadastros</h1>
        <p className="text-muted-foreground italic">
          Resolva duplicidades movendo todos os atendimentos e registros de um cadastro para outro.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] gap-8 items-start max-w-6xl mx-auto">
        {/* Source Client */}
        <Card className={cn(
          "transition-all duration-300 border-2",
          sourceClientId ? "border-red-200 bg-red-50/10" : "border-border shadow-sm"
        )}>
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <UserMinus className="w-5 h-5 text-red-500" />
              <CardTitle className="text-xl">Cliente de Origem</CardTitle>
            </div>
            <CardDescription>(Será removido após a unificação)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!sourceClientId ? (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou telefone..."
                    value={sourceSearch}
                    onChange={(e) => setSourceSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <AnimatePresence>
                  {filteredSource.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="border border-border rounded-lg max-h-48 overflow-y-auto bg-card"
                    >
                      {filteredSource.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setSourceClientId(c.id)}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-muted transition-colors flex flex-col border-b border-border last:border-0"
                        >
                          <span className="font-bold text-foreground">{c.full_name}</span>
                          <span className="text-xs text-muted-foreground">{c.phone || "Sem telefone"}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-background rounded-xl p-5 border shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 text-muted-foreground hover:text-red-500"
                  onClick={() => { setSourceClientId(null); setSourceSearch(""); }}
                >
                  Alterar
                </Button>
                <div className="space-y-4 pt-2">
                  <div>
                    <h3 className="text-lg font-bold leading-none">{selectedSourceClient?.full_name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{selectedSourceClient?.phone || "Sem telefone"}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
                    <StatBox icon={Calendar} label="Agendamentos" value={sourceStats?.appointments} color="bg-blue-50 text-blue-600" />
                    <StatBox icon={FileText} label="Prontuários" value={sourceStats?.records} color="bg-amber-50 text-amber-600" />
                    <StatBox icon={Paperclip} label="Anexos" value={sourceStats?.attachments} color="bg-purple-50 text-purple-600" />
                    <StatBox icon={DollarSign} label="Financeiro" value={sourceStats?.finance} color="bg-emerald-50 text-emerald-600" />
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Transfer Arrow */}
        <div className="flex lg:flex-col items-center justify-center py-4 self-center opacity-30">
          <ArrowRight className="w-8 h-8 lg:rotate-0 rotate-90" />
        </div>

        {/* Target Client */}
        <Card className={cn(
          "transition-all duration-300 border-2",
          targetClientId ? "border-green-200 bg-green-50/10" : "border-border shadow-sm"
        )}>
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <UserCheck className="w-5 h-5 text-green-500" />
              <CardTitle className="text-xl">Cliente de Destino</CardTitle>
            </div>
            <CardDescription>(Receberá todos os dados)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!targetClientId ? (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome ou telefone..."
                    value={targetSearch}
                    onChange={(e) => setTargetSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <AnimatePresence>
                  {filteredTarget.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="border border-border rounded-lg max-h-48 overflow-y-auto bg-card"
                    >
                      {filteredTarget.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setTargetClientId(c.id)}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-muted transition-colors flex flex-col border-b border-border last:border-0"
                        >
                          <span className="font-bold text-foreground">{c.full_name}</span>
                          <span className="text-xs text-muted-foreground">{c.phone || "Sem telefone"}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-background rounded-xl p-5 border shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2 text-muted-foreground hover:text-green-500"
                  onClick={() => { setTargetClientId(null); setTargetSearch(""); }}
                >
                  Alterar
                </Button>
                <div className="space-y-4 pt-2">
                  <div>
                    <h3 className="text-lg font-bold leading-none">{selectedTargetClient?.full_name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{selectedTargetClient?.phone || "Sem telefone"}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
                    <StatBox icon={Calendar} label="Agendamentos" value={targetStats?.appointments} color="bg-blue-50 text-blue-600" />
                    <StatBox icon={FileText} label="Prontuários" value={targetStats?.records} color="bg-amber-50 text-amber-600" />
                    <StatBox icon={Paperclip} label="Anexos" value={targetStats?.attachments} color="bg-purple-50 text-purple-600" />
                    <StatBox icon={DollarSign} label="Financeiro" value={targetStats?.finance} color="bg-emerald-50 text-emerald-600" />
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Area */}
      {sourceClientId && targetClientId && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-12 flex flex-col items-center gap-6 p-8 border-2 border-dashed rounded-2xl bg-muted/20"
        >
          <div className="flex items-center gap-3 text-amber-600 bg-amber-50 px-6 py-3 rounded-full border border-amber-200">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">Esta ação não pode ser desfeita. Todos os dados serão fundidos.</span>
          </div>

          <Button 
            size="lg" 
            className="h-14 px-12 text-lg font-bold shadow-xl hover:shadow-2xl transition-all"
            onClick={() => setShowConfirm(true)}
            disabled={sourceClientId === targetClientId}
          >
            {isMerging ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : <CheckCircle2 className="w-5 h-5 mr-3" />}
            Confirmar Unificação
          </Button>
        </motion.div>
      )}

      {/* Confirm Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              Confirmar Fusão de Cadastros
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-4 space-y-4">
              <p>Você está unificando o prontuário de:</p>
              <div className="bg-red-50 p-3 rounded-lg border border-red-100 font-bold text-red-900 line-through opacity-70">
                {selectedSourceClient?.full_name}
              </div>
              <p className="text-center font-bold text-muted-foreground px-2">dentro do prontuário de:</p>
              <div className="bg-green-50 p-3 rounded-lg border border-green-100 font-bold text-green-900">
                {selectedTargetClient?.full_name}
              </div>
              <p className="text-sm text-foreground">
                Todos os itens (agendamentos, anexos e fichas) serão transferidos. O primeiro cadastro será **permanentemente excluído**.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-6">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleMerge}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Unificar e Excluir Duplicata
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const StatBox = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: number | undefined, color: string }) => (
  <div className="flex items-center gap-2 p-2 rounded-lg border border-border/40 bg-muted/10">
    <div className={cn("p-1.5 rounded-md", color)}>
      <Icon className="w-3.5 h-3.5" />
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-[10px] text-muted-foreground uppercase font-semibold leading-tight">{label}</span>
      <span className="text-sm font-bold leading-tight tabular-nums">
        {value === undefined ? "..." : value}
      </span>
    </div>
  </div>
);

export default MergeClientsPage;
