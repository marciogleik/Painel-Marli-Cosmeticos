import { useState, useMemo } from "react";
import { professionals, sampleAppointments, Appointment } from "@/data/clinic";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock, Phone, User } from "lucide-react";

const statusLabels: Record<Appointment['status'], string> = {
  confirmed: 'Confirmado',
  pending: 'Pendente',
  cancelled: 'Cancelado',
  inprogress: 'Em andamento',
  completed: 'Concluído',
};

const statusStyles: Record<Appointment['status'], string> = {
  confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  cancelled: 'bg-gray-100 text-gray-400 border-gray-200 line-through',
  inprogress: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
};

const DashboardPage = () => {
  const [selectedProfId, setSelectedProfId] = useState<string | 'all'>('all');
  const [currentDate, setCurrentDate] = useState(new Date());

  const filteredAppointments = useMemo(() => {
    return sampleAppointments.filter(a => {
      const matchProf = selectedProfId === 'all' || a.professionalId === selectedProfId;
      const matchDate = a.date === format(currentDate, 'yyyy-MM-dd');
      return matchProf && matchDate;
    });
  }, [selectedProfId, currentDate]);

  const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8:00 - 18:00

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Professionals */}
          <aside className="lg:w-64 shrink-0">
            <h2 className="text-lg font-display font-bold mb-4">Profissionais</h2>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedProfId('all')}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  selectedProfId === 'all'
                    ? "bg-gold/10 text-gold border border-gold/20"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                Todas
              </button>
              {professionals.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProfId(p.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                    selectedProfId === p.id
                      ? "bg-gold/10 text-gold border border-gold/20"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                    selectedProfId === p.id ? "gold-gradient text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {p.avatar}
                  </div>
                  <span className="truncate">{p.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-6 p-4 rounded-lg bg-surface-warm border border-border">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Hoje</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-2xl font-bold text-foreground">{filteredAppointments.filter(a => a.status !== 'cancelled').length}</p>
                  <p className="text-[10px] text-muted-foreground">Agendamentos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gold">
                    {filteredAppointments.filter(a => a.status === 'cancelled').length}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Cancelados</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Calendar */}
          <div className="flex-1 min-w-0">
            {/* Date nav */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setCurrentDate(addDays(currentDate, -1))} className="p-2 rounded-md hover:bg-muted">
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <h2 className="text-lg font-display font-bold capitalize">
                {format(currentDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </h2>
              <button onClick={() => setCurrentDate(addDays(currentDate, 1))} className="p-2 rounded-md hover:bg-muted">
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Timeline */}
            <div className="border border-border rounded-lg overflow-hidden">
              {hours.map(hour => {
                const hourStr = `${hour.toString().padStart(2, '0')}`;
                const hourAppts = filteredAppointments.filter(a => a.time.startsWith(hourStr));

                return (
                  <div key={hour} className="flex border-b border-border last:border-b-0 min-h-[64px]">
                    <div className="w-16 shrink-0 py-3 px-2 text-xs font-medium text-muted-foreground bg-muted/30 text-right border-r border-border">
                      {hourStr}:00
                    </div>
                    <div className="flex-1 p-2 flex flex-wrap gap-2">
                      {hourAppts.map(appt => {
                        const prof = professionals.find(p => p.id === appt.professionalId);
                        return (
                          <div
                            key={appt.id}
                            className={cn(
                              "flex-1 min-w-[200px] p-3 rounded-md border text-sm",
                              statusStyles[appt.status]
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">{appt.clientName}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full border font-medium">
                                {statusLabels[appt.status]}
                              </span>
                            </div>
                            <div className="mt-1.5 flex items-center gap-3 text-xs opacity-80">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {appt.time}</span>
                              <span className="flex items-center gap-1"><User className="w-3 h-3" /> {prof?.name.split(' ')[0]}</span>
                            </div>
                            <p className="text-xs mt-1 opacity-70">{appt.services.map(s => s.name).join(', ')}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
