import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  History, 
  User, 
  Calendar, 
  ArrowRight, 
  Clock, 
  ShieldCheck,
  UserCog,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppointmentAuditDialogProps {
  recordId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AppointmentAuditDialog = ({
  recordId,
  open,
  onOpenChange,
}: AppointmentAuditDialogProps) => {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["appointment-audit", recordId],
    queryFn: async () => {
      if (!recordId) return [];
      const { data, error } = await supabase
        .from("activity_logs" as any)
        .select("*")
        .eq("entity_id", recordId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Audit Query Error:", error, "for recordId:", recordId);
        throw error;
      }
      return data || [];
    },
    enabled: !!recordId && open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden border-none bg-background/95 backdrop-blur-xl shadow-2xl flex flex-col">
        <DialogHeader className="p-8 pb-4 border-b border-border/40 bg-muted/20 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <History className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-display font-black uppercase tracking-tight">Histórico de Alterações</DialogTitle>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60">Rastreabilidade Completa do Agendamento</p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-8 pt-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary/30" />
              <p className="text-sm text-muted-foreground font-bold animate-pulse text-center">Buscando linha do tempo...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
              <ShieldCheck className="w-12 h-12 text-muted-foreground" />
              <p className="text-sm font-medium">Nenhum registro encontrado para este ID.</p>
            </div>
          ) : (
            <div className="space-y-8 relative before:absolute before:left-[23px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-primary/40 before:via-border/40 before:to-transparent">
              {logs.map((log: any) => {
                const isUpdate = log.action === 'UPDATE';
                const isInsert = log.action === 'INSERT';
                const isDelete = log.action === 'DELETE';

                return (
                  <div key={log.id} className="relative pl-12 group animate-in fade-in slide-in-from-left-4 duration-500">
                    {/* Timeline dot */}
                    <div className={cn(
                      "absolute left-[16px] top-1.5 w-4 h-4 rounded-full border-4 border-background shadow-lg z-10 transition-transform duration-300 group-hover:scale-125",
                      isInsert ? "bg-emerald-500" : isUpdate ? "bg-blue-500" : "bg-rose-500"
                    )} />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <p className="font-black text-foreground/80 text-[11px] uppercase tracking-widest bg-muted px-2 py-0.5 rounded-lg border border-border/40">
                            {format(parseISO(log.created_at), "dd/MM HH:mm", { locale: ptBR })}
                          </p>
                          <Badge variant="outline" className={cn(
                            "text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-lg border-2",
                            isInsert ? "bg-emerald-50 text-emerald-700 border-emerald-100/50" :
                            isUpdate ? "bg-blue-50 text-blue-700 border-blue-100/50" :
                            "bg-rose-50 text-rose-700 border-rose-100/50"
                          )}>
                            {isInsert ? 'CRIADO' : isUpdate ? 'EDITADO' : 'REMOVIDO'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/60 uppercase">
                          <User className="w-3.5 h-3.5" />
                          {log.user_name || "Sistema"}
                        </div>
                      </div>

                      <div className="p-5 rounded-2xl border bg-card/50 hover:bg-card transition-all duration-300 shadow-sm hover:shadow-md border-l-4">
                        {isUpdate && log.new_data && log.old_data && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {log.old_data.status !== log.new_data.status && (
                                <div className="space-y-1.5">
                                  <span className="font-black opacity-40 uppercase text-[9px] tracking-widest">Status</span>
                                  <div className="flex items-center gap-2">
                                    <span className="line-through opacity-30 text-[10px] font-bold uppercase">{log.old_data.status}</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-primary" />
                                    <span className="font-black text-primary text-[10px] uppercase bg-primary/5 px-2 py-0.5 rounded-lg border border-primary/20">
                                      {log.new_data.status}
                                    </span>
                                  </div>
                                </div>
                              )}
                              {log.old_data.date !== log.new_data.date && (
                                <div className="space-y-1.5">
                                  <span className="font-black opacity-40 uppercase text-[9px] tracking-widest">Data</span>
                                  <div className="flex items-center gap-2">
                                    <span className="line-through opacity-30 text-[10px] font-bold">{log.old_data.date}</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-primary" />
                                    <span className="font-black text-foreground/80 text-[10px] bg-muted px-2 py-0.5 rounded-lg">
                                      {log.new_data.date}
                                    </span>
                                  </div>
                                </div>
                              )}
                              {log.old_data.start_time !== log.new_data.start_time && (
                                <div className="space-y-1.5">
                                  <span className="font-black opacity-40 uppercase text-[9px] tracking-widest">Horário</span>
                                  <div className="flex items-center gap-2">
                                    <span className="line-through opacity-30 text-[10px] font-bold">{log.old_data.start_time?.slice(0, 5)}</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-primary" />
                                    <span className="font-black text-foreground/80 text-[10px] bg-muted px-2 py-0.5 rounded-lg">
                                      {log.new_data.start_time?.slice(0, 5)}
                                    </span>
                                  </div>
                                </div>
                              )}
                              {log.old_data.professional_id !== log.new_data.professional_id && (
                                <div className="space-y-1.5">
                                  <span className="font-black opacity-40 uppercase text-[9px] tracking-widest">Profissional</span>
                                  <div className="flex items-center gap-2">
                                    <UserCog className="w-3.5 h-3.5 text-primary" />
                                    <span className="font-black text-foreground/80 text-[10px] bg-muted px-2 py-0.5 rounded-lg">
                                      Alteração de Profissional
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                            {/* If nothing specific matched but it was an update */}
                            {JSON.stringify(log.old_data) === JSON.stringify(log.new_data) && (
                              <p className="text-[10px] text-muted-foreground italic font-medium">Outras informações atualizadas (notas, telefone, etc)</p>
                            )}
                          </div>
                        )}
                        {isInsert && log.new_data && (
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5" />
                              Novo agendamento criado na agenda
                            </p>
                            <h5 className="font-black text-foreground/90 uppercase tracking-tight text-sm">
                              {log.new_data.client_name}
                            </h5>
                          </div>
                        )}
                        {isDelete && log.old_data && (
                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-rose-600/60 uppercase tracking-widest flex items-center gap-2">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Registro removido permanentemente
                            </p>
                            <h5 className="font-black text-foreground/60 line-through uppercase tracking-tight text-sm">
                              {log.old_data.client_name || "Agendamento"}
                            </h5>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentAuditDialog;
