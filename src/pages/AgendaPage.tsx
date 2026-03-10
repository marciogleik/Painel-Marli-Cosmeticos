import { useState, useRef, useCallback, useEffect } from "react";
import { useProfessionals, useAppointments, statusConfig, DBAppointment, WEEKLY_BLOCKS } from "@/hooks/useClinicData";
import { cn } from "@/lib/utils";
import { format, addDays, subDays, startOfWeek, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Calendar, Check, X as XIcon, GripVertical, Ban, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewAppointmentDialog from "@/components/NewAppointmentDialog";
import BlockedSlotDialog from "@/components/BlockedSlotDialog";
import AppointmentDetailDialog from "@/components/AppointmentDetailDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { checkAppointmentConflict } from "@/utils/appointmentConflict";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ViewMode = "week" | "day";

interface DragState {
  appointment: DBAppointment;
  startY: number;
  initialTop: number;
  currentTop: number;
  columnEl: HTMLDivElement | null;
}

interface PendingReschedule {
  appointment: DBAppointment;
  newStartTime: string;
  newEndTime: string;
}

const AgendaPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [selectedDay, setSelectedDay] = useState(() => new Date());
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<DBAppointment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockDefaults, setBlockDefaults] = useState<{ profId?: string; date?: Date; time?: string }>({});

  // Drag state
  const dragRef = useRef<DragState | null>(null);
  const [draggingApptId, setDraggingApptId] = useState<string | null>(null);
  const [dragPreviewTop, setDragPreviewTop] = useState<number>(0);

  // Confirmation dialog
  const [pendingReschedule, setPendingReschedule] = useState<PendingReschedule | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);

  const queryClient = useQueryClient();

  // Realtime subscription
  useEffect(() => {
    const appointmentsChannel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        () => {
          console.log("Realtime update: appointments");
          queryClient.invalidateQueries({ queryKey: ["appointments"] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blocked_slots' },
        () => {
          console.log("Realtime update: blocked_slots");
          queryClient.invalidateQueries({ queryKey: ["blocked_slots"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(appointmentsChannel);
    };
  }, [queryClient]);

  const hours = Array.from({ length: 30 }, (_, i) => {
    const h = Math.floor(i / 2) + 7;
    const m = (i % 2) * 30;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  });

  // Date range for queries
  const dateFrom = viewMode === "week" ? format(weekStart, "yyyy-MM-dd") : format(selectedDay, "yyyy-MM-dd");
  const dateTo = viewMode === "week" ? format(addDays(weekStart, 6), "yyyy-MM-dd") : format(selectedDay, "yyyy-MM-dd");

  const { data: professionals = [] } = useProfessionals();
  const { data: appointments = [] } = useAppointments(dateFrom, dateTo);

  const appointmentIds = appointments.map((a) => a.id);
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
    const services = appointmentServices.filter((s) => s.appointment_id === appointmentId);
    if (services.length === 0) return "";
    return services.map((s) => s.service_name).join(", ");
  };

  // Blocked slots query
  const { data: blockedSlots = [] } = useQuery({
    queryKey: ["blocked_slots", dateFrom, dateTo],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blocked_slots")
        .select("*")
        .gte("date", dateFrom)
        .lte("date", dateTo);
      if (error) throw error;
      return data ?? [];
    },
  });

  const deleteBlockedSlot = async (id: string) => {
    const { error } = await supabase.from("blocked_slots").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao remover bloqueio: " + error.message);
    } else {
      toast.success("Bloqueio removido!");
      queryClient.invalidateQueries({ queryKey: ["blocked_slots"] });
    }
  };

  const getBlockedForColumn = (dayStr: string, profId?: string) => {
    const dynamicBlocks = blockedSlots.filter((b) => {
      const matchDay = b.date === dayStr;
      if (viewMode === "day" && profId) return matchDay && b.professional_id === profId;
      const matchProf = selectedFilter === "all" || b.professional_id === selectedFilter;
      return matchDay && matchProf;
    });

    const weeklyBlocks = WEEKLY_BLOCKS.filter((wb) => {
      if (viewMode === "day" && profId) return wb.professionalId === profId;
      return selectedFilter === "all" || wb.professionalId === selectedFilter;
    }).map(wb => ({
      id: `weekly-${wb.professionalId}-${wb.startTime}`,
      professional_id: wb.professionalId,
      date: dayStr,
      start_time: wb.startTime.length === 5 ? `${wb.startTime}:00` : wb.startTime,
      end_time: wb.endTime.length === 5 ? `${wb.endTime}:00` : wb.endTime,
      reason: wb.reason,
      isWeekly: true
    }));

    return [...dynamicBlocks, ...weeklyBlocks];
  };

  const renderBlockedBlock = (block: any) => {
    const timeParts = block.start_time.split(":").map(Number);
    const endParts = block.end_time.split(":").map(Number);
    const startMinutes = timeParts[0] * 60 + timeParts[1];
    const endMinutes = endParts[0] * 60 + endParts[1];
    const duration = endMinutes - startMinutes;
    const top = (timeParts[0] - 7) * 64 + (timeParts[1] / 60) * 64;
    const height = Math.max((duration / 60) * 64, 32);
    const timeRange = `${block.start_time.slice(0, 5)} - ${block.end_time.slice(0, 5)}`;

    return (
      <div
        key={block.id}
        className={cn(
          "absolute left-1 right-1 rounded-md overflow-hidden border z-10 group cursor-default shadow-sm",
          block.isWeekly
            ? "border-black bg-black text-white"
            : "border-destructive/30 bg-destructive/10 text-destructive"
        )}
        style={{ top: `${top}px`, height: `${height}px` }}
      >
        <div className="h-full px-2 py-1 flex flex-col justify-start relative">
          <div className="flex items-center gap-1">
            <Ban className={cn("w-3 h-3 shrink-0", block.isWeekly ? "text-white/80" : "text-destructive/70")} />
            <span className={cn("text-[10px] font-semibold", block.isWeekly ? "text-white/90" : "text-destructive/70")}>{timeRange}</span>
          </div>
          {height >= 32 && (
            <span className={cn("text-[10px] font-bold leading-tight mt-1 whitespace-pre-wrap", block.isWeekly ? "text-white" : "text-destructive/60")}>
              {block.reason || "Bloqueado"}
            </span>
          )}
          {!block.isWeekly && (
            <button
              onClick={(e) => { e.stopPropagation(); deleteBlockedSlot(block.id); }}
              className="absolute top-1 right-1 p-0.5 rounded hover:bg-destructive/20 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Remover bloqueio"
            >
              <Trash2 className="w-3 h-3 text-destructive" />
            </button>
          )}
        </div>
      </div>
    );
  };

  const getPosition = (appt: DBAppointment) => {
    const timeParts = appt.start_time.split(":").map(Number);
    const endParts = appt.end_time.split(":").map(Number);
    const startMinutes = timeParts[0] * 60 + timeParts[1];
    const endMinutes = endParts[0] * 60 + endParts[1];
    const duration = endMinutes - startMinutes;
    const top = (timeParts[0] - 7) * 64 + (timeParts[1] / 60) * 64;
    const height = Math.max((duration / 60) * 64, 40);
    return { top, height };
  };

  const getStatusIcon = (status: string) => {
    if (status === "confirmado") return <Check className="w-3 h-3 shrink-0" />;
    if (status === "cancelado") return <XIcon className="w-3 h-3 shrink-0" />;
    return null;
  };

  // Ref to prevent detail dialog from opening after drag
  const justDraggedRef = useRef(false);

  // Convert pixel position to time
  const pixelToTime = (px: number): { hours: number; minutes: number } => {
    // Snap to 30-minute intervals
    const totalMinutes = Math.round((px / 64) * 60) + 7 * 60;
    const snapped = Math.round(totalMinutes / 30) * 30;
    const h = Math.floor(snapped / 60);
    const m = snapped % 60;
    return { hours: Math.max(7, Math.min(h, 21)), minutes: m };
  };

  const formatTime = (h: number, m: number) =>
    `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:00`;

  // Drag handlers
  const handleDragStart = useCallback((e: React.MouseEvent, appt: DBAppointment, columnEl: HTMLDivElement | null) => {
    if (appt.status === "cancelado" || appt.status === "falta") return;
    e.preventDefault();
    e.stopPropagation();

    const { top } = getPosition(appt);
    dragRef.current = {
      appointment: appt,
      startY: e.clientY,
      initialTop: top,
      currentTop: top,
      columnEl,
    };
    setDraggingApptId(appt.id);
    setDragPreviewTop(top);

    const handleMouseMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const delta = ev.clientY - dragRef.current.startY;
      const newTop = Math.max(0, dragRef.current.initialTop + delta);
      // Snap to 30-min grid (32px = 30min)
      const snappedTop = Math.round(newTop / 32) * 32;
      dragRef.current.currentTop = snappedTop;
      setDragPreviewTop(snappedTop);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      if (!dragRef.current) return;
      const drag = dragRef.current;

      if (Math.abs(drag.currentTop - drag.initialTop) < 8) {
        // Too small movement, treat as click
        dragRef.current = null;
        setDraggingApptId(null);
        return;
      }

      // Mark as dragged to prevent detail dialog from opening
      justDraggedRef.current = true;
      setTimeout(() => { justDraggedRef.current = false; }, 300);

      // Calculate new times
      const { hours: newStartH, minutes: newStartM } = pixelToTime(drag.currentTop);
      const oldParts = drag.appointment.start_time.split(":").map(Number);
      const endParts = drag.appointment.end_time.split(":").map(Number);
      const durationMin = (endParts[0] * 60 + endParts[1]) - (oldParts[0] * 60 + oldParts[1]);

      const newStartTotalMin = newStartH * 60 + newStartM;
      const newEndTotalMin = newStartTotalMin + durationMin;
      const newEndH = Math.floor(newEndTotalMin / 60);
      const newEndM = newEndTotalMin % 60;

      const newStartTime = formatTime(newStartH, newStartM);
      const newEndTime = formatTime(newEndH, newEndM);

      // Check if time actually changed
      if (newStartTime === drag.appointment.start_time) {
        dragRef.current = null;
        setDraggingApptId(null);
        return;
      }

      setPendingReschedule({
        appointment: drag.appointment,
        newStartTime,
        newEndTime,
      });

      dragRef.current = null;
      setDraggingApptId(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  const handleConfirmReschedule = async () => {
    if (!pendingReschedule) return;
    setIsRescheduling(true);

    const { appointment, newStartTime, newEndTime } = pendingReschedule;

    // Check conflicts
    const conflict = await checkAppointmentConflict({
      professionalId: appointment.professional_id,
      date: appointment.date,
      startTime: newStartTime,
      endTime: newEndTime,
      excludeAppointmentId: appointment.id,
    });

    if (conflict) {
      toast.error(`Conflito de horário com ${conflict}. Escolha outro horário.`);
      setIsRescheduling(false);
      setPendingReschedule(null);
      return;
    }

    const { error } = await supabase
      .from("appointments")
      .update({ start_time: newStartTime, end_time: newEndTime })
      .eq("id", appointment.id);

    if (error) {
      toast.error("Erro ao reagendar: " + error.message);
    } else {
      toast.success("Agendamento reagendado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    }

    setIsRescheduling(false);
    setPendingReschedule(null);
  };

  // Navigation handlers
  const handlePrev = () => {
    if (viewMode === "week") setWeekStart(addDays(weekStart, -7));
    else setSelectedDay(subDays(selectedDay, 1));
  };
  const handleNext = () => {
    if (viewMode === "week") setWeekStart(addDays(weekStart, 7));
    else setSelectedDay(addDays(selectedDay, 1));
  };
  const handleToday = () => {
    if (viewMode === "week") setWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }));
    else setSelectedDay(new Date());
  };

  const dateLabel =
    viewMode === "week"
      ? `${format(weekStart, "dd", { locale: ptBR })} de ${format(weekStart, "MMM.", { locale: ptBR })} - ${format(addDays(weekStart, 6), "dd", { locale: ptBR })} de ${format(addDays(weekStart, 6), "MMM.", { locale: ptBR })} de ${format(weekStart, "yyyy")}`
      : format(selectedDay, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  const days = viewMode === "week" ? Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)) : [selectedDay];

  const filteredProfessionals =
    selectedFilter === "all" ? professionals : professionals.filter((p) => p.id === selectedFilter);

  const getApptsForColumn = (dayStr: string, profId?: string) => {
    return appointments.filter((a) => {
      const matchDay = a.date === dayStr;
      if (viewMode === "day" && profId) return matchDay && a.professional_id === profId;
      const matchProf = selectedFilter === "all" || a.professional_id === selectedFilter;
      return matchDay && matchProf;
    });
  };

  const renderAppointmentBlock = (appt: DBAppointment, showProfName: boolean, columnEl: HTMLDivElement | null) => {
    const { top, height } = getPosition(appt);
    const cfg = statusConfig[appt.status as keyof typeof statusConfig] || statusConfig.agendado;
    const isCancelled = appt.status === "cancelado";
    const isFalta = appt.status === "falta";
    const isDraggable = !isCancelled && !isFalta;
    const isDragging = draggingApptId === appt.id;
    const prof = professionals.find((p) => p.id === appt.professional_id);
    const serviceName = getServiceNames(appt.id);
    const timeRange = `${appt.start_time?.slice(0, 5)} - ${appt.end_time?.slice(0, 5)}`;
    const isCompact = height < 56;

    const displayTop = isDragging ? dragPreviewTop : top;

    return (
      <div
        key={appt.id}
        className={cn(
          "absolute left-1 right-1 rounded-md shadow-sm overflow-hidden border-l-[3px] transition-shadow select-none",
          cfg.color.replace("bg-", "border-l-"),
          isCancelled ? "opacity-60" : "",
          isDraggable ? "cursor-grab hover:shadow-md" : "cursor-pointer",
          isDragging && "opacity-80 shadow-lg ring-2 ring-primary/40 z-50"
        )}
        style={{
          top: `${displayTop}px`,
          height: `${height}px`,
          backgroundColor: isCancelled ? "hsl(var(--muted))" : undefined,
          transition: isDragging ? "none" : "box-shadow 0.15s",
        }}
        onMouseDown={(e) => {
          if (isDraggable) handleDragStart(e, appt, columnEl);
        }}
        onClick={() => {
          if (!draggingApptId && !justDraggedRef.current) {
            setSelectedAppointment(appt);
            setDetailOpen(true);
          }
        }}
      >
        <div
          className="h-full px-2 py-1 flex flex-col justify-start"
          style={!isCancelled ? { backgroundColor: `color-mix(in srgb, ${getStatusBg(appt.status)} 20%, white)` } : undefined}
        >
          {isCompact ? (
            <div className="flex items-center gap-1">
              {isDraggable && <GripVertical className="w-3 h-3 shrink-0 text-muted-foreground/50" />}
              {getStatusIcon(appt.status)}
              <span className={cn("text-[10px] font-bold truncate", isCancelled && "line-through")}>
                {appt.client_name}
              </span>
              <span className="text-[9px] opacity-70 shrink-0">{appt.start_time?.slice(0, 5)}</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1">
                {isDraggable && <GripVertical className="w-3 h-3 shrink-0 text-muted-foreground/50" />}
                <span className="text-[10px] font-semibold text-foreground/70">{timeRange}</span>
              </div>
              <div className="flex items-center gap-1">
                {getStatusIcon(appt.status)}
                <span className={cn("text-[11px] font-bold truncate text-foreground", isCancelled && "line-through")}>
                  {appt.client_name}
                </span>
              </div>
              {serviceName && <p className="text-[10px] text-foreground/60 truncate">{serviceName}</p>}
              {showProfName && prof && height >= 72 && (
                <p className="text-[9px] text-foreground/50 truncate">({prof.name.split(" ")[0]})</p>
              )}
              {height >= 80 && (
                <span className={cn("text-[9px] font-medium mt-auto", isCancelled ? "text-foreground/40" : "text-foreground/50")}>
                  {cfg.label}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // Format time for display in dialog
  const formatTimeDisplay = (time: string) => time.slice(0, 5);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-8 pt-8 pb-2 shrink-0">
        <div>
          <h1 className="text-2xl font-display font-bold">Agenda</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gerencie seus agendamentos e horários</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1.5" onClick={() => { setBlockDefaults({}); setBlockDialogOpen(true); }}>
            <Ban className="w-4 h-4" /> Bloquear Horário
          </Button>
          <Button className="gap-1.5" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4" /> Novo Agendamento
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between px-8 py-3 shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button onClick={handlePrev} className="p-1.5 rounded-md hover:bg-muted">
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="capitalize">{dateLabel}</span>
          </div>
          <button onClick={handleNext} className="p-1.5 rounded-md hover:bg-muted">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button onClick={handleToday} className="ml-2 px-3 py-1 rounded-md border border-border text-xs font-medium hover:bg-muted">
            Hoje
          </button>

          {/* View toggle */}
          <div className="ml-3 flex items-center rounded-full border border-border overflow-hidden">
            <button
              onClick={() => setViewMode("week")}
              className={cn(
                "px-3 py-1 text-xs font-medium transition-colors",
                viewMode === "week" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
              )}
            >
              Semana
            </button>
            <button
              onClick={() => {
                setViewMode("day");
                setSelectedDay(new Date());
              }}
              className={cn(
                "px-3 py-1 text-xs font-medium transition-colors",
                viewMode === "day" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
              )}
            >
              Dia
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setSelectedFilter("all")}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0",
              selectedFilter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
            )}
          >
            Todos
          </button>
          {professionals.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedFilter(p.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0",
                selectedFilter === p.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
              )}
            >
              {p.name.split(" ")[0]}
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
        {viewMode === "week" ? (
          /* ============ WEEK VIEW ============ */
          <div className="flex min-w-[1200px]">
            <div className="w-16 shrink-0 border-r border-border">
              <div className="h-12" />
              {hours.map((time) => {
                const isHalf = time.endsWith(":30");
                return (
                  <div key={time} className={cn("h-8 flex items-start justify-end pr-2 pt-0.5 border-t", isHalf ? "border-border/20" : "border-border/50")}>
                    <span className={cn("text-[10px] font-medium", isHalf ? "text-muted-foreground/50" : "text-muted-foreground")}>{time}</span>
                  </div>
                );
              })}
            </div>

            {days.map((day) => {
              const dayStr = format(day, "yyyy-MM-dd");
              const dayAppts = getApptsForColumn(dayStr);
              const today = isToday(day);
              const dayAbbr = format(day, "EEE.", { locale: ptBR }).toUpperCase();

              return (
                <DayColumn
                  key={dayStr}
                  dayStr={dayStr}
                  dayAbbr={dayAbbr}
                  dayNum={format(day, "d")}
                  isToday={today}
                  hours={hours}
                  appts={dayAppts}
                  blockedBlocks={getBlockedForColumn(dayStr)}
                  renderBlock={(appt, el) => renderAppointmentBlock(appt, selectedFilter === "all", el)}
                  renderBlockedBlock={renderBlockedBlock}
                  onDoubleClick={() => {
                    setSelectedDay(day);
                    setViewMode("day");
                  }}
                />
              );
            })}
          </div>
        ) : (
          /* ============ DAY VIEW ============ */
          <div className="flex" style={{ minWidth: `${Math.max(filteredProfessionals.length * 200 + 80, 800)}px`, width: 'max-content' }}>
            <div className="w-16 shrink-0 border-r border-border">
              <div className="h-12" />
              {hours.map((time) => {
                const isHalf = time.endsWith(":30");
                return (
                  <div key={time} className={cn("h-8 flex items-start justify-end pr-2 pt-0.5 border-t", isHalf ? "border-border/20" : "border-border/50")}>
                    <span className={cn("text-[10px] font-medium", isHalf ? "text-muted-foreground/50" : "text-muted-foreground")}>{time}</span>
                  </div>
                );
              })}
            </div>

            {filteredProfessionals.map((prof) => {
              const dayStr = format(selectedDay, "yyyy-MM-dd");
              const profAppts = getApptsForColumn(dayStr, prof.id);

              return (
                <ProfColumn
                  key={prof.id}
                  profId={prof.id}
                  profName={prof.name}
                  hours={hours}
                  appts={profAppts}
                  blockedBlocks={getBlockedForColumn(dayStr, prof.id)}
                  renderBlock={(appt, el) => renderAppointmentBlock(appt, false, el)}
                  renderBlockedBlock={renderBlockedBlock}
                  onSlotClick={(time) => {
                    setBlockDefaults({ profId: prof.id, date: selectedDay, time });
                    setBlockDialogOpen(true);
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      <NewAppointmentDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BlockedSlotDialog
        open={blockDialogOpen}
        onOpenChange={setBlockDialogOpen}
        defaultProfessionalId={blockDefaults.profId}
        defaultDate={blockDefaults.date}
        defaultStartTime={blockDefaults.time}
      />
      <AppointmentDetailDialog appointment={selectedAppointment} open={detailOpen} onOpenChange={setDetailOpen} />

      {/* Reschedule confirmation dialog */}
      <AlertDialog open={!!pendingReschedule} onOpenChange={(open) => !open && setPendingReschedule(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar reagendamento</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>
                  Deseja mover o agendamento de <strong>{pendingReschedule?.appointment.client_name}</strong> para o novo horário?
                </p>
                <div className="flex items-center gap-3 text-sm">
                  <span className="px-2 py-1 rounded bg-muted font-medium">
                    {pendingReschedule && formatTimeDisplay(pendingReschedule.appointment.start_time)} - {pendingReschedule && formatTimeDisplay(pendingReschedule.appointment.end_time)}
                  </span>
                  <span>→</span>
                  <span className="px-2 py-1 rounded bg-primary/10 text-primary font-medium">
                    {pendingReschedule && formatTimeDisplay(pendingReschedule.newStartTime)} - {pendingReschedule && formatTimeDisplay(pendingReschedule.newEndTime)}
                  </span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRescheduling}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReschedule} disabled={isRescheduling}>
              {isRescheduling ? "Salvando..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Sub-components to hold column refs
function DayColumn({
  dayStr, dayAbbr, dayNum, isToday: today, hours, appts, blockedBlocks, renderBlock, renderBlockedBlock, onDoubleClick,
}: {
  dayStr: string; dayAbbr: string; dayNum: string; isToday: boolean;
  hours: string[]; appts: DBAppointment[];
  blockedBlocks: any[];
  renderBlock: (appt: DBAppointment, el: HTMLDivElement | null) => React.ReactNode;
  renderBlockedBlock: (block: any) => React.ReactNode;
  onDoubleClick: () => void;
}) {
  const colRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className="flex-1 min-w-[160px] border-r border-border last:border-r-0 cursor-pointer"
      onDoubleClick={onDoubleClick}
    >
      <div className="h-12 flex flex-col items-center justify-center border-b border-border bg-muted/30">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{dayAbbr}</span>
        <span className={cn("text-sm font-bold", today ? "text-primary" : "text-foreground")}>{dayNum}</span>
      </div>
      <div className="relative" ref={colRef}>
        {hours.map((time) => (
          <div key={time} className={cn("h-8 border-t hover:bg-accent/30 transition-colors", time.endsWith(":30") ? "border-border/15" : "border-border/30")} />
        ))}
        {blockedBlocks.map((block) => renderBlockedBlock(block))}
        {appts.map((appt) => renderBlock(appt, colRef.current))}
      </div>
    </div>
  );
}

function ProfColumn({
  profId, profName, hours, appts, blockedBlocks, renderBlock, renderBlockedBlock, onSlotClick,
}: {
  profId: string; profName: string; hours: string[]; appts: DBAppointment[];
  blockedBlocks: any[];
  renderBlock: (appt: DBAppointment, el: HTMLDivElement | null) => React.ReactNode;
  renderBlockedBlock: (block: any) => React.ReactNode;
  onSlotClick: (time: string) => void;
}) {
  const colRef = useRef<HTMLDivElement>(null);
  return (
    <div className="flex-1 min-w-[200px] border-r border-border last:border-r-0">
      <div className="h-12 flex items-center justify-center border-b border-border bg-muted/30 px-2">
        <span className="text-xs font-bold text-foreground truncate">{profName}</span>
      </div>
      <div className="relative" ref={colRef}>
        {hours.map((time) => (
          <div
            key={time}
            className={cn("h-8 border-t hover:bg-accent/30 transition-colors cursor-pointer", time.endsWith(":30") ? "border-border/15" : "border-border/30")}
            onDoubleClick={() => onSlotClick(time)}
          />
        ))}
        {blockedBlocks.map((block) => renderBlockedBlock(block))}
        {appts.map((appt) => renderBlock(appt, colRef.current))}
      </div>
    </div>
  );
}

function getStatusBg(status: string): string {
  const map: Record<string, string> = {
    agendado: "#4285F4",
    confirmado: "#1a237e",
    espera: "#FF9800",
    atendendo: "#E040FB",
    atendido: "#4CAF50",
    cancelado: "#9E9E9E",
    atrasado: "#CDDC39",
    falta: "#8B0000",
  };
  return map[status] || "#4285F4";
}

export default AgendaPage;
