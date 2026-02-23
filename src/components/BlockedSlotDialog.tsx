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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2, Ban } from "lucide-react";
import { toast } from "sonner";

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

  // Reset defaults when dialog opens with new props
  const handleOpenChange = (v: boolean) => {
    if (v) {
      setProfessionalId(defaultProfessionalId || "");
      setDate(defaultDate || new Date());
      setStartTime(defaultStartTime || "");
      setEndTime("");
      setReason("");
    }
    onOpenChange(v);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!professionalId || !date || !startTime || !endTime) {
        throw new Error("Preencha todos os campos obrigatórios");
      }
      if (startTime >= endTime) {
        throw new Error("O horário final deve ser depois do inicial");
      }

      const { error } = await supabase.from("blocked_slots").insert({
        professional_id: professionalId,
        date: format(date, "yyyy-MM-dd"),
        start_time: startTime + ":00",
        end_time: endTime + ":00",
        reason: reason.trim() || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blocked_slots"] });
      toast.success("Horário bloqueado com sucesso!");
      onOpenChange(false);
    },
    onError: (err: Error) => {
      toast.error("Erro ao bloquear: " + err.message);
    },
  });

  const canSubmit = professionalId && date && startTime && endTime && startTime < endTime;

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
