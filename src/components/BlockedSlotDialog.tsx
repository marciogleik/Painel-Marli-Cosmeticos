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
import { CalendarIcon, Loader2, Ban, Repeat, Trash2, Edit2, Clock, Calendar as CalIcon } from "lucide-react";
import { toast } from "sonner";

type RecurrenceType = "pontual" | "semanal" | "mensal";

const timeSlots = Array.from({ length: 30 }, (_, i) => {
  const hour = Math.floor(i / 2) + 7;
  const min = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${min}`;
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
  const { data: professionals = [] } = useProfessionals();

  const [professionalId, setProfessionalId] = useState(defaultProfessionalId || "");
  const [date, setDate] = useState<Date | undefined>(defaultDate || new Date());
  const [startTime, setStartTime] = useState(defaultStartTime || "");
  const [endTime, setEndTime] = useState(defaultEndTime || "");
  const [reason, setReason] = useState(defaultNotes || "");
  const [recurrence, setRecurrence] = useState<RecurrenceType>("pontual");
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [internalBlockId, setInternalBlockId] = useState(blockId || null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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
    enabled: !!professionalId && open,
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

  const generateDates = (start: Date, end: Date, type: RecurrenceType): Date[] => {
    const dates: Date[] = [start];
    if (type === "pontual") return dates;
    const addFn = type === "semanal" ? (d: Date) => addWeeks(d, 1) : (d: Date) => addMonths(d, 1);
    let current = addFn(start);
    while (isBefore(current, end) || isEqual(current, end)) {
      dates.push(current);
      current = addFn(current);
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

      const commonData = {
        professional_id: professionalId,
        date: format(date, "yyyy-MM-dd"),
        start_time: startTime + ":00",
        end_time: endTime + ":00",
        notes: reason.trim() || null,
        client_name: "BLOQUEIO",
        status: "bloqueado",
      };

      if (internalBlockId) {
        // Update existing block
        const { error } = await supabase
          .from("appointments")
          .update(commonData)
          .eq("id", internalBlockId);
        if (error) throw error;
        return 1;
      } else {
        // Insert new block(s)
        const dates = generateDates(date, endDate || date, recurrence);
        const rows = dates.map((d) => ({
          ...commonData,
          date: format(d, "yyyy-MM-dd"),
        }));

        const { error } = await supabase.from("appointments").insert(rows);
        if (error) throw error;
        return dates.length;
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
            : `${count} bloqueios criados com sucesso!`
      );
      if (internalBlockId) {
        // Reset after edit
        setInternalBlockId(null);
        setStartTime("");
        setEndTime("");
        setReason("");
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
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("appointments").delete().eq("id", id);
      if (error) throw error;
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
    setInternalBlockId(block.id);
    setProfessionalId(block.professional_id);
    setDate(parseISO(block.date));
    setStartTime(block.start_time.slice(0, 5));
    setEndTime(block.end_time.slice(0, 5));
    setReason(block.notes || "");
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Ban className="w-5 h-5 text-destructive" />
            {internalBlockId ? "Editar Bloqueio" : "Bloquear Horário"}
          </DialogTitle>
          <DialogDescription>
            Gerencie as ausências e bloqueios de horário das profissionais.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Profissional *</Label>
            <Select value={professionalId} onValueChange={setProfessionalId}>
              <SelectTrigger><SelectValue placeholder="Selecione a profissional" /></SelectTrigger>
              <SelectContent>
                {professionals.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : "Selecione a data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Início *</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger><SelectValue placeholder="Início" /></SelectTrigger>
                <SelectContent>
                  {timeSlots.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Fim *</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger><SelectValue placeholder="Fim" /></SelectTrigger>
                <SelectContent>
                  {timeSlots.filter((t) => t > startTime).map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!internalBlockId && (
            <>
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Repeat className="w-3.5 h-3.5" /> Recorrência
                </Label>
                <RadioGroup
                  value={recurrence}
                  onValueChange={(v) => setRecurrence(v as RecurrenceType)}
                  className="flex gap-4"
                >
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="pontual" id="rec-pontual" />
                    <Label htmlFor="rec-pontual" className="font-normal cursor-pointer">Pontual</Label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="semanal" id="rec-semanal" />
                    <Label htmlFor="rec-semanal" className="font-normal cursor-pointer">Semanal</Label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="mensal" id="rec-mensal" />
                    <Label htmlFor="rec-mensal" className="font-normal cursor-pointer">Mensal</Label>
                  </div>
                </RadioGroup>
              </div>

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

          <div className="space-y-2">
            <Label>Motivo (opcional)</Label>
            <Input
              placeholder="Ex: Almoço, reunião, folga..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={100}
            />
          </div>

          <Button
            onClick={() => mutation.mutate()}
            disabled={!canSubmit || mutation.isPending}
            className="w-full"
            variant={internalBlockId ? "default" : "destructive"}
          >
            {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Ban className="w-4 h-4 mr-2" />}
            {internalBlockId ? "Salvar Alterações" : "Bloquear Horário"}
          </Button>

          {internalBlockId && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                setInternalBlockId(null);
                setStartTime("");
                setEndTime("");
                setReason("");
              }}
            >
              Cancelar Edição / Novo Bloqueio
            </Button>
          )}

          {professionalId && (
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
                  {existingBlocks.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic text-center py-4">
                      Nenhum bloqueio futuro encontrado.
                    </p>
                  ) : (
                    existingBlocks.map((block: any) => (
                      <div 
                        key={block.id}
                        className={cn(
                          "group p-3 rounded-lg border bg-card transition-all hover:border-primary/50",
                          internalBlockId === block.id && "ring-2 ring-primary border-transparent"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px] py-0 px-1 font-normal bg-muted">
                                <CalIcon className="w-2.5 h-2.5 mr-1" />
                                {format(parseISO(block.date), "dd/MM/yy")}
                              </Badge>
                              <Badge variant="outline" className="text-[10px] py-0 px-1 font-normal bg-muted">
                                <Clock className="w-2.5 h-2.5 mr-1" />
                                {block.start_time.slice(0, 5)} - {block.end_time.slice(0, 5)}
                              </Badge>
                            </div>
                            <p className="text-xs font-medium leading-none mt-1">
                              {block.notes || "Sem observações"}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-7 h-7 hover:bg-muted"
                              onClick={() => handleEdit(block)}
                              title="Editar"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-7 h-7 hover:bg-destructive/10 text-destructive"
                              onClick={() => handleDeleteClick(block.id)}
                              title="Excluir"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        <AlertDialog open={!!confirmDeleteId} onOpenChange={(v) => !v && setConfirmDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Bloqueio?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. O horário voltará a ficar disponível na agenda.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => confirmDeleteId && deleteMutation.mutate(confirmDeleteId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
};

export default BlockedSlotDialog;
