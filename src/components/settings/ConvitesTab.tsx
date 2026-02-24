import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Copy, Link2, Clock, CheckCircle2, XCircle } from "lucide-react";
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
      toast.success("Link copiado para a área de transferência!", {
        description: "O link expira em 1 hora.",
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

  const copyLink = (token: string) => {
    const link = `${window.location.origin}/cadastro?token=${token}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copiado!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Gerar Link de Convite</CardTitle>
          <CardDescription>
            Gere um link para que um novo usuário se cadastre no sistema. O link expira em 1 hora.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Função</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profissional">Profissional</SelectItem>
                  <SelectItem value="gestor">Gestor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => generateMutation.mutate(selectedRole)}
              disabled={generateMutation.isPending}
            >
              <Link2 className="mr-2 h-4 w-4" />
              {generateMutation.isPending ? "Gerando..." : "Gerar e Copiar Link"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Convites Gerados</CardTitle>
          <CardDescription>Histórico de links de convite gerados.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : invitations.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum convite gerado ainda.</p>
          ) : (
            <div className="space-y-3">
              {invitations.map((invite: any) => {
                const status = getStatus(invite);
                return (
                  <div
                    key={invite.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={invite.role === "gestor" ? "default" : "secondary"}>
                            {invite.role}
                          </Badge>
                          {status === "ativo" && (
                            <Badge variant="outline" className="text-primary border-primary/30">
                              <Clock className="mr-1 h-3 w-3" /> Ativo
                            </Badge>
                          )}
                          {status === "usado" && (
                            <Badge variant="outline" className="text-accent-foreground border-accent">
                              <CheckCircle2 className="mr-1 h-3 w-3" /> Usado
                            </Badge>
                          )}
                          {status === "expirado" && (
                            <Badge variant="outline" className="text-muted-foreground border-muted">
                              <XCircle className="mr-1 h-3 w-3" /> Expirado
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Criado em {format(new Date(invite.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          {" · "}Expira em {format(new Date(invite.expires_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    {status === "ativo" && (
                      <Button variant="ghost" size="sm" onClick={() => copyLink(invite.token)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConvitesTab;
