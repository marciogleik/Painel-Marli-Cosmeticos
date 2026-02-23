import { useState, useMemo } from "react";
import { professionals, sampleAppointments, Appointment } from "@/data/clinic";
import { cn } from "@/lib/utils";
import { format, addDays, subDays, isToday, startOfWeek, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Search, Phone, Clock, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const statusColors: Record<Appointment['status'], string> = {
  confirmed: 'bg-emerald-400 border-emerald-500',
  pending: 'bg-amber-400 border-amber-500',
  cancelled: 'bg-gray-300 border-gray-400 opacity-60',
  inprogress: 'bg-sky-400 border-sky-500',
  completed: 'bg-violet-400 border-violet-500',
};

const statusLabels: Record<Appointment['status'], string> = {
  confirmed: 'Confirmado',
  pending: 'Pendente',
  cancelled: 'Cancelado',
  inprogress: 'Em atendimento',
  completed: 'Concluído',
};

type ViewMode = 'day' | 'week';

const AgendaCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>(
    professionals.map(p => p.id)
  );
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const hours = Array.from({ length: 22 }, (_, i) => {
    const h = Math.floor(i / 2) + 8;
    const m = (i % 2) * 30;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  });

  const visibleProfessionals = professionals.filter(p => selectedProfessionals.includes(p.id));

  const toggleProfessional = (id: string) => {
    setSelectedProfessionals(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const dateStr = format(currentDate, 'yyyy-MM-dd');

  const getAppointmentsForProfessional = (profId: string) => {
    return sampleAppointments.filter(
      a => a.professionalId === profId && a.date === dateStr
    );
  };

  const getAppointmentPosition = (appt: Appointment) => {
    const [h, m] = appt.time.split(':').map(Number);
    const startMinutes = (h - 8) * 60 + m;
    const totalDuration = appt.services.reduce((sum, s) => sum + s.duration, 0);
    const top = (startMinutes / 30) * 48; // 48px per 30min slot
    const height = Math.max((totalDuration / 30) * 48, 48);
    return { top, height };
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setCurrentDate(subDays(currentDate, 1))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              isToday(currentDate) ? "bg-secondary text-secondary-foreground" : "hover:bg-muted text-muted-foreground"
            )}
          >
            Hoje
          </button>
          <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addDays(currentDate, 1))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <h2 className="text-base font-semibold capitalize ml-2">
            {format(currentDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex border border-border rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('day')}
              className={cn("px-3 py-1.5 text-xs font-medium", viewMode === 'day' ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
            >
              Dia
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={cn("px-3 py-1.5 text-xs font-medium", viewMode === 'week' ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
            >
              Semana
            </button>
          </div>
        </div>
      </div>

      {/* Professional Filter */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-surface-warm overflow-x-auto shrink-0">
        <span className="text-xs text-muted-foreground shrink-0 font-medium">Profissionais:</span>
        {professionals.map(p => (
          <button
            key={p.id}
            onClick={() => toggleProfessional(p.id)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all shrink-0",
              selectedProfessionals.includes(p.id)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-muted-foreground border-border hover:border-primary/50"
            )}
          >
            <div className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold",
              selectedProfessionals.includes(p.id) ? "bg-primary-foreground/20" : "bg-muted"
            )}>
              {p.avatar.charAt(0)}
            </div>
            {p.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Calendar Grid - Simples Agenda style: columns = professionals, rows = time */}
      <div className="flex-1 overflow-auto">
        <div className="flex min-w-[700px]">
          {/* Time column */}
          <div className="w-16 shrink-0 border-r border-border bg-muted/30">
            <div className="h-10 border-b border-border" /> {/* header spacer */}
            {hours.map(time => (
              <div key={time} className="h-12 flex items-start justify-end pr-2 pt-0.5 border-b border-border/50">
                <span className="text-[10px] text-muted-foreground font-medium">{time}</span>
              </div>
            ))}
          </div>

          {/* Professional columns */}
          {visibleProfessionals.map(prof => {
            const appts = getAppointmentsForProfessional(prof.id);
            return (
              <div key={prof.id} className="flex-1 min-w-[160px] border-r border-border last:border-r-0">
                {/* Prof header */}
                <div className="h-10 flex items-center justify-center border-b border-border bg-card px-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full gold-gradient flex items-center justify-center text-[9px] font-bold text-primary">
                      {prof.avatar}
                    </div>
                    <span className="text-xs font-semibold truncate">{prof.name.split(' ')[0]}</span>
                  </div>
                </div>

                {/* Time grid with appointments */}
                <div className="relative">
                  {hours.map(time => (
                    <div
                      key={time}
                      className="h-12 border-b border-border/30 hover:bg-accent/30 transition-colors cursor-pointer"
                    />
                  ))}

                  {/* Appointments overlay */}
                  {appts.map(appt => {
                    const { top, height } = getAppointmentPosition(appt);
                    return (
                      <motion.div
                        key={appt.id}
                        layoutId={appt.id}
                        onClick={() => setSelectedAppointment(appt)}
                        className={cn(
                          "absolute left-1 right-1 rounded-md border-l-4 px-2 py-1 cursor-pointer shadow-sm hover:shadow-md transition-shadow overflow-hidden",
                          statusColors[appt.status],
                          appt.status === 'cancelled' && 'line-through'
                        )}
                        style={{ top: `${top}px`, height: `${height}px` }}
                      >
                        <p className="text-[10px] font-bold text-primary truncate">{appt.clientName}</p>
                        <p className="text-[9px] text-primary/70 truncate">{appt.services.map(s => s.name).join(', ')}</p>
                        <p className="text-[9px] text-primary/60">{appt.time}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Appointment Detail Modal */}
      <AnimatePresence>
        {selectedAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAppointment(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card rounded-xl shadow-2xl w-full max-w-md p-6 border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold">Detalhes do Agendamento</h3>
                <button onClick={() => setSelectedAppointment(null)} className="p-1 hover:bg-muted rounded-md">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gold" />
                  <div>
                    <p className="font-semibold">{selectedAppointment.clientName}</p>
                    <p className="text-muted-foreground text-xs">{selectedAppointment.clientPhone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gold" />
                  <span>{selectedAppointment.time} — {selectedAppointment.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gold" />
                  <span>{professionals.find(p => p.id === selectedAppointment.professionalId)?.name}</span>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground mb-1">Serviços:</p>
                  {selectedAppointment.services.map(s => (
                    <div key={s.id} className="flex justify-between py-1">
                      <span>{s.name}</span>
                      <span className="text-gold font-medium">R$ {s.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium text-primary",
                    statusColors[selectedAppointment.status]
                  )}>
                    {statusLabels[selectedAppointment.status]}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button variant="gold" size="sm" className="flex-1">Confirmar</Button>
                <Button variant="outline" size="sm" className="flex-1">Reagendar</Button>
                <Button variant="ghost" size="sm" className="text-destructive">Cancelar</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-border bg-card shrink-0 overflow-x-auto">
        {Object.entries(statusLabels).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5 shrink-0">
            <div className={cn("w-3 h-3 rounded-sm", statusColors[key as Appointment['status']])} />
            <span className="text-[10px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgendaCalendar;
