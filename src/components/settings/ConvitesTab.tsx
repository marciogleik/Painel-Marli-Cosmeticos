import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Copy, Link2, Clock, CheckCircle2, XCircle, Ban, History, ShieldPlus, Sparkles, Loader2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const ConvitesTab = () => {
  const [selectedRole, setSelectedRole] = useState<string>("profissional");
  const queryClient = useQueryClient();

  const { data: invitations = [], isLoading } = useQuery({
    queryKey: ["invitations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (role: string) => {
      const { data, error } = await supabase.functions.invoke("generate-invite", {
        body: { role },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      const link = `${window.location.origin}/cadastro?token=${data.token}`;
      navigator.clipboard.writeText(link);
      toast.success("Link copiado!", {
        description: "O convite foi gerado e expira em 1 hora.",
      });
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
    onError: (error: any) => {
      toast.error("Erro ao gerar convite", { description: error.message });
    },
  });

  const getStatus = (invite: any) => {
    if (invite.used_at) return "usado";
    if (new Date(invite.expires_at) < new Date()) return "expirado";
    return "ativo";
  };

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("invitations")
        .update({ expires_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Convite cancelado!");
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
    onError: (error: any) => {
      toast.error("Erro ao cancelar convite", { description: error.message });
    },
  });

  const copyLink = (token: string) => {
    const link = `${window.location.origin}/cadastro?token=${token}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copiado!");
  };

  return (
    <div className="space-y-6 max-w-4xl pb-20">
      <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-primary/5 via-background to-background ring-1 ring-primary/10">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldPlus className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground/90">Gerar Novo Convite</h3>
              </div>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                Crie um link de acesso temporário para novos membros da equipe. O link é de uso único e expira automaticamente após 1 hora.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Badge className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors">
                  <Sparkles className="w-3 h-3 mr-1" /> Expiração em 60m
                </Badge>
                <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                  Uso Único
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 md:min-w-[400px]">
              <div className="flex-1 space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Atribuição de Cargo</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="h-11 rounded-xl bg-background/50 border-input/50 focus:ring-primary/20 transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-primary/10">
                    <SelectItem value="profissional" className="rounded-lg py-3 focus:bg-primary/10 focus:text-primary">
                      <div className="flex items-center gap-2 font-medium">
                        Profissional <span className="text-[10px] opacity-60 font-normal">(Agenda + Atendimentos)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="gestor" className="rounded-lg py-3 focus:bg-primary/10 focus:text-primary">
                      <div className="flex items-center gap-2 font-medium">
                        Gestor <span className="text-[10px] opacity-60 font-normal">(Acesso Total)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                size="lg"
                className="h-11 rounded-xl px-6 gap-2 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                onClick={() => generateMutation.mutate(selectedRole)}
                disabled={generateMutation.isPending}
              >
                {generateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                Gerar & Copiar Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-display font-bold text-lg text-foreground/80">Histórico de Convites</h3>
          </div>
          <Badge variant="secondary" className="bg-muted text-muted-foreground font-mono">
            {invitations.length} Total
          </Badge>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 border border-dashed rounded-3xl bg-muted/5">
            <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
            <p className="text-sm text-muted-foreground font-medium italic">Buscando histórico...</p>
          </div>
        ) : invitations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 border border-dashed rounded-3xl bg-muted/5 opacity-60">
            <div className="w-16 h-16 rounded-full bg-muted/10 flex items-center justify-center">
              <History className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">Ainda não há convites registrados no sistema.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {invitations.map((invite: any) => {
              const status = getStatus(invite);
              return (
                <div
                  key={invite.id}
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border border-border/40 bg-card hover:border-primary/20 hover:bg-primary/[0.01] hover:shadow-md transition-all duration-300 gap-4"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${
                      status === "ativo" ? "bg-primary/10 text-primary" : 
                      status === "usado" ? "bg-green-100 text-green-600" : 
                      "bg-muted/50 text-muted-foreground"
                    }`}>
                      {status === "ativo" ? <Link2 className="w-5 h-5" /> : 
                       status === "usado" ? <CheckCircle2 className="w-5 h-5" /> : 
                       <Ban className="w-5 h-5 opacity-40" />}
                    </div>
                    
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center flex-wrap gap-2">
                        <Badge variant="outline" className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border-none shadow-sm ${
                          invite.role === "gestor" ? "bg-indigo-500 text-white" : "bg-emerald-500 text-white"
                        }`}>
                          {invite.role}
                        </Badge>
                        
                        {status === "ativo" && (
                          <Badge variant="outline" className="text-[10px] font-bold bg-primary/5 text-primary border-primary/20 px-2 py-0.5 animate-pulse">
                            Link Ativo
                          </Badge>
                        )}
                        {status === "usado" && (
                          <Badge variant="outline" className="text-[10px] font-bold bg-green-500/5 text-green-600 border-green-200 px-2 py-0.5">
                            Já Utilizado
                          </Badge>
                        )}
                        {status === "expirado" && (
                          <Badge variant="outline" className="text-[10px] font-bold bg-muted/50 text-muted-foreground border-muted px-2 py-0.5">
                            Expirado
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1">
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                          <Clock className="w-3 h-3 opacity-50" />
                          Gerado em {format(new Date(invite.created_at), "dd MMM, HH:mm", { locale: ptBR })}
                        </p>
                        {status === "ativo" && (
                          <p className="text-[11px] text-primary/70 font-medium flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 opacity-50" />
                            Expira em {format(new Date(invite.expires_at), "HH:mm", { locale: ptBR })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {status === "ativo" && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-9 px-4 rounded-xl gap-2 font-bold text-xs border-primary/20 text-primary hover:bg-primary/5 shadow-sm"
                          onClick={() => copyLink(invite.token)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Copiar Link
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                          onClick={() => cancelMutation.mutate(invite.id)}
                          disabled={cancelMutation.isPending}
                          title="Cancelar Convite"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {(status === "usado" || status === "expirado") && (
                      <div className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest bg-muted/20 px-3 py-1.5 rounded-lg italic">
                        Finalizado
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Internal components for consistency
const Badge = ({ children, variant = "default", className = "" }: any) => {
  const styles = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-border text-foreground",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${styles[variant as keyof typeof styles]} ${className}`}>
      {children}
    </span>
  );
};

export default ConvitesTab;
