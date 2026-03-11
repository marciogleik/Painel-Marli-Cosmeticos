import { useState, useRef, useCallback, useEffect } from "react";
import { useProfessionals, useAppointments, statusConfig, DBAppointment, WEEKLY_BLOCKS } from "@/hooks/useClinicData";
import { cn } from "@/lib/utils";
import { format, addDays, subDays, startOfWeek, endOfWeek, isToday, parseISO, startOfMonth, endOfMonth, addMonths, isSameMonth, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Calendar, Check, X as XIcon, GripVertical, Ban, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NewAppointmentDialog from "@/components/NewAppointmentDialog";
import BlockedSlotDialog from "@/components/BlockedSlotDialog";
import AppointmentDetailDialog from "@/components/AppointmentDetailDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { checkAppointmentConflict } from "@/utils/appointmentConflict";
import { useNavigate } from "react-router-dom";
import { normalizePhone, matchesPhone } from "@/utils/phoneUtils";
import { resolveOverlaps, PositionedAppointment } from "@/utils/agendaLayout";
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

type ViewMode = "month" | "week" | "day";

const statusLabel: Record<string, string> = {
  agendado: "Agendado",
  confirmado: "Confirmado",
  espera: "Em Espera",
  atendendo: "Atendendo",
  atendido: "Atendido",
  cancelado: "Cancelado",
  atrasado: "Atrasado",
  falta: "Faltou",
  removido: "Removido",
};

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
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<DBAppointment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockDefaults, setBlockDefaults] = useState<{ profId?: string; date?: Date; time?: string }>({});
  const [apptDefaults, setApptDefaults] = useState<{ profId?: string; date?: Date; time?: string }>({});

  // Drag state
  const dragRef = useRef<DragState | null>(null);
  const [draggingApptId, setDraggingApptId] = useState<string | null>(null);
  const [dragPreviewTop, setDragPreviewTop] = useState<number>(0);

  // Confirmation dialog
  const [pendingReschedule, setPendingReschedule] = useState<PendingReschedule | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

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

  // Current time updater
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const hours = Array.from({ length: 30 }, (_, i) => {
    const h = Math.floor(i / 2) + 7;
    const m = (i % 2) * 30;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  });

  // Date range for queries
  const dateFrom = (() => {
    if (viewMode === "month") return format(startOfMonth(selectedDay), "yyyy-MM-dd");
    if (viewMode === "week") return format(weekStart, "yyyy-MM-dd");
    return format(selectedDay, "yyyy-MM-dd");
  })();

  const dateTo = (() => {
    if (viewMode === "month") return format(endOfMonth(selectedDay), "yyyy-MM-dd");
    if (viewMode === "week") return format(addDays(weekStart, 6), "yyyy-MM-dd");
    return format(selectedDay, "yyyy-MM-dd");
  })();

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
    const { top, height } = getPosition({
      start_time: block.start_time,
      end_time: block.end_time,
    } as DBAppointment);

    return (
      <div
        key={block.id}
        className={cn(
          "absolute left-1 right-1 overflow-hidden z-10 cursor-pointer transition-all hover:brightness-95 group",
          "modern-agenda-card absence-block evento-agenda"
        )}
        style={{ top: `${top}px`, height: `${height}px` }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setApptDefaults({
            profId: block.professional_id,
            date: new Date(block.date + "T12:00:00"),
            time: block.start_time.slice(0, 5),
          });
          setDialogOpen(true);
        }}
      >
        <div className="horario flex justify-between items-center" style={{ color: "#ffffff" }}>
          <span style={{ color: "#ffffff" }}>{block.start_time.slice(0, 5)}</span>
          {height >= 40 && (
            <span className="text-[9px] uppercase font-bold tracking-widest opacity-80" style={{ color: "#ffffff" }}>
              {block.isWeekly ? "Semanal" : "Bloqueio"}
            </span>
          )}
        </div>
        <div className="cliente font-medium flex items-center gap-1.5" style={{ fontSize: "11px", color: "#ffffff" }}>
          <span style={{ color: "#ffffff" }}>🚫</span>
          <span className="truncate uppercase tracking-tight" style={{ color: "#ffffff" }}>
            {block.reason || "Horário Bloqueado"}
            {(() => {
              const prof = professionals.find(p => p.id === block.professional_id);
              return prof && height >= 60 ? ` • ${prof.name.split(" ")[0]}` : "";
            })()}
          </span>
        </div>

        {!block.isWeekly && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteBlockedSlot(block.id);
            }}
            className="absolute top-1 right-1 p-0.5 rounded hover:bg-destructive/20 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remover bloqueio"
          >
            <Trash2 className="w-3.5 h-3.5 text-destructive" />
          </button>
        )}
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
    if (viewMode === "month") setSelectedDay(addMonths(selectedDay, -1));
    else if (viewMode === "week") setWeekStart(addDays(weekStart, -7));
    else setSelectedDay(subDays(selectedDay, 1));
  };
  const handleNext = () => {
    if (viewMode === "month") setSelectedDay(addMonths(selectedDay, 1));
    else if (viewMode === "week") setWeekStart(addDays(weekStart, 7));
    else setSelectedDay(addDays(selectedDay, 1));
  };
  const handleToday = () => {
    const today = new Date();
    setSelectedDay(today);
    if (viewMode === "week") setWeekStart(startOfWeek(today, { weekStartsOn: 0 }));
  };

  const dateLabel =
    viewMode === "month"
      ? format(selectedDay, "MMMM 'de' yyyy", { locale: ptBR })
      : viewMode === "week"
        ? `${format(weekStart, "dd", { locale: ptBR })} de ${format(weekStart, "MMM.", { locale: ptBR })} - ${format(addDays(weekStart, 6), "dd", { locale: ptBR })} de ${format(addDays(weekStart, 6), "MMM.", { locale: ptBR })} de ${format(weekStart, "yyyy")}`
        : format(selectedDay, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  const days =
    viewMode === "week" ? Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)) :
      viewMode === "month" ? [] : // Month view handles its own day calculation
        [selectedDay];

  // Professional sorting map (using IDs for stability)
  const professionalOrder = [
    "00000000-0000-0000-0000-000000000001", // Dhionara Sbrussi
    "00000000-0000-0000-0000-000000000002", // Dhiani Sbrussi
    "00000000-0000-0000-0000-000000000003", // Luciane Castanheira
    "00000000-0000-0000-0000-000000000004", // Tais Pires
    "00000000-0000-0000-0000-000000000005", // Bruna Castanheira
    "00000000-0000-0000-0000-000000000006", // Michele Quintana
    "00000000-0000-0000-0000-000000000007", // Patricia Armanda
  ];

  const sortedProfessionals = [...professionals]
    .filter((p) => professionalOrder.includes(p.id))
    .sort((a, b) => {
      const indexA = professionalOrder.indexOf(a.id);
      const indexB = professionalOrder.indexOf(b.id);
      return indexA - indexB;
    });

  const filteredProfessionals =
    selectedFilter === "all" ? sortedProfessionals : sortedProfessionals.filter((p) => p.id === selectedFilter);

  const getApptsForColumn = (dayStr: string, profId?: string) => {
    const filtered = appointments.filter((a) => {
      if (a.status === "removido") return false;
      const matchDay = a.date === dayStr;

      // Search filter
      const matchesSearch = !searchTerm ||
        a.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        matchesPhone(a.client_phone, searchTerm);

      const matchesProfessional = viewMode === "day" && profId
        ? a.professional_id === profId
        : selectedFilter === "all" || a.professional_id === selectedFilter;

      return matchesProfessional && matchesSearch && matchDay;
    });

    return resolveOverlaps(filtered);
  };

  const renderAppointmentBlock = (posAppt: PositionedAppointment<DBAppointment>, showProfName: boolean, columnEl: HTMLDivElement | null) => {
    const { appt, overlapIndex, overlapCount } = posAppt;
    const { top, height } = getPosition(appt);
    const cfg = statusConfig[appt.status as keyof typeof statusConfig] || statusConfig.agendado;
    const isCancelled = appt.status === "cancelado";
    const isFalta = appt.status === "falta";
    const isDraggable = !isCancelled && !isFalta;
    const isDragging = draggingApptId === appt.id;
    const prof = professionals.find((p) => p.id === appt.professional_id);
    const serviceName = getServiceNames(appt.id);
    const timeRange = `${appt.start_time?.slice(0, 5)} - ${appt.end_time?.slice(0, 5)}`;
    const isCompact = height < 45;
    const isMedium = height >= 90;
    const isLarge = height >= 140;

    const displayTop = isDragging ? dragPreviewTop : top;
    const serviceSummary = serviceName || appt.notes || "Sem serviço";

    return (
      <div
        key={appt.id}
        className={cn(
          "absolute overflow-hidden z-10 transition-all duration-200",
          "modern-agenda-card evento-agenda",
          isDraggable ? "cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-white/20" : "cursor-pointer",
          isDragging && "opacity-80 shadow-2xl scale-[1.01] z-50",
          isCancelled && "opacity-50 grayscale-[0.2]",
          isFalta && "opacity-70 grayscale-[0.4]",
          appt.status === "bloqueado" && "absence-block"
        )}
        style={{
          top: `${top}px`,
          height: `${height}px`,
          width: `calc((100% - 8px) / ${overlapCount} - 4px)`, // 4px total gap per slot
          left: `calc(4px + (${overlapIndex} * (100% - 8px) / ${overlapCount}) + 2px)`, // 2px start gap
          backgroundColor: appt.status === "bloqueado" ? undefined : getStatusBg(appt.status),
          color: appt.status === "bloqueado"
            ? "#000000"
            : (["atrasado", "espera"].includes(appt.status) ? "#1f2937" : "white"),
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
        {/* Status Dot / Indicator */}
        {appt.status !== "bloqueado" && overlapCount === 1 && height >= 50 && (
          <div className="status-badge" style={{ backgroundColor: "currentColor", opacity: 0.5 }} />
        )}

        {/* Header: Time */}
        {height >= 25 && (
          <div className="horario flex items-center justify-between">
            <span>{appt.start_time.slice(0, 5)}</span>
            {overlapCount === 1 && height >= 120 && (
              <span className="opacity-40">{statusLabel[appt.status]}</span>
            )}
          </div>
        )}

        {/* Body: Client name */}
        <div
          className="cliente"
          style={{
            fontSize: overlapCount > 1 ? "12px" : "13px",
            lineHeight: 1.1,
            marginTop: height < 40 ? "-1px" : "0px"
          }}
        >
          {appt.status === "confirmado" && (
            <span className="mr-1 opacity-70">✓</span>
          )}
          {appt.client_name}
        </div>

        {/* Footer: Service / Professional */}
        {height >= 45 && (
          <div
            className="servico"
            style={{
              fontSize: overlapCount > 1 ? "10px" : "10.5px",
              opacity: 0.7
            }}
          >
            {serviceSummary}
            {prof && overlapCount === 1 && height >= 80 && (
              <div className="mt-1 font-bold uppercase tracking-widest text-[9px] opacity-50">
                {prof.name.split(" ")[0]}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderMonthView = () => {
    const start = startOfMonth(selectedDay);
    const end = endOfMonth(selectedDay);
    const startDay = startOfWeek(start, { weekStartsOn: 0 });
    const endDay = endOfWeek(end, { weekStartsOn: 0 });

    const calendarDays = [];
    let current = startDay;
    while (current <= endDay) {
      calendarDays.push(current);
      current = addDays(current, 1);
    }

    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    return (
      <div className="flex-1 overflow-auto bg-background p-4">
        <div className="grid grid-cols-7 gap-px bg-slate-300 border-2 border-slate-300 rounded-lg overflow-hidden shadow-sm">
          {weekDays.map(day => (
            <div key={day} className="bg-muted/50 p-2 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {day}
            </div>
          ))}
          {calendarDays.map((date, idx) => {
            const isCurrentMonth = isSameMonth(date, selectedDay);
            const isToday = isSameDay(date, new Date());
            const dayStr = format(date, "yyyy-MM-dd");
            const dayAppts = appointments.filter(a => a.date === dayStr && a.status !== "removido");
            const sortedAppts = dayAppts.sort((a, b) => a.start_time.localeCompare(b.start_time));

            return (
              <div
                key={idx}
                className={cn(
                  "min-h-[120px] bg-card p-2 transition-colors cursor-pointer group hover:bg-accent/5",
                  !isCurrentMonth && "bg-muted/20 text-muted-foreground/50",
                  isToday && "bg-primary/5"
                )}
                onDoubleClick={() => {
                  setApptDefaults({ date });
                  setDialogOpen(true);
                }}
                onClick={() => {
                  setSelectedDay(date);
                  setViewMode("day");
                }}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className={cn(
                    "text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full transition-colors",
                    isToday ? "bg-primary text-primary-foreground" : "text-foreground group-hover:bg-muted"
                  )}>
                    {format(date, "d")}
                  </span>
                  {dayAppts.length > 0 && (
                    <span className="text-[10px] font-medium text-muted-foreground px-1.5 py-0.5 bg-muted rounded-full">
                      {dayAppts.length} {dayAppts.length === 1 ? 'agend.' : 'agends.'}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  {sortedAppts.slice(0, 4).map(appt => (
                    <div
                      key={appt.id}
                      className="text-[10px] truncate px-1.5 py-0.5 rounded-sm border border-border hover:border-border-foreground/20 transition-all flex items-center gap-1"
                      style={{
                        backgroundColor: getStatusBg(appt.status) + '20',
                        borderLeft: `2px solid ${getStatusBg(appt.status)}`
                      }}
                    >
                      <span className="font-bold shrink-0">{appt.start_time.slice(0, 5)}</span>
                      <span className="truncate">{appt.client_name}</span>
                    </div>
                  ))}
                  {dayAppts.length > 4 && (
                    <div className="text-[9px] font-bold text-muted-foreground pl-1.5 pt-0.5">
                      + {dayAppts.length - 4} mais...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  // Format time for display in dialog
  const formatTimeDisplay = (time: string) => time.slice(0, 5);

  const gridContainerRef = useRef<HTMLDivElement>(null);
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Sync scroll if needed, currently just placeholder for potential sync
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-8 pt-8 pb-2 shrink-0">
        <div>
          <h1 className="text-2xl font-display font-bold">Agenda</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gerencie seus agendamentos e horários</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-64 mr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
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
              onClick={() => {
                setViewMode("month");
              }}
              className={cn(
                "px-3 py-1 text-xs font-medium transition-colors",
                viewMode === "month" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
              )}
            >
              Mês
            </button>
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
          {sortedProfessionals.map((p) => (
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

      <div className="flex-1 overflow-hidden flex flex-col relative px-8 pb-4">
        <div className="flex-1 border border-border rounded-lg overflow-hidden bg-[#fffdf5] relative flex flex-col">
          {viewMode === "month" ? (
            renderMonthView()
          ) : (
            <div className="flex-1 overflow-auto custom-scrollbar" ref={gridContainerRef} onScroll={handleScroll}>
              {viewMode === "week" ? (
                /* ============ WEEK VIEW ============ */
                <div className="flex min-w-[1200px] relative h-full">
                  <div className="w-16 shrink-0 border-r border-border bg-background/50 sticky left-0 z-20">
                    <div className="h-12" />
                    {hours.map((time) => {
                      const isHalf = time.endsWith(":30");
                      return (
                        <div key={time} className={cn("h-8 flex items-start justify-end pr-2 pt-0.5 border-t", isHalf ? "border-slate-300" : "border-slate-400")}>
                          <span className={cn("text-[10px] font-medium", isHalf ? "text-muted-foreground/70" : "text-muted-foreground/90")}>{time}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-1 relative h-[1000px]">
                    {/* Real-time Indicator Component (Week) */}
                    {(() => {
                      const h = currentTime.getHours();
                      const m = currentTime.getMinutes();
                      if (h < 7 || h >= 22) return null;
                      const todayIdx = days.findIndex(d => isToday(d));
                      if (todayIdx === -1) return null;

                      const topOffset = (h - 7) * 64 + (m / 60) * 64 + 48;
                      const colWidth = 100 / 7;

                      return (
                        <div
                          className="absolute z-50 pointer-events-none flex items-center"
                          style={{
                            top: `${topOffset}px`,
                            left: `${todayIdx * colWidth}%`,
                            width: `${colWidth}%`
                          }}
                        >
                          <div className="w-2 h-2 rounded-full bg-destructive -ml-1 shadow-sm" />
                          <div className="h-[2px] flex-1 bg-destructive shadow-sm" />
                        </div>
                      );
                    })()}

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
                          renderBlock={(posAppt, el) => renderAppointmentBlock(posAppt, selectedFilter === "all", el)}
                          renderBlockedBlock={renderBlockedBlock}
                          onDoubleClick={() => {
                            setSelectedDay(day);
                            setViewMode("day");
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* ============ DAY VIEW ============ */
                <div className="flex h-full" style={{ minWidth: `${Math.max(filteredProfessionals.length * 200 + 80, 800)}px`, width: 'max-content' }}>
                  <div className="w-16 shrink-0 border-r border-border bg-background/50 sticky left-0 z-20">
                    <div className="h-12" />
                    {hours.map((time) => {
                      const isHalf = time.endsWith(":30");
                      return (
                        <div key={time} className={cn("h-8 flex items-start justify-end pr-2 pt-0.5 border-t", isHalf ? "border-slate-300" : "border-slate-400")}>
                          <span className={cn("text-[10px] font-medium", isHalf ? "text-muted-foreground/70" : "text-muted-foreground/90")}>{time}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-1 relative h-[1000px]">
                    {/* Real-time Indicator Component (Day) */}
                    {(() => {
                      const h = currentTime.getHours();
                      const m = currentTime.getMinutes();
                      if (h < 7 || h >= 22) return null;
                      if (!isToday(selectedDay)) return null;

                      const topOffset = (h - 7) * 64 + (m / 60) * 64 + 48;

                      return (
                        <div
                          className="absolute left-0 right-0 z-50 pointer-events-none flex items-center"
                          style={{ top: `${topOffset}px` }}
                        >
                          <div className="w-2 h-2 rounded-full bg-destructive -ml-1 shadow-sm" />
                          <div className="h-[2px] flex-1 bg-destructive shadow-sm" />
                        </div>
                      );
                    })()}

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
                          renderBlock={(posAppt, el) => renderAppointmentBlock(posAppt, false, el)}
                          renderBlockedBlock={renderBlockedBlock}
                          onSlotClick={(time) => {
                            setApptDefaults({ profId: prof.id, date: selectedDay, time });
                            setDialogOpen(true);
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <NewAppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultDate={apptDefaults.date}
        defaultProfessionalId={apptDefaults.profId}
        defaultStartTime={apptDefaults.time}
      />
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
  hours: string[]; appts: PositionedAppointment<DBAppointment>[];
  blockedBlocks: any[];
  renderBlock: (posAppt: PositionedAppointment<DBAppointment>, el: HTMLDivElement | null) => React.ReactNode;
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
          <div
            key={time}
            className={cn("h-8 border-t hover:bg-accent/30 transition-colors", time.endsWith(":30") ? "border-slate-300" : "border-slate-400")}
          />
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
  profId: string; profName: string; hours: string[]; appts: PositionedAppointment<DBAppointment>[];
  blockedBlocks: any[];
  renderBlock: (posAppt: PositionedAppointment<DBAppointment>, el: HTMLDivElement | null) => React.ReactNode;
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
            className={cn("h-8 border-t hover:bg-accent/30 transition-colors cursor-pointer", time.endsWith(":30") ? "border-slate-300" : "border-slate-400")}
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
    agendado: "#3481F5",
    confirmado: "#000C52",
    espera: "#FA920A",
    atendendo: "#E82EDF",
    atendido: "#11BD3C",
    cancelado: "#96ABB3",
    atrasado: "#D6C800",
    falta: "#B30909",
  };
  return map[status] || "#4285F4";
}

export default AgendaPage;
