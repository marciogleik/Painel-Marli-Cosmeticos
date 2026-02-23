import { sampleAppointments, professionals, Appointment } from "@/data/clinic";
import { Calendar, Users, DollarSign, UserPlus, Clock, MoreVertical, User } from "lucide-react";
import { cn } from "@/lib/utils";

const statusStyles: Record<Appointment['status'], { bg: string; text: string; label: string }> = {
  confirmed: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-600', label: 'Confirmado' },
  pending: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-600', label: 'Pendente' },
  cancelled: { bg: 'bg-muted border-border', text: 'text-muted-foreground', label: 'Cancelado' },
  inprogress: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-600', label: 'Em atendimento' },
  completed: { bg: 'bg-violet-50 border-violet-200', text: 'text-violet-600', label: 'Concluído' },
};

const stats = [
  { label: "Agendamentos Hoje", value: "6", sub: "6 confirmados", icon: Calendar, accent: false },
  { label: "Clientes Ativos", value: "156", sub: "", icon: Users, accent: false },
  { label: "Receita do Mês", value: "R$ 12.450,00", sub: "+8% vs mês anterior", icon: DollarSign, accent: true },
  { label: "Novos Clientes", value: "8", sub: "Este mês", icon: UserPlus, accent: false },
];

const DashboardPage = () => {
  const todayAppointments = sampleAppointments.filter(a => a.date === '2026-02-23');

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <div className="px-8 pt-8 pb-4">
        <h1 className="text-2xl font-display font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Bem-vinda de volta! Aqui está o resumo do seu dia.</p>
      </div>

      <div className="px-8 pb-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(stat => (
            <div
              key={stat.label}
              className={cn(
                "p-5 rounded-xl border",
                stat.accent ? "bg-emerald-50 border-emerald-100" : "bg-card border-border"
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center",
                  stat.accent ? "bg-emerald-100" : "bg-secondary"
                )}>
                  <stat.icon className={cn("w-4 h-4", stat.accent ? "text-emerald-600" : "text-primary")} />
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
              {stat.sub && <p className="text-xs text-emerald-600 mt-0.5">{stat.sub}</p>}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Agenda de Hoje */}
          <div className="lg:col-span-2 bg-emerald-50/50 rounded-xl border border-emerald-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h2 className="font-display font-bold text-lg">Agenda de Hoje</h2>
                  <p className="text-xs text-muted-foreground">segunda-feira, 23 de fevereiro</p>
                </div>
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                {todayAppointments.length} agendamentos
              </span>
            </div>

            <div className="space-y-3">
              {todayAppointments.map(appt => {
                const prof = professionals.find(p => p.id === appt.professionalId);
                const style = statusStyles[appt.status];
                const totalDuration = appt.services.reduce((s, srv) => s + srv.duration, 0);

                return (
                  <div key={appt.id} className={cn("p-4 rounded-lg border bg-card", appt.status === 'cancelled' && 'opacity-50')}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="font-semibold">{appt.time}</span>
                          <span className="text-muted-foreground">({totalDuration} min)</span>
                        </div>
                        <p className="font-medium mt-1.5">{appt.services[0].name}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                          <User className="w-3 h-3" />
                          <span>{appt.clientName}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs text-muted-foreground">com {prof?.name.split(' ')[0]}</span>
                          <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", style.bg, style.text)}>
                            {style.label}
                          </span>
                        </div>
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
            {/* Pending actions */}
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                  <span className="text-primary text-sm">📋</span>
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

            {/* Active professionals */}
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                  <span className="text-primary text-sm">📈</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Profissionais</p>
                  <p className="text-[10px] text-muted-foreground">Ativos hoje</p>
                </div>
              </div>
              <div className="space-y-3">
                {professionals.slice(0, 3).map(prof => (
                  <div key={prof.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        {prof.avatar.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{prof.name.split(' ')[0]} {prof.name.split(' ').pop()}</p>
                        <p className="text-[10px] text-muted-foreground">{prof.role}</p>
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
