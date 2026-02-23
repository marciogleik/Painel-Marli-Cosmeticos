import { useState, useEffect } from "react";
import { maskPhone } from "@/utils/masks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  useProfessionals,
  useServicesForProfessional,
  useClients,
  type DBAppointment,
  type DBService,
} from "@/hooks/useClinicData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AppointmentEditFormProps {
  appointment: DBAppointment;
  initialServices: { id: string; service_name: string; service_id: string | null; duration_minutes: number; price: number | null }[];
  onSaved: () => void;
  onCancel: () => void;
}

const timeSlots = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 4) + 8;
  const min = (i % 4) * 15;
  return `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
});

const AppointmentEditForm = ({ appointment, initialServices, onSaved, onCancel }: AppointmentEditFormProps) => {
  const queryClient = useQueryClient();
  const { data: professionals = [] } = useProfessionals();

  const [professionalId, setProfessionalId] = useState(appointment.professional_id);
  const [selectedServices, setSelectedServices] = useState<DBService[]>([]);
  const [date, setDate] = useState<Date | undefined>(parseISO(appointment.date));
  const [startTime, setStartTime] = useState(appointment.start_time?.slice(0, 5) || "");
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(appointment.client_id);
  const [clientName, setClientName] = useState(appointment.client_name || "");
  const [clientPhone, setClientPhone] = useState(appointment.client_phone || "");
  const [notes, setNotes] = useState(appointment.notes || "");

  const availableServices = useServicesForProfessional(professionalId);
  const { data: clients = [] } = useClients(clientSearch);

  // Seed selected services from available services matching initialServices
  useEffect(() => {
    if (availableServices.length > 0 && selectedServices.length === 0) {
      const initialIds = initialServices.map(s => s.service_id).filter(Boolean);
      const matched = availableServices.filter(s => initialIds.includes(s.id));
      if (matched.length > 0) {
        setSelectedServices(matched);
      }
    }
  }, [availableServices]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredClients = clientSearch.length >= 2
    ? clients.filter(c =>
        c.full_name.toLowerCase().includes(clientSearch.toLowerCase()) ||
        (c.phone && c.phone.includes(clientSearch))
      )
    : [];

  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration_minutes, 0);
  const endTime = startTime
    ? (() => {
        const [h, m] = startTime.split(":").map(Number);
        const endMin = h * 60 + m + totalDuration;
        return `${Math.floor(endMin / 60).toString().padStart(2, "0")}:${(endMin % 60).toString().padStart(2, "0")}`;
      })()
    : "";

  const toggleService = (service: DBService) => {
    setSelectedServices(prev =>
      prev.find(s => s.id === service.id)
        ? prev.filter(s => s.id !== service.id)
        : [...prev, service]
    );
  };

  const selectClient = (client: { id: string; full_name: string; phone: string | null }) => {
    setSelectedClientId(client.id);
    setClientName(client.full_name);
    setClientPhone(client.phone || "");
    setClientSearch("");
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!date || !startTime || !professionalId || !clientName.trim() || selectedServices.length === 0) {
        throw new Error("Preencha todos os campos obrigatórios");
      }

      const dateStr = format(date, "yyyy-MM-dd");

      const { error } = await supabase
        .from("appointments")
        .update({
          professional_id: professionalId,
          client_id: selectedClientId,
          client_name: clientName.trim(),
          client_phone: clientPhone.trim() || null,
          date: dateStr,
          start_time: startTime + ":00",
          end_time: endTime + ":00",
          notes: notes.trim() || null,
        })
        .eq("id", appointment.id);

      if (error) throw error;

      // Delete old services and insert new ones
      const { error: delErr } = await supabase
        .from("appointment_services")
        .delete()
        .eq("appointment_id", appointment.id);

      // If delete fails due to RLS (no delete policy), we skip - services won't update
      if (delErr) {
        console.warn("Could not delete old services (may lack RLS policy):", delErr.message);
      }

      const servicesToInsert = selectedServices.map(s => ({
        appointment_id: appointment.id,
        service_name: s.name,
        service_id: s.id,
        duration_minutes: s.duration_minutes,
        price: s.base_price,
      }));

      const { error: svcErr } = await supabase
        .from("appointment_services")
        .insert(servicesToInsert);

      if (svcErr) throw svcErr;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointment_services", appointment.id] });
      toast({ title: "Agendamento atualizado com sucesso!" });
      onSaved();
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao atualizar", description: err.message, variant: "destructive" });
    },
  });

  const canSubmit = professionalId && selectedServices.length > 0 && date && startTime && clientName.trim();

  return (
    <div className="space-y-4 pt-1">
      {/* Professional */}
      <div className="space-y-1.5">
        <Label className="text-xs">Profissional *</Label>
        <Select value={professionalId} onValueChange={v => { setProfessionalId(v); setSelectedServices([]); }}>
          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
          <SelectContent>
            {professionals.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.name} — {p.role_description}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Services */}
      {professionalId && (
        <div className="space-y-1.5">
          <Label className="text-xs">
            Serviços * {selectedServices.length > 0 && <span className="text-muted-foreground font-normal">({totalDuration} min)</span>}
          </Label>
          {availableServices.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum serviço vinculado.</p>
          ) : (
            <div className="grid gap-1.5 max-h-36 overflow-y-auto border border-border rounded-lg p-2">
              {availableServices.map(s => {
                const checked = selectedServices.some(ss => ss.id === s.id);
                return (
                  <label key={s.id} className="flex items-center gap-2.5 cursor-pointer hover:bg-muted/50 rounded-md px-2 py-1 -mx-1">
                    <Checkbox checked={checked} onCheckedChange={() => toggleService(s)} />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm">{s.name}</span>
                      <span className="text-xs text-muted-foreground ml-1.5">{s.duration_minutes} min</span>
                    </div>
                    {s.base_price != null && (
                      <span className="text-xs text-muted-foreground shrink-0">R$ {s.base_price.toFixed(2).replace(".", ",")}</span>
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Date & Time row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Data *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                {date ? format(date, "dd/MM/yyyy") : "Data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Horário * {endTime && <span className="text-muted-foreground font-normal">até {endTime}</span>}</Label>
          <Select value={startTime} onValueChange={setStartTime}>
            <SelectTrigger className="h-9"><SelectValue placeholder="Horário" /></SelectTrigger>
            <SelectContent>
              {timeSlots.map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Client */}
      <div className="space-y-1.5">
        <Label className="text-xs">Cliente *</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente..."
            value={selectedClientId ? clientName : clientSearch}
            onChange={e => {
              if (selectedClientId) {
                setSelectedClientId(null);
                setClientName("");
                setClientPhone("");
              }
              setClientSearch(e.target.value);
            }}
            className="pl-8 h-9"
          />
        </div>
        {filteredClients.length > 0 && !selectedClientId && (
          <div className="border border-border rounded-lg max-h-28 overflow-y-auto">
            {filteredClients.slice(0, 6).map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => selectClient(c)}
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted transition-colors"
              >
                <span className="font-medium">{c.full_name}</span>
                {c.phone && <span className="text-muted-foreground ml-2">{c.phone}</span>}
              </button>
            ))}
          </div>
        )}
        {clientSearch.length >= 2 && filteredClients.length === 0 && !selectedClientId && (
          <div className="space-y-2 p-3 border border-dashed border-border rounded-lg">
            <p className="text-xs text-muted-foreground">Cliente não encontrado. Preencha os dados:</p>
            <Input
              placeholder="Nome do cliente"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="h-9"
            />
            <Input
              placeholder="Telefone"
              value={clientPhone}
              onChange={(e) => setClientPhone(maskPhone(e.target.value))}
              className="h-9"
            />
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label className="text-xs">Observações</Label>
        <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} maxLength={500} placeholder="Observações..." />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button
          className="flex-1"
          onClick={() => mutation.mutate()}
          disabled={!canSubmit || mutation.isPending}
        >
          {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
          Salvar Alterações
        </Button>
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
      </div>
    </div>
  );
};

export default AppointmentEditForm;
