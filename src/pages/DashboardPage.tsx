import { useProfessionals, useAppointments, statusConfig } from "@/hooks/useClinicData";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Clock, User, Cake } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const DashboardPage = () => {
  const { user } = useAuth();
  const today = format(new Date(), "yyyy-MM-dd");
  const todayMMDD = format(new Date(), "MM-dd");
  const { data: professionals = [] } = useProfessionals();
  const { data: appointments = [] } = useAppointments(today, today);

  // Fetch current user's profile name
  const { data: profile } = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Check if user is gestor
  const { data: isGestor } = useQuery({
    queryKey: ["my-role-gestor", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "gestor",
      });
      if (error) throw error;
      return !!data;
    },
    enabled: !!user?.id,
  });

  const { data: birthdays = [] } = useQuery({
    queryKey: ["birthdays-today", todayMMDD],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id, full_name, phone, birth_date")
        .not("birth_date", "is", null)
        .eq("is_active", true);
      if (error) throw error;
      return (data || []).filter((c) => {
        if (!c.birth_date) return false;
        return c.birth_date.slice(5) === todayMMDD;
      });
    },
  });

  const todayAppointments = appointments.filter((a) => a.date === today);
  const confirmed = todayAppointments.filter((a) => a.status === "confirmado").length;
  const pending = todayAppointments.filter((a) => a.status === "agendado").length;

  const displayName = profile?.full_name || user?.email || "Profissional";
  const firstName = displayName.split(" ")[0];

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <div className="px-8 pt-8 pb-2">
        <h1 className="text-2xl font-display font-bold">
          Olá, {displayName}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          {" · "}Esses são seus resumos de hoje.
        </p>
      </div>

      <div className="mx-8 h-[1.5px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="px-8 py-6 space-y-6">
        {/* Quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-border/60 bg-card">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xl font-semibold">{todayAppointments.length}</p>
                <p className="text-[11px] text-muted-foreground tracking-wide uppercase">Agendamentos</p>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-xl border border-border/60 bg-card">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-accent flex items-center justify-center">
                <Clock className="w-4 h-4 text-accent-foreground" />
              </div>
              <div>
                <p className="text-xl font-semibold">{confirmed}</p>
                <p className="text-[11px] text-muted-foreground tracking-wide uppercase">Confirmados</p>
              </div>
            </div>
          </div>
          <div className="p-5 rounded-xl border border-border/60 bg-card">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-secondary flex items-center justify-center">
                <Clock className="w-4 h-4 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-xl font-semibold">{pending}</p>
                <p className="text-[11px] text-muted-foreground tracking-wide uppercase">Pendentes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Agenda de Hoje */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg">Agenda de Hoje</h2>
              <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                {todayAppointments.length} agendamento{todayAppointments.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-3">
              {todayAppointments.map((appt) => {
                const prof = professionals.find((p) => p.id === appt.professional_id);
                const cfg = statusConfig[appt.status as keyof typeof statusConfig] || statusConfig.agendado;

                return (
                  <div
                    key={appt.id}
                    className={cn(
                      "p-4 rounded-lg border bg-background",
                      appt.status === "cancelado" && "opacity-50"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="font-semibold">{appt.start_time?.slice(0, 5)}</span>
                          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium border", cfg.bgClass)}>
                            {cfg.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <User className="w-3 h-3" />
                          <span>{appt.client_name}</span>
                          {isGestor && prof && (
                            <span className="ml-1">· com {prof.name}</span>
                          )}
                        </div>
                        {appt.notes && (
                          <p className="text-[10px] text-muted-foreground italic">{appt.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {todayAppointments.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhum agendamento para hoje.
                </p>
              )}
            </div>
          </div>

          {/* Aniversariantes */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Cake className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Aniversariantes de Hoje</p>
                <p className="text-[10px] text-muted-foreground">
                  {birthdays.length > 0
                    ? `${birthdays.length} aniversariante${birthdays.length > 1 ? "s" : ""}`
                    : "Nenhum hoje"}
                </p>
              </div>
            </div>
            {birthdays.length > 0 ? (
              <div className="space-y-3">
                {birthdays.map((client) => {
                  const year = client.birth_date
                    ? new Date().getFullYear() - parseInt(client.birth_date.slice(0, 4))
                    : null;
                  return (
                    <div key={client.id} className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Cake className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{client.full_name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {year ? `${year} anos` : ""}
                          {client.phone ? ` · ${client.phone}` : ""}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-3">
                Nenhum aniversariante hoje
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
