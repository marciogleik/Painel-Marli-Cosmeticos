import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, Mail, Calendar, MapPin, FileText, User } from "lucide-react";
import { format, differenceInYears, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DBClient } from "@/hooks/useClinicData";
import AnamneseTab from "@/components/client/AnamneseTab";

const useClient = (id: string) =>
  useQuery({
    queryKey: ["client", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as DBClient;
    },
    enabled: !!id,
  });

const useClientStats = (clientId: string) =>
  useQuery({
    queryKey: ["client_stats", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("status")
        .eq("client_id", clientId);
      if (error) throw error;
      const rows = data ?? [];
      return {
        atendidos: rows.filter((r) => r.status === "atendido").length,
        faltas: rows.filter((r) => r.status === "falta").length,
        cancelados: rows.filter((r) => r.status === "cancelado").length,
      };
    },
    enabled: !!clientId,
  });

const ClientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: client, isLoading } = useClient(id!);
  const { data: stats } = useClientStats(id!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">Cliente não encontrado</p>
        <Button variant="outline" onClick={() => navigate("/clientes")}>
          Voltar
        </Button>
      </div>
    );
  }

  const age = client.birth_date
    ? differenceInYears(new Date(), parseISO(client.birth_date))
    : null;

  const getInitials = (name: string) => {
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-6 pb-4 shrink-0 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 mb-3 -ml-2 text-muted-foreground"
          onClick={() => navigate("/clientes")}
        >
          <ArrowLeft className="w-4 h-4" /> Clientes
        </Button>

        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
            {getInitials(client.full_name)}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-display font-bold truncate">
              {client.full_name}
            </h1>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
              {client.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {client.phone}
                </span>
              )}
              {client.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {client.email}
                </span>
              )}
              {client.birth_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(parseISO(client.birth_date), "dd/MM/yyyy")} ({age}{" "}
                  anos)
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 shrink-0">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats?.atendidos ?? 0}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Atendidos
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats?.faltas ?? 0}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Faltas
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats?.cancelados ?? 0}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Cancelados
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-auto px-8 py-4">
        <Tabs defaultValue="anamnese" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="anamnese">
              Anamnese, Ficha e Contrato
            </TabsTrigger>
            <TabsTrigger value="historico">Hist. Agendamento</TabsTrigger>
          </TabsList>

          <TabsContent value="resumo">
            <div className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-2 gap-4">
                {client.cpf && (
                  <div>
                    <p className="text-xs text-muted-foreground">CPF</p>
                    <p className="text-sm font-medium">{client.cpf}</p>
                  </div>
                )}
                {client.phone2 && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Telefone 2
                    </p>
                    <p className="text-sm font-medium">{client.phone2}</p>
                  </div>
                )}
              </div>
              {client.notes && (
                <div>
                  <p className="text-xs text-muted-foreground">Observações</p>
                  <p className="text-sm mt-0.5 whitespace-pre-wrap">
                    {client.notes}
                  </p>
                </div>
              )}
              {!client.cpf && !client.phone2 && !client.notes && (
                <p className="text-sm text-muted-foreground py-4">
                  Nenhuma informação adicional cadastrada.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="anamnese">
            <AnamneseTab clientId={client.id} clientName={client.full_name} />
          </TabsContent>

          <TabsContent value="historico">
            <p className="text-sm text-muted-foreground py-4">
              Em breve: histórico de agendamentos deste cliente.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDetailPage;
