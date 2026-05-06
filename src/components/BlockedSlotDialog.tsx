import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfessionals } from "@/hooks/useClinicData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format, addDays, addWeeks, addMonths, isBefore, isEqual, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2, Ban, Repeat, Trash2, Edit2, Clock, Calendar as CalIcon, History } from "lucide-react";
import { toast } from "sonner";
import AppointmentAuditDialog from "./AppointmentAuditDialog";

// Helper to extract series_id from notes
const getSeriesId = (notes: string | null) => {
  if (!notes) return null;
  const match = notes.match(/<!--series_id:([a-f0-9-]+)-->/);
  return match ? match[1] : null;
};

// Helper to remove series_id tag from notes for display
const stripSeriesId = (notes: string | null) => {
  if (!notes) return "";
  return notes.replace(/<!--series_id:[a-f0-9-]+-->/, "").trim();
};

type RecurrenceType = "pontual" | "semanal" | "mensal";

const timeSlots = Array.from({ length: 60 }, (_, i) => {
  const hour = Math.floor(i / 4) + 7;
  const min = (i % 4) * 15;
  return `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
});

interface BlockedSlotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blockId?: string;
  defaultProfessionalId?: string;
  defaultDate?: Date;
  defaultStartTime?: string;
  defaultEndTime?: string;
  defaultNotes?: string;
}

const BlockedSlotDialog = ({
  open,
  onOpenChange,
  blockId,
  defaultProfessionalId,
  defaultDate,
  defaultStartTime,
  defaultEndTime,
  defaultNotes,
}: BlockedSlotDialogProps) => {
  const queryClient = useQueryClient();
  const { data: professionals = [] } = useProfessionals({ onlyVisibleInAgenda: true });

  const [professionalId, setProfessionalId] = useState(defaultProfessionalId || "");
  const [date, setDate] = useState<Date | undefined>(defaultDate || new Date());
  const [startTime, setStartTime] = useState(defaultStartTime || "");
  const [endTime, setEndTime] = useState(defaultEndTime || "");
  const [reason, setReason] = useState(defaultNotes || "");
  
  const quickReasons = ["Almoço", "Reunião", "Médico", "Particular", "Folga", "Evento"];

  const handleStartTimeChange = (val: string) => {
    setStartTime(val);
    // Auto-suggest end time (+1 hour if not set)
    if (val && !endTime) {
      const [h, m] = val.split(":").map(Number);
      const endH = (h + 1).toString().padStart(2, "0");
      const endTimeVal = `${endH}:${m.toString().padStart(2, "0")}`;
      if (timeSlots.includes(endTimeVal)) {
        setEndTime(endTimeVal);
      }
    }
  };
  const [recurrence, setRecurrence] = useState<RecurrenceType>("pontual");
  const [selectedDays, setSelectedDays] = useState<number[]>([]); // 0=Sun, 1=Mon...
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [internalBlockId, setInternalBlockId] = useState(blockId || null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteSeries, setConfirmDeleteSeries] = useState<boolean>(false);
  const [editingSeriesId, setEditingSeriesId] = useState<string | null>(null);
  const [auditOpen, setAuditOpen] = useState(false);
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);

  // Fetch existing blocks for this professional
  const { data: existingBlocks = [], isLoading: isLoadingBlocks } = useQuery({
    queryKey: ["professional-blocks", professionalId],
    queryFn: async () => {
      if (!professionalId) return [];
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("status", "bloqueado")
        .eq("professional_id", professionalId)
        .gte("date", format(new Date(), "yyyy-MM-dd"))
        .order("date", { ascending: true })
        .order("start_time", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!professionalId && professionalId !== "all" && open,
  });

  // Reset/sync state when dialog opens or defaults change
  useEffect(() => {
    if (open) {
      setProfessionalId(defaultProfessionalId || "");
      setDate(defaultDate || new Date());
      setStartTime(defaultStartTime || "");
      setEndTime(defaultEndTime || "");
      setReason(defaultNotes || "");
      setRecurrence("pontual");
      setEndDate(undefined);
      setInternalBlockId(blockId || null);
    }
  }, [open, defaultProfessionalId, defaultDate, defaultStartTime, defaultEndTime, defaultNotes, blockId]);

  const handleOpenChange = (v: boolean) => {
    onOpenChange(v);
  };

  const generateDates = (start: Date, end: Date, type: RecurrenceType, days: number[]): Date[] => {
    const dates: Date[] = [];
    let current = new Date(start);
    
    while (isBefore(current, end) || isEqual(current, end)) {
      if (type === "pontual") {
        dates.push(current);
        break;
      }
      
      const dayOfWeek = current.getDay();
      
      if (type === "semanal") {
        if (days.length === 0 || days.includes(dayOfWeek)) {
          dates.push(new Date(current));
        }
      } else if (type === "mensal") {
        dates.push(new Date(current));
      }
      
      current = addDays(current, 1);
      // Safety break to prevent infinite loops (max 1 year)
      if (dates.length > 366) break;
    }
    
    return dates;
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!professionalId || !date || !startTime || !endTime) {
        throw new Error("Preencha todos os campos obrigatórios");
      }
      if (startTime >= endTime) {
        throw new Error("O horário final deve ser depois do inicial");
      }
      if (!blockId && recurrence !== "pontual" && !endDate) {
        throw new Error("Selecione a data final da recorrência");
      }

      const seriesId = recurrence !== "pontual" ? crypto.randomUUID() : null;
      const notesWithSeries = seriesId 
        ? `${reason.trim()} <!--series_id:${seriesId}-->`
        : reason.trim();

      const commonData = {
        date: format(date, "yyyy-MM-dd"),
        start_time: startTime + ":00",
        end_time: endTime + ":00",
        notes: notesWithSeries || null,
        client_name: "BLOQUEIO",
        status: "bloqueado",
      };

      const profIds = professionalId === "all" 
        ? professionals.map(p => p.id)
        : [professionalId];

      if (internalBlockId && !editingSeriesId) {
        // Update single existing block
        const { error } = await supabase
          .from("appointments")
          .update(commonData)
          .eq("id", internalBlockId);
        if (error) throw error;
        return 1;
      } else {
        // Handle New Block or Series Update
        if (editingSeriesId) {
          // Delete old series first
          const { error: delError } = await supabase
            .from("appointments")
            .delete()
            .like("notes", `%<!--series_id:${editingSeriesId}-->%`);
          if (delError) throw delError;
        }

        // Insert new block(s)
        const dates = generateDates(date, endDate || date, recurrence, selectedDays);
        const rows: any[] = [];
        
        profIds.forEach(pId => {
          dates.forEach(d => {
            rows.push({
              ...commonData,
              professional_id: pId,
              date: format(d, "yyyy-MM-dd"),
            });
          });
        });

        if (rows.length === 0) {
          throw new Error("Nenhuma data encontrada para os dias selecionados");
        }

        const { error } = await supabase.from("appointments").insert(rows);
        if (error) throw error;
        return rows.length;
      }
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["professional-blocks", professionalId] });
      toast.success(
        internalBlockId 
          ? "Bloqueio atualizado com sucesso!"
            : count === 1
              ? "Horário bloqueado com sucesso!"
              : `Bloqueio realizado com sucesso (${count} registros)!`
      );
      if (internalBlockId || editingSeriesId) {
        // Reset after edit
        setInternalBlockId(null);
        setEditingSeriesId(null);
        setStartTime("");
        setEndTime("");
        setReason("");
        setRecurrence("pontual");
        setSelectedDays([]);
      } else {
        onOpenChange(false);
      }
    },
    onError: (err: Error) => {
      toast.error("Erro ao salvar: " + err.message);
    },
  });

  const canSubmit =
    professionalId &&
    date &&
    startTime &&
    endTime &&
    startTime < endTime &&
    (internalBlockId || recurrence === "pontual" || endDate);

  const deleteMutation = useMutation({
    mutationFn: async ({ id, sid }: { id: string; sid?: string | null }) => {
      if (sid) {
        // Delete entire series
        const { error } = await supabase
          .from("appointments")
          .delete()
          .like("notes", `%<!--series_id:${sid}-->%`);
        if (error) throw error;
      } else {
        // Delete single block
        const { error } = await supabase.from("appointments").delete().eq("id", id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["professional-blocks", professionalId] });
      toast.success("Bloqueio removido!");
      if (internalBlockId) setInternalBlockId(null);
    },
    onError: (err: Error) => {
      toast.error("Erro ao remover: " + err.message);
    },
  });

  const handleEdit = (block: any) => {
    const sid = getSeriesId(block.notes);
    setInternalBlockId(block.id);
    setEditingSeriesId(sid);
    setProfessionalId(block.professional_id);
    setDate(parseISO(block.date));
    setStartTime(block.start_time.slice(0, 5));
    setEndTime(block.end_time.slice(0, 5));
    setReason(stripSeriesId(block.notes));
    
    if (sid) {
      setRecurrence("semanal");
      // Note: We don't have the original selectedDays or EndDate easily.
      // We could infer them or just let the user re-select.
      // For now, let's just set the recurrence to weekly.
      setEndDate(undefined); 
    } else {
      setRecurrence("pontual");
    }
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <Ban className="w-4 h-4 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-lg font-display font-black tracking-tight uppercase">
                {internalBlockId ? "Editar Bloqueio" : "Bloquear Horário"}
              </DialogTitle>
              <DialogDescription className="text-[9px] font-bold uppercase tracking-wider opacity-60">
                Gestão de Ausências
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-2.5 pt-1">
          <div className="space-y-1">
            <Label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider opacity-70">
              <Clock className="w-3 h-3" /> Profissional *
            </Label>
            <Select value={professionalId} onValueChange={setProfessionalId}>
              <SelectTrigger className="h-9 rounded-lg border-border/60">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="font-bold text-primary text-xs">
                  ✨ Todos os Profissionais
                </SelectItem>
                {professionals.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="text-xs">{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider opacity-70">
              <CalIcon className="w-3 h-3" /> Data *
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full h-9 justify-start text-left font-normal text-xs rounded-lg border-border/60", !date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-1.5 h-3.5 w-3.5 opacity-50" />
                  {date ? format(date, "dd 'de' MMMM", { locale: ptBR }) : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className="p-2 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider opacity-70">
                <Clock className="w-3 h-3" /> Início *
              </Label>
              <Select value={startTime} onValueChange={handleStartTimeChange}>
                <SelectTrigger className="h-9 rounded-lg border-border/60 text-xs"><SelectValue placeholder="Início" /></SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    {timeSlots.map((t) => (
                      <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider opacity-70">
                <Clock className="w-3 h-3" /> Fim *
              </Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="h-9 rounded-lg border-border/60 text-xs"><SelectValue placeholder="Fim" /></SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    {timeSlots.filter((t) => t > startTime).map((t) => (
                      <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!internalBlockId && (
            <>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider opacity-70">
                  <Repeat className="w-3 h-3" /> Recorrência
                </Label>
                <RadioGroup
                  value={recurrence}
                  onValueChange={(v) => {
                    setRecurrence(v as RecurrenceType);
                    if (v === "semanal" && selectedDays.length === 0 && date) {
                      setSelectedDays([date.getDay()]);
                    }
                  }}
                  className="flex gap-4"
                >
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="pontual" id="rec-pontual" className="h-3.5 w-3.5" />
                    <Label htmlFor="rec-pontual" className="text-xs font-normal cursor-pointer">Pontual</Label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="semanal" id="rec-semanal" className="h-3.5 w-3.5" />
                    <Label htmlFor="rec-semanal" className="text-xs font-normal cursor-pointer">Recorrente</Label>
                  </div>
                </RadioGroup>
              </div>

              {recurrence === "semanal" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <Label className="text-[10px] font-bold uppercase tracking-widest opacity-60">Dias da Semana</Label>
                  <div className="flex justify-between gap-1">
                    {["D", "S", "T", "Q", "Q", "S", "S"].map((day, idx) => {
                      const isSelected = selectedDays.includes(idx);
                      return (
                        <Button
                          key={idx}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          className={cn(
                            "w-9 h-9 p-0 text-[10px] font-bold rounded-lg transition-all",
                            isSelected ? "bg-primary shadow-sm" : "border-border/60 text-muted-foreground hover:bg-muted"
                          )}
                          onClick={() => {
                            setSelectedDays(prev => 
                              prev.includes(idx) ? prev.filter(d => d !== idx) : [...prev, idx]
                            );
                          }}
                        >
                          {day}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

              {recurrence !== "pontual" && (
                <div className="space-y-2">
                  <Label>Repetir até *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP", { locale: ptBR }) : "Selecione a data final"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(d) => !date || isBefore(d, date)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </>
          )}

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider opacity-70">Motivo (opcional)</Label>
            <div className="flex flex-wrap gap-1 mb-1.5">
              {quickReasons.map(r => (
                <Badge
                  key={r}
                  variant="outline"
                  className={cn(
                    "cursor-pointer hover:bg-primary/10 transition-all text-[8px] font-bold uppercase tracking-wider px-1.5 py-0 rounded-md",
                    reason === r && "bg-primary/20 border-primary/50 text-primary"
                  )}
                  onClick={() => setReason(r)}
                >
                  {r}
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Ex: Almoço, folga..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-9 text-xs rounded-lg border-border/60"
              maxLength={100}
            />
          </div>

          <Button
            onClick={() => mutation.mutate()}
            disabled={!canSubmit || mutation.isPending}
            className={cn(
                "w-full h-10 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all active:scale-[0.98]",
                internalBlockId ? "bg-primary shadow-md shadow-primary/10" : "bg-destructive hover:bg-destructive/90 shadow-md shadow-destructive/10"
            )}
          >
            {mutation.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> : <Ban className="w-3.5 h-3.5 mr-1.5" />}
            {internalBlockId ? "Salvar" : "Confirmar"}
          </Button>

          {professionalId === "all" && (
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl animate-in fade-in zoom-in duration-300">
               <p className="text-[10px] font-black uppercase tracking-widest text-primary text-center">
                 Este bloqueio será aplicado a todos os {professionals.length} profissionais visíveis na agenda.
               </p>
            </div>
          )}

          {internalBlockId && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs font-bold uppercase tracking-widest"
              onClick={() => {
                setInternalBlockId(null);
                setEditingSeriesId(null);
                setStartTime("");
                setEndTime("");
                setReason("");
              }}
            >
              Cancelar Edição / Novo Bloqueio
            </Button>
          )}

          {professionalId && professionalId !== "all" && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Próximos Bloqueios
                </h4>
                {isLoadingBlocks && <Loader2 className="w-3 h-3 animate-spin" />}
              </div>

              <ScrollArea className="h-[180px] pr-3 -mr-3">
                <div className="space-y-2">
                  {(() => {
                    // Group blocks by series_id
                    const groupedBlocks: any[] = [];
                    const seriesProcessed = new Set();

                    existingBlocks.forEach((block: any) => {
                      const sid = getSeriesId(block.notes);
                      if (sid) {
                        if (!seriesProcessed.has(sid)) {
                          groupedBlocks.push({ ...block, isSeries: true, sid });
                          seriesProcessed.add(sid);
                        }
                      } else {
                        groupedBlocks.push({ ...block, isSeries: false });
                      }
                    });

                    if (groupedBlocks.length === 0) {
                      return (
                        <p className="text-xs text-muted-foreground italic text-center py-4">
                          Nenhum bloqueio futuro encontrado.
                        </p>
                      );
                    }

                    return groupedBlocks.map((block: any) => (
                      <div 
                        key={block.id}
                        className={cn(
                          "group p-2 rounded-lg border bg-card transition-all hover:border-primary/50",
                          internalBlockId === block.id && "ring-1 ring-primary border-transparent"
                        )}
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              {block.isSeries ? (
                                <Badge variant="secondary" className="text-[8px] py-0 px-1 font-black uppercase tracking-tighter bg-primary/10 text-primary">
                                  <Repeat className="w-2 h-2 mr-1" />
                                  Série
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-[9px] py-0 px-1 font-normal bg-muted">
                                  {format(parseISO(block.date), "dd/MM")}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-[9px] py-0 px-1 font-normal bg-muted">
                                {block.start_time.slice(0, 5)} - {block.end_time.slice(0, 5)}
                              </Badge>
                            </div>
                            <p className="text-[10px] font-medium leading-tight truncate mt-0.5">
                              {stripSeriesId(block.notes) || "Sem motivo"}
                            </p>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-6 h-6 hover:bg-muted"
                              onClick={() => {
                                setSelectedAuditId(block.id);
                                setAuditOpen(true);
                              }}
                            >
                              <History className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-6 h-6 hover:bg-muted"
                              onClick={() => handleEdit(block)}
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-6 h-6 hover:bg-destructive/10 text-destructive"
                              onClick={() => {
                                const sid = getSeriesId(block.notes);
                                setConfirmDeleteId(block.id);
                                setConfirmDeleteSeries(!!sid);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        <AlertDialog open={!!confirmDeleteId} onOpenChange={(v) => !v && setConfirmDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{confirmDeleteSeries ? "Excluir Série de Bloqueios?" : "Excluir Bloqueio?"}</AlertDialogTitle>
              <AlertDialogDescription>
                {confirmDeleteSeries 
                  ? "Este bloqueio faz parte de uma recorrência. Deseja excluir TODOS os bloqueios desta série?" 
                  : "Esta ação não pode ser desfeita. O horário voltará a ficar disponível na agenda."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => {
                  if (confirmDeleteId) {
                    const block = existingBlocks.find((b: any) => b.id === confirmDeleteId);
                    const sid = confirmDeleteSeries ? getSeriesId(block?.notes) : null;
                    deleteMutation.mutate({ id: confirmDeleteId, sid });
                  }
                  setConfirmDeleteId(null);
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir {confirmDeleteSeries ? "Série" : "Bloqueio"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
      <AppointmentAuditDialog 
        recordId={selectedAuditId || ""}
        open={auditOpen}
        onOpenChange={setAuditOpen}
      />
    </Dialog>
  );
};

export default BlockedSlotDialog;
