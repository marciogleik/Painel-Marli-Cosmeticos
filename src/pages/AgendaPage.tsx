import { useState, useRef, useCallback, useEffect } from "react";
import { useProfessionals, useAppointments, statusConfig, DBAppointment, WEEKLY_BLOCKS } from "@/hooks/useClinicData";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { format, addDays, subDays, startOfWeek, endOfWeek, isToday, parseISO, startOfMonth, endOfMonth, addMonths, isSameMonth, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, Calendar, Check, X as XIcon, GripVertical, Ban, Trash2, Cake, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NewAppointmentDialog from "@/components/NewAppointmentDialog";
import BlockedSlotDialog from "@/components/BlockedSlotDialog";
import AppointmentDetailDialog from "@/components/AppointmentDetailDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { checkAppointmentConflict } from "@/utils/appointmentConflict";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
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

const SLOT_HEIGHT = 36; // 15 min slot in pixels
const HOUR_HEIGHT = SLOT_HEIGHT * 4; // 144px
const PX_PER_MINUTE = SLOT_HEIGHT / 15; // 2.4px/min
const GRID_HEADER_HEIGHT = 48; // h-12

const AgendaPage = () => {
  // Unified Current Time Source
  const getNow = () => {
    // Standardize 'Today' across the app
    // Browsers in Brazil already respect UTC-3 correctly
    return new Date();
  };


  const { user } = useAuth();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  // Fetch current user role
  const { data: userRole } = useQuery({
    queryKey: ["my-role", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .single();
      return data?.role ?? null;
    },
    enabled: !!user,
  });

  // Fetch current user professional record
  const { data: currentProfessional } = useQuery({
    queryKey: ["my-professional", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("professionals")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      return data ?? null;
    },
    enabled: !!user,
  });

  const canViewAll = userRole === 'gestor' || currentProfessional?.can_view_all_agendas === true;

  const [searchParams] = useSearchParams();
  const initialView = searchParams.get("view") as ViewMode;
  const [viewMode, setViewMode] = useState<ViewMode>(initialView || "day");
  const [weekStart, setWeekStart] = useState(() => startOfWeek(getNow(), { weekStartsOn: 0 }));
  const [selectedDay, setSelectedDay] = useState(() => getNow());

  // Set default filter based on permission
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // Sync initial filter when professional data is loaded
  useEffect(() => {
    if (!canViewAll && currentProfessional?.id) {
      setSelectedFilter(currentProfessional.id);
    }
  }, [canViewAll, currentProfessional?.id]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<DBAppointment | null>(null);
  const [confirmDeleteBlockId, setConfirmDeleteBlockId] = useState<string | null>(null);
  const [isDeletingBlock, setIsDeletingBlock] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockDefaults, setBlockDefaults] = useState<{ id?: string; profId?: string; date?: Date; startTime?: string; endTime?: string; notes?: string }>({});
  const [apptDefaults, setApptDefaults] = useState<{ profId?: string; date?: Date; time?: string }>({});

  // Drag state
  const dragRef = useRef<DragState | null>(null);
  const [draggingApptId, setDraggingApptId] = useState<string | null>(null);
  const [dragPreviewTop, setDragPreviewTop] = useState<number>(0);

  // Confirmation dialog
  const [pendingReschedule, setPendingReschedule] = useState<PendingReschedule | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [currentTime, setCurrentTime] = useState(getNow());

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Status atualizado com sucesso!");
    },
    onError: (err: any) => {
      toast.error("Erro ao atualizar status: " + err.message);
    }
  });

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
      .subscribe();

    return () => {
      supabase.removeChannel(appointmentsChannel);
    };
  }, [queryClient]);

  // Current time updater
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getNow());
    }, 30000); // 30s is enough for UI indicator
    return () => clearInterval(timer);
  }, []);

  const hours = Array.from({ length: 60 }, (_, i) => {
    const h = Math.floor(i / 4) + 7;
    const m = (i % 4) * 15;
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

  const { data: professionals = [] } = useProfessionals({ onlyVisibleInAgenda: true });
  const { data: appointments = [] } = useAppointments(dateFrom, dateTo);

  // Fetch birthdays for the month
  const { data: monthBirthdays = [] } = useQuery({
    queryKey: ["birthdays_month", format(selectedDay, "MM", { locale: ptBR })],
    queryFn: async () => {
      const monthStr = format(selectedDay, "MM", { locale: ptBR });
      const { data, error } = await supabase
        .from("clients")
        .select("id, full_name, birth_date")
        .not("birth_date", "is", null)
        .eq("is_active", true);
      if (error) throw error;

      return (data || []).filter(c => c.birth_date && c.birth_date.slice(5, 7) === monthStr);
    },
    enabled: viewMode === "month",
  });

  const getServiceNames = (appt: DBAppointment): string => {
    const services = appt.appointment_services || [];
    if (services.length === 0) return "";
    return services.map((s) => s.service_name).join(", ");
  };

  const deleteBlockedSlot = async (id: string) => {
    setIsDeletingBlock(true);
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao remover bloqueio: " + error.message);
    } else {
      toast.success("Bloqueio removido!");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      setConfirmDeleteBlockId(null);
    }
    setIsDeletingBlock(false);
  };

  const getBlockedForColumn = (dayStr: string, profId?: string) => {
    const dynamicBlocks = appointments.filter((b) => {
      const matchDay = b.date === dayStr;
      const isBlocked = b.status === "bloqueado" || b.client_name === "BLOQUEIO";
      if (!isBlocked) return false;

      if (viewMode === "day" && profId) return matchDay && b.professional_id === profId;
      const matchProf = selectedFilter === "all" || b.professional_id === selectedFilter;
      return matchDay && matchProf;
    });

    return [...dynamicBlocks]; // All blocks are now in the database
  };

  const renderBlockedBlock = (block: any) => {
    const { top, height } = getPosition({
      start_time: block.start_time,
      end_time: block.end_time,
    } as DBAppointment);

    return (
      <div
        key={block.id}
        className="absolute left-0 right-0 p-2 z-[1] border-l-4 border-l-slate-900 overflow-hidden block-container"
        style={{
          top: `${top}px`,
          height: `${height}px`,
          cursor: 'default',
          background: 'repeating-linear-gradient(45deg, #1e293b, #1e293b 10px, #0f172a 10px, #0f172a 20px)',
          opacity: 0.95,
          borderRadius: '4px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }}
      >
        <div className="flex justify-between items-center text-slate-400">
          <span className="text-[10px] font-black tracking-widest">{(block.start_time || "00:00").slice(0, 5)}</span>
          {height >= 40 && (
            <Ban className="w-3 h-3 opacity-60 text-destructive-foreground" />
          )}
        </div>
        <div className="font-black text-slate-100 uppercase tracking-tighter truncate mt-0.5" style={{ fontSize: "10px" }}>
          {(block.notes?.replace(/<!--series_id:[a-f0-9-]+-->/, "").trim()) || block.reason || "Indisponível"}
        </div>

        {!block.isWeekly && (
          <div className="absolute top-1 right-1 p-0.5 pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDeleteBlockId(block.id);
              }}
              className="p-1 rounded hover:bg-destructive/10 transition-colors"
              title="Remover bloqueio"
            >
              <Trash2 className="w-3.5 h-3.5 text-destructive/60 hover:text-destructive" />
            </button>
          </div>
        )}
      </div>
    );
  };

  const getPosition = (appt: DBAppointment) => {
    const startTime = appt.start_time || "07:00";
    const endTime = appt.end_time || "07:30";
    
    const timeParts = startTime.split(":").map(Number);
    const endParts = endTime.split(":").map(Number);
    
    const startH = isNaN(timeParts[0]) ? 7 : timeParts[0];
    const startM = isNaN(timeParts[1]) ? 0 : timeParts[1];
    const endH = isNaN(endParts[0]) ? 7 : endParts[0];
    const endM = isNaN(endParts[1]) ? 30 : endParts[1];

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const duration = Math.max(endMinutes - startMinutes, 15);
    
    // Calculate top: (hour - 7) * hour_height + (minutes * px/min)
    const top = (startH - 7) * HOUR_HEIGHT + (startM * PX_PER_MINUTE);
    const height = Math.max((duration * PX_PER_MINUTE), 42);
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
    // Calculate time from pixel position
    const minutesFromSeven = Math.round(px / PX_PER_MINUTE);
    const totalMinutes = minutesFromSeven + 7 * 60;

    // Snap to 15-minute intervals (existing grid is 15-min based)
    const snapped = Math.round(totalMinutes / 15) * 15;
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
      const newTop = Math.max(0, dragRef.current.initialTop + delta); // Min top is 0
      dragRef.current.currentTop = newTop;
      setDragPreviewTop(newTop);
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
      const oldParts = (drag.appointment.start_time || "00:00").split(":").map(Number);
      const endParts = (drag.appointment.end_time || "00:00").split(":").map(Number);
      
      const sMin = (oldParts[0] || 0) * 60 + (oldParts[1] || 0);
      const eMin = (endParts[0] || 0) * 60 + (endParts[1] || 0);
      const durationMin = eMin - sMin || 30;

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
      // Note: we don't clear draggingApptId here to avoid the card jumping back 
      // while the user is looking at the confirmation dialog.
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  const handleConfirmReschedule = async () => {
    if (!pendingReschedule) return;
    setIsRescheduling(true);

    const { appointment, newStartTime, newEndTime } = pendingReschedule;

    // Check conflicts (warn but don't block)
    const conflict = await checkAppointmentConflict({
      professionalId: appointment.professional_id,
      date: appointment.date,
      startTime: newStartTime,
      endTime: newEndTime,
      excludeAppointmentId: appointment.id,
    });

    if (conflict) {
      toast.warning(`Atenção: sobreposição de horário com ${conflict}. Agendamento reagendado como encaixe.`);
    }

    const { error } = await supabase
      .from("appointments")
      .update({ start_time: newStartTime, end_time: newEndTime })
      .eq("id", appointment.id);

    if (error) {
      toast.error("Erro ao reagendar: " + error.message);
    } else {
      if (!conflict) toast.success("Agendamento reagendado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    }

    setIsRescheduling(false);
    setPendingReschedule(null);
    setDraggingApptId(null); // Clear drag state AFTER confirmation
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
    const today = getNow();
    setSelectedDay(today);
    if (viewMode === "week") setWeekStart(startOfWeek(today, { weekStartsOn: 0 }));
  };

  const dateLabel =
    viewMode === "month"
      ? format(selectedDay, "MMMM 'de' yyyy", { locale: ptBR })
      : viewMode === "week"
        ? `${format(weekStart, "dd", { locale: ptBR })} de ${format(weekStart, "MMM", { locale: ptBR })} - ${format(addDays(weekStart, 6), "dd", { locale: ptBR })} de ${format(addDays(weekStart, 6), "MMM", { locale: ptBR })} de ${format(weekStart, "yyyy", { locale: ptBR })}`
        : format(selectedDay, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  const days =
    viewMode === "week" ? Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)) :
      viewMode === "month" ? [] : // Month view handles its own day calculation
        [selectedDay];

  const sortedProfessionals = professionals;

  const filteredProfessionals =
    selectedFilter === "all" ? sortedProfessionals : sortedProfessionals.filter((p) => p.id === selectedFilter);

  const getApptsForColumn = (dayStr: string, profId?: string) => {
    const filtered = appointments.filter((a) => {
      if (a.status === "removido") return false;
      if (a.status === "bloqueado" || a.client_name === "BLOQUEIO") return false;
      const matchDay = a.date === dayStr;

      const matchesProfessional = viewMode === "day" && profId
        ? a.professional_id === profId
        : selectedFilter === "all" || a.professional_id === selectedFilter;

      return matchesProfessional && matchDay;
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
    const isDragging = draggingApptId !== null && String(draggingApptId) === String(appt.id);
    const prof = professionals?.find((p) => p.id === appt.professional_id);
    const serviceName = getServiceNames(appt);
    const timeRange = `${appt.start_time?.slice(0, 5)} - ${appt.end_time?.slice(0, 5)}`;
    const isCompact = height < 45;
    const isMedium = height >= 90;
    const isLarge = height >= 140;

    const displayTop = isDragging ? dragPreviewTop : top;
    const serviceSummary = serviceName || "Sem serviço";

    return (
      <ContextMenu key={appt.id}>
        <ContextMenuTrigger>
          <div
            className={cn(
              "absolute overflow-hidden z-10",
              !isDragging && "transition-all duration-200",
              "modern-agenda-card evento-agenda",
              isDraggable ? "cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-white/20" : "cursor-pointer",
              appt.status === "bloqueado" && "absence-block"
            )}
            style={{
              top: `${displayTop}px`,
              height: `${height}px`,
              width: `calc((100% - 8px) / ${overlapCount} - 4px)`, // 4px total gap per slot
              left: `calc(4px + (${overlapIndex} * (100% - 8px) / ${overlapCount}) + 2px)`, // 2px start gap
              backgroundColor: appt.status === "bloqueado" ? undefined : getStatusBg(appt.status),
              color: appt.status === "bloqueado"
                ? "#000000"
                : (["atrasado", "espera"].includes(appt.status) ? "#1f2937" : "white"),
              zIndex: isDragging ? 1000 : 10,
              opacity: isDragging ? 0.9 : (isCancelled ? 0.5 : (isFalta ? 0.7 : 1)),
              transform: isDragging ? 'scale(1.02)' : 'scale(1)',
              boxShadow: isDragging ? '0 25px 50px -12px rgb(0 0 0 / 0.5)' : undefined,
              border: isDragging ? '2px solid #ffffff' : undefined,
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

            {/* Body: Client name & Time (Compact or Normal) */}
            {height < 50 ? (
              <div className="flex items-center gap-1.5 overflow-hidden">
                <div className="horario">{(appt.start_time || "00:00").slice(0, 5)}</div>
                <div className="cliente flex-1 truncate">
                  {appt.status === "confirmado" && <span className="mr-0.5 opacity-70">✓</span>}
                  {appt.client_name}
                </div>
              </div>
            ) : (
              <>
                {/* Header: Time */}
                <div className="horario flex items-center justify-between">
                  <span>{(appt.start_time || "00:00").slice(0, 5)}</span>
                  {overlapCount === 1 && height >= 120 && (
                    <span className="opacity-40">{statusLabel[appt.status]}</span>
                  )}
                </div>

                {/* Body: Client name */}
                <div
                  className="cliente"
                  style={{
                    fontSize: overlapCount > 3 ? "8px" : (overlapCount > 2 ? "9px" : (overlapCount > 1 ? "10px" : "11px")),
                    lineHeight: "1.1",
                    WebkitLineClamp: 2,
                  }}
                >
                  {appt.status === "confirmado" && (
                    <span className="mr-1 opacity-70">✓</span>
                  )}
                  {appt.client_name}
                </div>
              </>
            )}

            {/* Footer: Service / Professional */}
            {height >= 25 && (
              <div
                className="servico"
                style={{
                  fontSize: overlapCount > 3 ? "8.5px" : (overlapCount > 2 ? "9.5px" : (overlapCount > 1 ? "10.5px" : "12px")),
                  lineHeight: "1.1",
                  fontWeight: "600",
                  opacity: 0.9
                }}
              >
                {serviceSummary}
                {prof && overlapCount === 1 && height >= 80 && (
                  <div className="mt-1 font-bold uppercase tracking-widest text-[9px] opacity-50">
                    {prof.name?.split(" ")[0] || "Prof"}
                  </div>
                )}
              </div>
            )}

          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <div className="px-2 py-1.5 text-xs font-bold uppercase tracking-widest opacity-50">Alterar Status</div>
          {Object.entries(statusLabel).filter(([val]) => val !== 'removido').map(([value, label]) => (
            <ContextMenuItem
              key={value}
              onClick={() => updateStatusMutation.mutate({ id: appt.id, status: value })}
              className={cn(
                "flex items-center justify-between",
                appt.status === value && "bg-muted font-bold"
              )}
            >
              {label}
              {appt.status === value && <Check className="w-3 h-3" />}
            </ContextMenuItem>
          ))}
          <div className="h-px bg-border my-1" />
          <ContextMenuItem
            onClick={() => {
              setSelectedAppointment(appt);
              setDetailOpen(true);
            }}
          >
            <Edit2 className="w-3 h-3 mr-2" /> Editar Detalhes
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
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

    const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

    return (
      <div className="flex-1 overflow-auto bg-background p-4">
        <div className="grid grid-cols-7 gap-px bg-border/50 border border-border/50 rounded-2xl overflow-hidden shadow-sm">
          {weekDays.map(day => (
            <div key={day} className="bg-muted/30 p-2.5 text-center text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">
              {day}
            </div>
          ))}
          {calendarDays.map((date, idx) => {
            const isCurrentMonth = isSameMonth(date, selectedDay);
            const isToday = isSameDay(date, new Date());
            const dayStr = format(date, "yyyy-MM-dd");
            const mmdd = format(date, "MM-dd");
            const dayAppts = appointments.filter(a => {
              const matchesProfessional = selectedFilter === "all" || a.professional_id === selectedFilter;
              return a.date === dayStr && a.status !== "removido" && matchesProfessional;
            });
            const dayBirthdays = monthBirthdays.filter(c => c.birth_date && c.birth_date.slice(5) === mmdd);
            const sortedAppts = dayAppts.sort((a, b) => (a.start_time || "").localeCompare(b.start_time || ""));

            return (
              <div
                key={idx}
                className={cn(
                  "min-h-[120px] bg-card p-2.5 transition-colors cursor-pointer group hover:bg-accent/5",
                  !isCurrentMonth && "bg-muted/10 text-muted-foreground/40",
                  isToday && "bg-primary/5 ring-1 ring-inset ring-primary/10"
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
                <div className="flex justify-between items-center mb-2">
                  <span className={cn(
                    "text-xs font-black w-6 h-6 flex items-center justify-center rounded-lg transition-colors",
                    isToday ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/80 group-hover:bg-muted"
                  )}>
                    {format(date, "d")}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {dayBirthdays.length > 0 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 text-primary cursor-help">
                            <Cake className="w-3.5 h-3.5 animate-pulse" />
                            <span className="text-[10px] font-black">{dayBirthdays.length}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-pink-50 border-pink-100 text-pink-700">
                          <div className="space-y-1 py-1">
                            <p className="text-[10px] font-black uppercase tracking-widest mb-2 border-b border-pink-200 pb-1">Aniversariantes 🎂</p>
                            {dayBirthdays.map(c => (
                              <p key={c.id} className="text-xs font-bold truncate">• {c.full_name}</p>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {dayAppts.length > 0 && (
                      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60 px-1.5 py-0.5 bg-muted/60 rounded-lg">
                        {dayAppts.length}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  {/* Birthdays removed from list, now in tooltip */}
                  {sortedAppts.slice(0, 4).map(appt => (
                    <div
                      key={appt.id}
                      className="text-[9px] truncate px-1.5 py-1 rounded-lg transition-all flex items-center gap-1"
                      style={{
                        backgroundColor: getStatusBg(appt.status) + '15',
                        borderLeft: `3px solid ${getStatusBg(appt.status)}`
                      }}
                    >
                      <span className="font-black shrink-0">{(appt.start_time || "00:00").slice(0, 5)}</span>
                      <span className="truncate font-medium">{appt.client_name}</span>
                    </div>
                  ))}
                  {dayAppts.length > 4 && (
                    <div className="text-[8px] font-black text-muted-foreground/50 pl-1.5 pt-0.5 uppercase tracking-widest">
                      +{dayAppts.length - 4} mais
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
    <div className="flex flex-col h-full overflow-hidden" translate="no">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-8 pt-3 pb-3 shrink-0 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-black tracking-tighter text-foreground uppercase leading-none">
            Agenda
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none gap-2 h-10 px-5 text-xs font-black uppercase tracking-widest rounded-xl border-2 border-slate-200 hover:border-destructive/30 hover:bg-destructive/5 text-slate-600 transition-all active:scale-95"
              onClick={() => {
                setBlockDefaults({
                  profId: selectedFilter !== "all" ? selectedFilter : undefined,
                  date: selectedDay
                });
                setBlockDialogOpen(true);
              }}
            >
              <Ban className="w-4 h-4 text-destructive" /> Bloquear
            </Button>
            <Button 
              className="flex-1 sm:flex-none gap-2 h-10 px-6 text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/25 active:scale-95 transition-all" 
              onClick={() => {
                setApptDefaults({ profId: selectedFilter !== "all" ? selectedFilter : undefined, date: selectedDay });
                setDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4" /> Novo
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 sm:px-8 py-2 shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button onClick={handlePrev} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2 text-sm font-bold">
            <Calendar className="w-4 h-4 text-muted-foreground/60" />
            <span className="capitalize">{dateLabel}</span>
          </div>
          <button onClick={handleNext} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button onClick={handleToday} className="ml-1 px-3 py-1 rounded-lg border border-border/40 text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-colors">
            Hoje
          </button>

          {/* View toggle */}
          <div className="flex items-center rounded-xl border border-border/40 overflow-hidden shrink-0 ml-1">
            <button
              onClick={() => setViewMode("month")}
              className={cn(
                "px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-colors",
                viewMode === "month" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
              )}
            >
              Mês
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={cn(
                "px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-colors",
                viewMode === "week" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
              )}
            >
              Semana
            </button>
            <button
              onClick={() => {
                setViewMode("day");
                setSelectedDay(getNow());
              }}
              className={cn(
                "px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-colors",
                viewMode === "day" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
              )}
            >
              Dia
            </button>
          </div>
        </div>

        {canViewAll && (
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1">
            {canViewAll && (
              <button
                onClick={() => setSelectedFilter("all")}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shrink-0",
                  selectedFilter === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
                )}
              >
                Todos
              </button>
            )}
            {sortedProfessionals.map((p) => {
              // If not admin, only show self in the list if they can't view all
              if (!canViewAll && p.id !== currentProfessional?.id) return null;

              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedFilter(p.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shrink-0",
                    selectedFilter === p.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
                  )}
                >
                  {p.name.split(" ")[0]}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Status legend */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 sm:px-8 pb-2 shrink-0">
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1 shrink-0">
            <div className={cn("w-2 h-2 rounded-full", cfg.color)} />
            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/70">{cfg.label}</span>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col relative px-1 sm:px-8 pb-4">
        <div className="flex-1 border border-border rounded-lg overflow-hidden bg-[#fffdf5] relative flex flex-col">
          {viewMode === "month" ? (
            renderMonthView()
          ) : (
            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar" ref={gridContainerRef} onScroll={handleScroll}>
              {viewMode === "week" ? (
                /* ============ WEEK VIEW ============ */
                <div className="flex w-full relative h-full">
                  <div className="w-16 shrink-0 border-r border-slate-300 bg-background sticky left-0 z-30 font-bold">
                    <div className="h-12 sticky top-0 bg-background z-50" />
                    {hours.map((time) => {
                      const isHalf = time.endsWith(":30");
                      return (
                        <div
                          key={time}
                          className={cn("flex items-start justify-end pr-2 pt-0.5 border-t", isHalf ? "border-slate-300" : "border-slate-400")}
                          style={{ height: SLOT_HEIGHT }}
                        >
                          <span className={cn("text-[10px] font-bold", isHalf ? "text-slate-500" : "text-slate-900")}>{time}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-1 relative" style={{ height: HOUR_HEIGHT * 15 }}>
                    {/* Real-time Indicator Component (Week) */}
                    {(() => {
                      const h = currentTime.getHours();
                      const m = currentTime.getMinutes();
                      if (h < 7 || h >= 22) return null;
                      const todayIdx = days.findIndex(d => isToday(d));
                      if (todayIdx === -1) return null;

                      const topOffset = (h - 7) * HOUR_HEIGHT + (m * PX_PER_MINUTE) + GRID_HEADER_HEIGHT;
                      const colWidth = 100 / 7;

                      return (
                        <div
                          className="absolute z-60 pointer-events-none flex items-center"
                          style={{
                            top: `${topOffset}px`,
                            left: `${todayIdx * colWidth}%`,
                            width: `${colWidth}%`
                          }}
                        >
                          <div className="w-2 h-2 rounded-full bg-destructive -ml-1 shadow-[0_0_6px_rgba(239,68,68,0.6)] animate-pulse" />
                          <div className="h-px flex-1 bg-destructive/80" />
                          <span className="absolute -top-4 left-2 text-destructive text-[8px] px-1 font-black uppercase tracking-widest opacity-70">
                            {format(currentTime, "HH:mm")}
                          </span>
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
                          dayNum={format(day, "d", { locale: ptBR })}
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
                <div className="flex h-full w-full">
                  <div className="w-12 sm:w-16 shrink-0 border-r border-slate-300 bg-slate-50 sticky left-0 z-30 font-bold shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                    <div className="h-10 sm:h-12 sticky top-0 bg-background z-50" />
                    {hours.map((time) => {
                      const isHalf = time.endsWith(":30");
                      return (
                        <div
                          key={time}
                          className={cn("flex items-start justify-end pr-1.5 sm:pr-2 pt-0.5 border-t", isHalf ? "border-slate-300" : "border-slate-300/80")}
                          style={{ height: SLOT_HEIGHT }}
                        >
                          <span className={cn("text-[9px] sm:text-[11px] font-bold", isHalf ? "text-slate-500" : "text-slate-900")}>{time}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div
                    className="flex flex-1 relative"
                    style={{
                      height: HOUR_HEIGHT * 15,
                      width: "100%"
                    }}
                  >
                    {/* Real-time Indicator Component (Day) */}
                    {(() => {
                      const h = currentTime.getHours();
                      const m = currentTime.getMinutes();
                      if (h < 7 || h >= 22) return null;
                      if (!isToday(selectedDay)) return null;

                      const topOffset = (h - 7) * HOUR_HEIGHT + (m * PX_PER_MINUTE) + GRID_HEADER_HEIGHT;
          
                      return (
                        <div
                          className="absolute left-0 right-0 z-60 pointer-events-none flex items-center"
                          style={{ top: `${topOffset}px` }}
                        >
                          <div className="w-2 h-2 rounded-full bg-destructive -ml-1 shadow-[0_0_6px_rgba(239,68,68,0.6)] animate-pulse" />
                          <div className="h-px flex-1 bg-destructive/80" />
                          <span className="absolute -top-4 left-2 text-destructive text-[8px] px-1 font-black uppercase tracking-widest opacity-70">
                            {format(currentTime, "HH:mm")}
                          </span>
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
        defaultDate={apptDefaults.date || selectedDay}
        defaultProfessionalId={apptDefaults.profId}
        defaultStartTime={apptDefaults.time}
        onDateSelect={(date) => {
          if (date.getTime() !== selectedDay.getTime()) {
            setSelectedDay(date);
          }
        }}
      />
      <BlockedSlotDialog
        open={blockDialogOpen}
        onOpenChange={setBlockDialogOpen}
        blockId={blockDefaults.id}
        defaultProfessionalId={blockDefaults.profId}
        defaultDate={blockDefaults.date}
        defaultStartTime={blockDefaults.startTime}
        defaultEndTime={blockDefaults.endTime}
        defaultNotes={blockDefaults.notes}
      />
      <AppointmentDetailDialog appointment={selectedAppointment} open={detailOpen} onOpenChange={setDetailOpen} />

      <AlertDialog 
        open={!!confirmDeleteBlockId} 
        onOpenChange={(v) => !v && setConfirmDeleteBlockId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir bloqueio de horário?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O horário voltará a ficar disponível para novos agendamentos na agenda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingBlock}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => confirmDeleteBlockId && deleteBlockedSlot(confirmDeleteBlockId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeletingBlock}
            >
              {isDeletingBlock ? "Excluindo..." : "Excluir Bloqueio"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reschedule confirmation dialog */}
      <AlertDialog
        open={!!pendingReschedule}
        onOpenChange={(open) => {
          if (!open) {
            setPendingReschedule(null);
            setDraggingApptId(null); // Clear drag state if cancelled
          }
        }}
      >
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
      className="flex-1 min-w-0 border-r border-slate-300 last:border-r-0 cursor-pointer"
      onDoubleClick={onDoubleClick}
    >
      <div className="h-12 flex flex-col items-center justify-center border-b border-slate-300 bg-background sticky top-0 z-40">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{dayAbbr}</span>
        <span className={cn("text-sm font-bold", today ? "text-primary" : "text-foreground")}>{dayNum}</span>
      </div>
      <div className="relative" ref={colRef}>
        {hours.map((time) => (
          <div
            key={time}
            className={cn("border-t hover:bg-accent/30 transition-colors cursor-pointer", time.endsWith(":30") ? "border-slate-300/50" : "border-slate-300")}
            style={{ height: SLOT_HEIGHT }}
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
    <div className="flex-1 min-w-0 border-r border-slate-300 last:border-r-0">
      <div className="h-10 sm:h-12 flex items-center justify-center border-b border-slate-300 bg-background sticky top-0 z-40 px-0.5 sm:px-2 text-center overflow-hidden">
        <span className="text-[7px] sm:text-[10px] font-black text-foreground/80 truncate text-center leading-none uppercase tracking-tighter sm:tracking-[0.15em]">
          {(profName || "Prof").split(" ")[0]}
        </span>
      </div>
      <div className="relative" ref={colRef}>
        {hours.map((time) => (
          <div
            key={time}
            className={cn("border-t hover:bg-accent/30 transition-colors cursor-pointer", time.endsWith(":30") ? "border-slate-300/50" : "border-slate-300")}
            style={{ height: SLOT_HEIGHT }}
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
