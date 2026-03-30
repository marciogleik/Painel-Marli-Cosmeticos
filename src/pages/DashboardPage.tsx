import { useProfessionals, useAppointments, statusConfig, type DBAppointment } from "@/hooks/useClinicData";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Clock, User, Cake, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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


  const getServiceNames = (appt: DBAppointment): string => {
    const services = appt.appointment_services || [];
    if (services.length === 0) return "";
    return services.map((s) => s.service_name).join(", ");
  };

  const todayAppointments = appointments.filter((a) => a.date === today);
  const confirmed = todayAppointments.filter((a) => a.status === "confirmado").length;
  const pending = todayAppointments.filter((a) => a.status === "agendado").length;

  const displayName = profile?.full_name || user?.email || "Profissional";
  const firstName = displayName.split(" ")[0];

  return (
    <div className="flex flex-col h-full overflow-auto bg-transparent">
      {/* Header Hub Style */}
      <div className="px-4 sm:px-8 pt-8 sm:pt-12 pb-6 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs font-black tracking-[0.3em] text-primary uppercase">Painel de Controle</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tighter text-foreground uppercase leading-none">
          Olá, {firstName}
        </h1>
        <p className="text-muted-foreground font-medium max-w-md pt-1">
          {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
          <span className="hidden sm:inline text-primary/50"> • </span>
          Sua clínica em um relance rápido.
        </p>
      </div>

      <div className="px-4 sm:px-8 py-4 sm:py-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Quick stats Glass cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-6 rounded-[2rem] border border-white/10 bg-background/40 backdrop-blur-md shadow-2xl ring-1 ring-white/5 transition-all hover:ring-primary/30 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary transition-all duration-500">
                <Calendar className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <div className="min-w-0">
                <p className="text-3xl font-display font-black leading-none mb-1 group-hover:text-primary transition-colors">{todayAppointments.length}</p>
                <p className="text-[10px] text-muted-foreground font-black tracking-[0.2em] uppercase truncate opacity-60">Agenda</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-[2rem] border border-white/10 bg-background/40 backdrop-blur-md shadow-2xl ring-1 ring-white/5 transition-all hover:ring-emerald-500/30 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500 transition-all duration-500">
                <Clock className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <div className="min-w-0">
                <p className="text-3xl font-display font-black leading-none mb-1 group-hover:text-emerald-600 transition-colors">{confirmed}</p>
                <p className="text-[10px] text-muted-foreground font-black tracking-[0.2em] uppercase truncate opacity-60">Confirmados</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-[2rem] border border-white/10 bg-background/40 backdrop-blur-md shadow-2xl ring-1 ring-white/5 transition-all hover:ring-amber-500/30 group col-span-2 sm:col-span-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 group-hover:bg-amber-500 transition-all duration-500">
                <Clock className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" />
              </div>
              <div className="min-w-0">
                <p className="text-3xl font-display font-black leading-none mb-1 group-hover:text-amber-600 transition-colors">{pending}</p>
                <p className="text-[10px] text-muted-foreground font-black tracking-[0.2em] uppercase truncate opacity-60">Pendentes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Agenda de Hoje Glass Container */}
          <div className="lg:col-span-2 bg-background/40 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-6 sm:p-8 shadow-2xl ring-1 ring-white/5">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
              <div className="space-y-1">
                <h2 className="font-display font-black text-2xl uppercase tracking-tight">Agenda de Hoje</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Fluxo Operacional</p>
              </div>
              <Badge variant="outline" className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-primary/20 bg-primary/5 rounded-xl">
                {todayAppointments.length} Registros
              </Badge>
            </div>

            <div className="space-y-4">
              {todayAppointments.map((appt) => {
                const prof = professionals.find((p) => p.id === appt.professional_id);
                const cfg = statusConfig[appt.status as keyof typeof statusConfig] || statusConfig.agendado;

                return (
                  <div
                    key={appt.id}
                    className={cn(
                      "p-5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300 group",
                      appt.status === "cancelado" && "opacity-40"
                    )}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-6 flex-1">
                        <div className="text-center shrink-0 min-w-[60px]">
                          <p className="text-xl font-display font-black tracking-tighter text-primary">
                            {appt.start_time?.slice(0, 5)}
                          </p>
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mt-0.5">Início</p>
                        </div>
                        <div className="w-px h-10 bg-white/10 hidden sm:block" />
                        <div className="space-y-1">
                          <p className="text-lg font-display font-black uppercase tracking-tight leading-none group-hover:text-primary transition-colors">
                            {appt.client_name}
                          </p>
                          <div className="flex items-center gap-2">
                             <Badge className={cn("text-[9px] font-black px-2 py-0 rounded-md border-none uppercase tracking-tighter", cfg.bgClass)}>
                                {cfg.label}
                             </Badge>
                             <span className="text-[11px] font-bold text-primary/70">
                                {getServiceNames(appt) || "Sem serviço"}
                             </span>
                          </div>
                        </div>
                      </div>
                      
                      {isGestor && prof && (
                        <div className="hidden sm:flex flex-col items-end gap-1 px-4 py-2 bg-black/5 rounded-xl border border-white/5">
                          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Profissional</span>
                          <div className="flex items-center gap-1.5">
                            <UserCog className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-tighter">{prof.name}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {todayAppointments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <Calendar className="w-12 h-12 mb-4 opacity-10" />
                  <p className="font-display font-black text-lg uppercase tracking-tight">Nenhum agendamento hoje</p>
                  <p className="text-xs opacity-50 font-medium">Sua agenda está livre por enquanto.</p>
                </div>
              )}
            </div>
          </div>

          {/* Aniversariantes Glass Container */}
          <div className="bg-background/40 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-6 sm:p-8 shadow-2xl ring-1 ring-white/5 h-fit">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner border border-primary/20">
                <Cake className="w-7 h-7 text-primary" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-display font-black text-xl uppercase tracking-tight">Parabéns!</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                   {birthdays.length} Hoje
                </p>
              </div>
            </div>
            
            {birthdays.length > 0 ? (
              <div className="space-y-4">
                {birthdays.map((client) => {
                  const year = client.birth_date
                    ? new Date().getFullYear() - parseInt(client.birth_date.slice(0, 4))
                    : null;
                  return (
                    <div key={client.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black uppercase tracking-tight truncate">{client.full_name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground/60 flex items-center gap-1.5">
                          {year ? <span className="text-primary">{year} anos</span> : ""}
                          {client.phone && <span>• {client.phone}</span>}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center mx-auto opacity-20">
                    <Cake className="w-6 h-6" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                  Nenhum aniversariante hoje
                </p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/5">
                <button 
                  onClick={() => navigate("/agenda?view=month")}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                >
                    Ver Calendário Mensal
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
