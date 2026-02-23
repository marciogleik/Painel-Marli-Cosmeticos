import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfessionals } from "@/hooks/useClinicData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { cn } from "@/lib/utils";
import { format, addDays, addWeeks, addMonths, isBefore, isEqual } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2, Ban, Repeat } from "lucide-react";
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
  defaultProfessionalId?: string;
  defaultDate?: Date;
  defaultStartTime?: string;
}

const BlockedSlotDialog = ({
  open,
  onOpenChange,
  defaultProfessionalId,
  defaultDate,
  defaultStartTime,
}: BlockedSlotDialogProps) => {
  const queryClient = useQueryClient();
  const { data: professionals = [] } = useProfessionals();

  const [professionalId, setProfessionalId] = useState(defaultProfessionalId || "");
  const [date, setDate] = useState<Date | undefined>(defaultDate || new Date());
  const [startTime, setStartTime] = useState(defaultStartTime || "");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [recurrence, setRecurrence] = useState<RecurrenceType>("pontual");
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Reset defaults when dialog opens with new props
  const handleOpenChange = (v: boolean) => {
    if (v) {
      setProfessionalId(defaultProfessionalId || "");
      setDate(defaultDate || new Date());
      setStartTime(defaultStartTime || "");
      setEndTime("");
      setReason("");
      setRecurrence("pontual");
      setEndDate(undefined);
    }
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
      if (recurrence !== "pontual" && !endDate) {
        throw new Error("Selecione a data final da recorrência");
      }

      const dates = generateDates(date, endDate || date, recurrence);
      const rows = dates.map((d) => ({
        professional_id: professionalId,
        date: format(d, "yyyy-MM-dd"),
        start_time: startTime + ":00",
        end_time: endTime + ":00",
        reason: reason.trim() || null,
      }));

      const { error } = await supabase.from("blocked_slots").insert(rows);
      if (error) throw error;
      return dates.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["blocked_slots"] });
      toast.success(
        count === 1
          ? "Horário bloqueado com sucesso!"
          : `${count} bloqueios criados com sucesso!`
      );
      onOpenChange(false);
    },
    onError: (err: Error) => {
      toast.error("Erro ao bloquear: " + err.message);
    },
  });

  const canSubmit =
    professionalId &&
    date &&
    startTime &&
    endTime &&
    startTime < endTime &&
    (recurrence === "pontual" || endDate);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Ban className="w-5 h-5 text-destructive" />
            Bloquear Horário
          </DialogTitle>
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
            variant="destructive"
          >
            {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Ban className="w-4 h-4 mr-2" />}
            Bloquear Horário
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlockedSlotDialog;
