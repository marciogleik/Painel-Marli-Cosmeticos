import { useState } from "react";
import { useProfessionals, useAppointments, statusConfig, DBAppointment } from "@/hooks/useClinicData";
import { cn } from "@/lib/utils";
import { format, addDays, startOfWeek, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Calendar, Check, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewAppointmentDialog from "@/components/NewAppointmentDialog";
import AppointmentDetailDialog from "@/components/AppointmentDetailDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AgendaPage = () => {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<DBAppointment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 15 }, (_, i) => `${(i + 7).toString().padStart(2, '0')}:00`);

  const dateFrom = format(weekStart, 'yyyy-MM-dd');
  const dateTo = format(addDays(weekStart, 6), 'yyyy-MM-dd');

  const { data: professionals = [] } = useProfessionals();
  const { data: appointments = [] } = useAppointments(dateFrom, dateTo);

  // Fetch appointment services for all visible appointments
  const appointmentIds = appointments.map(a => a.id);
  const { data: appointmentServices = [] } = useQuery({
    queryKey: ["appointment_services", dateFrom, dateTo],
    queryFn: async () => {
      if (appointmentIds.length === 0) return [];
      const { data, error } = await supabase
        .from("appointment_services")
        .select("appointment_id, service_name")
        .in("appointment_id", appointmentIds);
      if (error) throw error;
      return data ?? [];
    },
    enabled: appointmentIds.length > 0,
  });

  const getServiceNames = (appointmentId: string): string => {
    const services = appointmentServices.filter(s => s.appointment_id === appointmentId);
    if (services.length === 0) return "";
    return services.map(s => s.service_name).join(", ");
  };

  const getAppts = (dayStr: string) => {
    return appointments.filter(a => {
      const matchDay = a.date === dayStr;
      const matchProf = selectedFilter === 'all' || a.professional_id === selectedFilter;
      return matchDay && matchProf;
    });
  };

  const getPosition = (appt: DBAppointment) => {
    const timeParts = appt.start_time.split(':').map(Number);
    const endParts = appt.end_time.split(':').map(Number);
    const startMinutes = timeParts[0] * 60 + timeParts[1];
    const endMinutes = endParts[0] * 60 + endParts[1];
    const duration = endMinutes - startMinutes;

    const top = (timeParts[0] - 7) * 64 + (timeParts[1] / 60) * 64;
    const height = Math.max((duration / 60) * 64, 40);
    return { top, height };
  };

  const getStatusIcon = (status: string) => {
    if (status === 'confirmado') return <Check className="w-3 h-3 shrink-0" />;
    if (status === 'cancelado') return <XIcon className="w-3 h-3 shrink-0" />;
    return null;
  };

  const weekLabel = `${format(weekStart, "dd", { locale: ptBR })} de ${format(weekStart, "MMM.", { locale: ptBR })} - ${format(addDays(weekStart, 6), "dd", { locale: ptBR })} de ${format(addDays(weekStart, 6), "MMM.", { locale: ptBR })} de ${format(weekStart, "yyyy")}`;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-8 pt-8 pb-2 shrink-0">
        <div>
          <h1 className="text-2xl font-display font-bold">Agenda</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gerencie seus agendamentos e horários</p>
        </div>
        <Button className="gap-1.5" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4" /> Novo Agendamento
        </Button>
      </div>

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

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setSelectedFilter('all')}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0",
              selectedFilter === 'all' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
            )}
          >
            Todos
          </button>
          {professionals.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedFilter(p.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0",
                selectedFilter === p.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
              )}
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Status legend */}
      <div className="flex items-center gap-4 px-8 pb-3 shrink-0">
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={cn("w-3 h-3 rounded-sm", cfg.color)} />
            <span className="text-[11px] text-muted-foreground">{cfg.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto mx-8 mb-4 border border-border rounded-lg">
        <div className="flex min-w-[900px]">
          <div className="w-16 shrink-0 border-r border-border">
            <div className="h-12" />
            {hours.map(time => (
              <div key={time} className="h-16 flex items-start justify-end pr-2 pt-1 border-t border-border/50">
                <span className="text-[10px] text-muted-foreground font-medium">{time}</span>
              </div>
            ))}
          </div>

          {days.map(day => {
            const dayStr = format(day, 'yyyy-MM-dd');
            const dayAppts = getAppts(dayStr);
            const today = isToday(day);
            const dayAbbr = format(day, 'EEE.', { locale: ptBR }).toUpperCase();

            return (
              <div key={dayStr} className="flex-1 min-w-[120px] border-r border-border last:border-r-0">
                <div className="h-12 flex flex-col items-center justify-center border-b border-border bg-muted/30">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{dayAbbr}</span>
                  <span className={cn("text-sm font-bold", today ? "text-primary" : "text-foreground")}>{format(day, 'd')}</span>
                </div>
                <div className="relative">
                  {hours.map(time => (
                    <div key={time} className="h-16 border-t border-border/30 hover:bg-accent/30 transition-colors cursor-pointer" />
                  ))}
                  {dayAppts.map(appt => {
                    const { top, height } = getPosition(appt);
                    const cfg = statusConfig[appt.status as keyof typeof statusConfig] || statusConfig.agendado;
                    const isCancelled = appt.status === 'cancelado';
                    const prof = professionals.find(p => p.id === appt.professional_id);
                    const serviceName = getServiceNames(appt.id);
                    const timeRange = `${appt.start_time?.slice(0, 5)} - ${appt.end_time?.slice(0, 5)}`;
                    const isCompact = height < 56;

                    return (
                      <div
                        key={appt.id}
                        className={cn(
                          "absolute left-1 right-1 rounded-md cursor-pointer shadow-sm hover:shadow-md transition-shadow overflow-hidden border-l-[3px]",
                          cfg.color.replace('bg-', 'border-l-'),
                          isCancelled ? "opacity-60" : "",
                        )}
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          backgroundColor: isCancelled ? 'hsl(var(--muted))' : undefined,
                        }}
                        onClick={() => { setSelectedAppointment(appt); setDetailOpen(true); }}
                      >
                        <div
                          className={cn(
                            "h-full px-2 py-1 flex flex-col justify-start",
                            !isCancelled && cfg.color.replace('bg-', 'bg-') + '/15',
                          )}
                          style={!isCancelled ? { backgroundColor: `color-mix(in srgb, ${getStatusBg(appt.status)} 20%, white)` } : undefined}
                        >
                          {isCompact ? (
                            <div className="flex items-center gap-1">
                              {getStatusIcon(appt.status)}
                              <span className={cn("text-[10px] font-bold truncate", isCancelled && "line-through")}>
                                {appt.client_name}
                              </span>
                              <span className="text-[9px] opacity-70 shrink-0">{appt.start_time?.slice(0, 5)}</span>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-semibold text-foreground/70">{timeRange}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(appt.status)}
                                <span className={cn("text-[11px] font-bold truncate text-foreground", isCancelled && "line-through")}>
                                  {appt.client_name}
                                </span>
                              </div>
                              {serviceName && (
                                <p className="text-[10px] text-foreground/60 truncate">{serviceName}</p>
                              )}
                              {selectedFilter === 'all' && prof && height >= 72 && (
                                <p className="text-[9px] text-foreground/50 truncate">({prof.name.split(' ')[0]})</p>
                              )}
                              {height >= 80 && (
                                <span className={cn("text-[9px] font-medium mt-auto", isCancelled ? "text-rose-500" : "text-foreground/50")}>
                                  {cfg.label}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <NewAppointmentDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <AppointmentDetailDialog
        appointment={selectedAppointment}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
};

function getStatusBg(status: string): string {
  const map: Record<string, string> = {
    agendado: '#22c55e',
    confirmado: '#3b82f6',
    cancelado: '#fb7185',
    atendido: '#f97316',
    espera: '#fbbf24',
  };
  return map[status] || '#22c55e';
}

export default AgendaPage;
