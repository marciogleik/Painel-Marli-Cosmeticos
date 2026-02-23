import { useState, useMemo } from "react";
import { professionals, sampleAppointments, Appointment } from "@/data/clinic";
import { cn } from "@/lib/utils";
import { format, addDays, startOfWeek, isSameDay, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const statusColors: Record<Appointment['status'], string> = {
  confirmed: 'bg-emerald-400',
  pending: 'bg-amber-400',
  cancelled: 'bg-rose-300 opacity-60 line-through',
  inprogress: 'bg-sky-400',
  completed: 'bg-violet-400',
};

const AgendaPage = () => {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 11 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);

  const getAppts = (dayStr: string) => {
    return sampleAppointments.filter(a => {
      const matchDay = a.date === dayStr;
      const matchProf = selectedFilter === 'all' || a.professionalId === selectedFilter;
      return matchDay && matchProf;
    });
  };

  const getPosition = (appt: Appointment) => {
    const [h, m] = appt.time.split(':').map(Number);
    const top = (h - 8) * 64 + (m / 60) * 64;
    const duration = appt.services.reduce((s, srv) => s + srv.duration, 0);
    const height = Math.max((duration / 60) * 64, 40);
    return { top, height };
  };

  const weekLabel = `${format(weekStart, "dd", { locale: ptBR })} de ${format(weekStart, "MMM.", { locale: ptBR })} - ${format(addDays(weekStart, 6), "dd", { locale: ptBR })} de ${format(addDays(weekStart, 6), "MMM.", { locale: ptBR })} de ${format(weekStart, "yyyy")}`;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-8 pb-2 shrink-0">
        <div>
          <h1 className="text-2xl font-display font-bold">Agenda</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gerencie seus agendamentos e horários</p>
        </div>
        <Button className="gap-1.5">
          <Plus className="w-4 h-4" /> Novo Agendamento
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-8 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekStart(addDays(weekStart, -7))} className="p-1.5 rounded-md hover:bg-muted">
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="capitalize">{weekLabel}</span>
          </div>
          <button onClick={() => setWeekStart(addDays(weekStart, 7))} className="p-1.5 rounded-md hover:bg-muted">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }))}
            className="ml-2 px-3 py-1 rounded-md border border-border text-xs font-medium hover:bg-muted"
          >
            Hoje
          </button>
        </div>

        {/* Professional filters */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSelectedFilter('all')}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              selectedFilter === 'all' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
            )}
          >
            Todos
          </button>
          {professionals.slice(0, 4).map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedFilter(p.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                selectedFilter === p.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
              )}
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid - Weekly view by day */}
      <div className="flex-1 overflow-auto mx-8 mb-4 border border-border rounded-lg">
        <div className="flex min-w-[800px]">
          {/* Time column */}
          <div className="w-16 shrink-0 border-r border-border">
            <div className="h-12" /> {/* header spacer */}
            {hours.map(time => (
              <div key={time} className="h-16 flex items-start justify-end pr-2 pt-1 border-t border-border/50">
                <span className="text-[10px] text-muted-foreground font-medium">{time}</span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map(day => {
            const dayStr = format(day, 'yyyy-MM-dd');
            const dayAppts = getAppts(dayStr);
            const today = isToday(day);
            const dayAbbr = format(day, 'EEE.', { locale: ptBR }).toUpperCase();
            const dayNum = format(day, 'd');

            return (
              <div key={dayStr} className="flex-1 min-w-[100px] border-r border-border last:border-r-0">
                {/* Day header */}
                <div className="h-12 flex flex-col items-center justify-center border-b border-border bg-muted/30">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{dayAbbr}</span>
                  <span className={cn(
                    "text-sm font-bold",
                    today ? "text-primary" : "text-foreground"
                  )}>{dayNum}</span>
                </div>

                {/* Time grid */}
                <div className="relative">
                  {hours.map(time => (
                    <div key={time} className="h-16 border-t border-border/30 hover:bg-accent/30 transition-colors cursor-pointer" />
                  ))}

                  {/* Appointments */}
                  {dayAppts.map(appt => {
                    const { top, height } = getPosition(appt);
                    const prof = professionals.find(p => p.id === appt.professionalId);
                    return (
                      <div
                        key={appt.id}
                        className={cn(
                          "absolute left-1 right-1 rounded-md px-2 py-1 cursor-pointer shadow-sm hover:shadow-md transition-shadow overflow-hidden text-primary-foreground",
                          statusColors[appt.status]
                        )}
                        style={{ top: `${top}px`, height: `${height}px` }}
                      >
                        <p className="text-[11px] font-semibold truncate">{appt.services[0].name}</p>
                        <p className="text-[10px] opacity-80 truncate">{appt.clientName}</p>
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
  );
};

export default AgendaPage;
