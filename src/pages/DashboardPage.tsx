import { sampleAppointments, professionals, Appointment, statusConfig } from "@/data/clinic";
import { Calendar, Users, DollarSign, UserPlus, Clock, MoreVertical, User, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Agendamentos Hoje", value: "9", sub: "1 confirmado", icon: Calendar, accent: false },
  { label: "Clientes Ativos", value: "1.800+", sub: "Base exportada", icon: Users, accent: false },
  { label: "Receita do Mês", value: "R$ 12.450,00", sub: "+8% vs mês anterior", icon: DollarSign, accent: true },
  { label: "Novos Clientes", value: "8", sub: "Este mês", icon: UserPlus, accent: false },
];

const DashboardPage = () => {
  const todayAppointments = sampleAppointments.filter(a => a.date === '2026-02-23');

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="px-8 pt-8 pb-4">
        <h1 className="text-2xl font-display font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Bem-vinda de volta! Aqui está o resumo do seu dia.</p>
      </div>

      <div className="px-8 pb-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(stat => (
            <div
              key={stat.label}
              className={cn(
                "p-5 rounded-xl border",
                stat.accent ? "bg-primary/5 border-primary/20" : "bg-card border-border"
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center",
                  stat.accent ? "bg-primary/10" : "bg-secondary"
                )}>
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
              {stat.sub && <p className="text-xs text-primary mt-0.5">{stat.sub}</p>}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Agenda de Hoje */}
          <div className="lg:col-span-2 bg-primary/5 rounded-xl border border-primary/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h2 className="font-display font-bold text-lg">Agenda de Hoje</h2>
                  <p className="text-xs text-muted-foreground">domingo, 23 de fevereiro</p>
                </div>
              </div>
              <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                {todayAppointments.length} agendamentos
              </span>
            </div>

            <div className="space-y-3">
              {todayAppointments.map(appt => {
                const prof = professionals.find(p => p.id === appt.professionalId);
                const cfg = statusConfig[appt.status];

                return (
                  <div key={appt.id} className={cn(
                    "p-4 rounded-lg border bg-card",
                    appt.status === 'cancelado' && 'opacity-50'
                  )}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="font-semibold">{appt.time}</span>
                        </div>
                        <p className="font-medium mt-1.5">{appt.serviceNames.join(' + ')}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                          <User className="w-3 h-3" />
                          <span>{appt.clientName}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs text-muted-foreground">com {prof?.name}</span>
                          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium border", cfg.bgClass)}>
                            {cfg.label}
                          </span>
                        </div>
                        {appt.notes && (
                          <p className="text-[10px] text-muted-foreground mt-1 italic">📝 {appt.notes}</p>
                        )}
                      </div>
                      <button className="p-1 hover:bg-muted rounded-md">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                  <span className="text-sm">📋</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Ações Pendentes</p>
                  <p className="text-[10px] text-muted-foreground">Requer atenção</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Confirmações pendentes</span>
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Mensagens não lidas</span>
                  <span className="text-xs font-bold text-primary">5</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                  <span className="text-sm">👩‍⚕️</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Profissionais</p>
                  <p className="text-[10px] text-muted-foreground">Equipe completa</p>
                </div>
              </div>
              <div className="space-y-3">
                {professionals.map(prof => (
                  <div key={prof.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        {prof.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{prof.name}</p>
                        <p className="text-[10px] text-muted-foreground">{prof.role}</p>
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-5">
              <p className="font-semibold text-sm mb-3">Informações</p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>Av. Planalto, 399 – Centro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>(66) 99634-2599</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary">📸</span>
                  <span>@marlicosmeticos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
