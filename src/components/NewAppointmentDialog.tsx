import { useState, useEffect } from "react";
import { maskPhone } from "@/utils/masks";
import { checkAppointmentConflict } from "@/utils/appointmentConflict";
import { useOccupiedSlots } from "@/hooks/useOccupiedSlots";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  useProfessionals,
  useServicesForProfessional,
  useClients,
  type DBProfessional,
  type DBService,
} from "@/hooks/useClinicData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
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
import { Checkbox } from "@/components/ui/checkbox";
import { matchesPhone } from "@/utils/phoneUtils";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2, Search, AlertTriangle, UserPlus, User, ExternalLink, History } from "lucide-react";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface NewAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date;
  defaultProfessionalId?: string;
  defaultStartTime?: string;
}

const timeSlots = Array.from({ length: 180 }, (_, i) => {
  const totalMin = 7 * 60 + i * 5;
  const hour = Math.floor(totalMin / 60);
  const min = totalMin % 60;
  return `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
}).filter((t) => {
  const [h] = t.split(":").map(Number);
  return h >= 7 && h < 22;
});

const NewAppointmentDialog = ({
  open,
  onOpenChange,
  defaultDate,
  defaultProfessionalId,
  defaultStartTime
}: NewAppointmentDialogProps) => {
  const queryClient = useQueryClient();
  const { data: professionals = [] } = useProfessionals();

  // Form state
  const [professionalId, setProfessionalId] = useState(defaultProfessionalId || "");
  const [selectedServices, setSelectedServices] = useState<DBService[]>([]);
  const [date, setDate] = useState<Date | undefined>(defaultDate || new Date());
  const [startTime, setStartTime] = useState(defaultStartTime || "");
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [manualEndTime, setManualEndTime] = useState<string | null>(null);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [forceCreate, setForceCreate] = useState(false);
  const [showRecentServices, setShowRecentServices] = useState(false);

  // Update states when props change (sync)
  useEffect(() => {
    if (open) {
      if (defaultProfessionalId) setProfessionalId(defaultProfessionalId);
      if (defaultStartTime) setStartTime(defaultStartTime);
      if (defaultDate) setDate(defaultDate);
    }
  }, [open, defaultProfessionalId, defaultStartTime, defaultDate]);

  const services = useServicesForProfessional(professionalId);
  const { data: clientsData, isLoading: isLoadingClients } = useClients({ search: clientSearch, pageSize: 20 });
  const clients = clientsData?.data ?? [];

  const dateStr = date ? format(date, "yyyy-MM-dd") : undefined;
  const { getConflict } = useOccupiedSlots(professionalId || undefined, dateStr);

  const filteredClients = clientSearch.length >= 2
    ? clients.filter(c =>
      c.full_name.toLowerCase().includes(clientSearch.toLowerCase()) ||
      matchesPhone(c.phone, clientSearch)
    )
    : [];

  // Calculate total duration and end time
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration_minutes, 0);
  const suggestedEndTime = startTime
    ? (() => {
      const [h, m] = startTime.split(":").map(Number);
      const endMin = h * 60 + m + totalDuration;
      return `${Math.floor(endMin / 60).toString().padStart(2, "0")}:${(endMin % 60).toString().padStart(2, "0")}`;
    })()
    : "";

  const endTime = manualEndTime || suggestedEndTime;

  const toggleService = (service: DBService) => {
    setManualEndTime(null);
    setSelectedServices((prev) =>
      prev.find((s) => s.id === service.id)
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service]
    );
  };

  const selectClient = (client: { id: string; full_name: string; phone: string | null }) => {
    setSelectedClientId(client.id);
    setClientName(client.full_name);
    setClientPhone(client.phone || "");
    setClientSearch("");
    setShowRecentServices(false);
  };

  const resetForm = () => {
    setProfessionalId("");
    setSelectedServices([]);
    setDate(defaultDate || new Date());
    setStartTime("");
    setSelectedClientId(null);
    setClientName("");
    setClientPhone("");
    setClientSearch("");
    setNotes("");
    setConflictWarning(null);
    setForceCreate(false);
    setShowRecentServices(false);
  };

  const createClientMutation = useMutation({
    mutationFn: async () => {
      if (!clientName.trim() || !clientPhone.trim()) {
        throw new Error("Preencha o nome e o telefone do cliente.");
      }

      const { data, error } = await supabase
        .from("clients")
        .insert({
          full_name: clientName.trim(),
          phone: clientPhone.trim(),
          is_active: true
        })
        .select("id, full_name, phone")
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (newClient) => {
      selectClient(newClient);
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente foi incluído com sucesso.", {
        icon: <UserPlus className="w-4 h-4 text-white" />,
        className: "bg-green-600 text-white border-none",
      });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const { data: recentAppointments = [] } = useQuery({
    queryKey: ["client_recent_appointments", selectedClientId],
    queryFn: async () => {
      if (!selectedClientId) return [];
      const { data, error } = await supabase
        .from("appointments")
        .select("id, date, start_time, notes, appointment_services(service_name)")
        .eq("client_id", selectedClientId)
        .order("date", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedClientId && showRecentServices,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!date || !startTime || !professionalId || !clientName || !clientPhone.trim() || selectedServices.length === 0) {
        throw new Error("Preencha todos os campos obrigatórios (incluindo o telefone)");
      }

      const dateStr = format(date, "yyyy-MM-dd");

      // Check for time conflicts (skip if user already confirmed force)
      if (!forceCreate) {
        const conflict = await checkAppointmentConflict({
          professionalId,
          date: dateStr,
          startTime: startTime + ":00",
          endTime: endTime + ":00",
        });
        if (conflict) {
          // Instead of throwing, show warning and let user decide
          setConflictWarning(conflict);
          return null; // Abort mutation without error
        }
      }

      let effectiveClientId = selectedClientId;

      // If no client selected, try to find by phone before creating new
      if (!effectiveClientId && clientPhone.trim()) {
        const { data: existingClient } = await supabase
          .from("clients")
          .select("id")
          .eq("phone", clientPhone.trim())
          .maybeSingle();

        if (existingClient) {
          effectiveClientId = existingClient.id;
        } else {
          // Create new client if not found
          const { data: newClient, error: clientError } = await supabase
            .from("clients")
            .insert({
              full_name: clientName.trim(),
              phone: clientPhone.trim(),
              is_active: true
            })
            .select("id")
            .single();

          if (clientError) throw clientError;
          effectiveClientId = newClient.id;
        }
      }

      const { data, error } = await supabase.from("appointments").insert({
        professional_id: professionalId,
        client_id: effectiveClientId,
        client_name: clientName.trim(),
        client_phone: clientPhone.trim() || null,
        date: dateStr,
        start_time: startTime + ":00",
        end_time: endTime + ":00",
        status: "agendado",
        notes: notes.trim() || null,
      }).select().single();

      if (error) throw error;

      // Insert appointment_services
      if (data) {
        const servicesToInsert = selectedServices.map((s) => ({
          appointment_id: data.id,
          service_name: s.name,
          service_id: s.id,
          duration_minutes: s.duration_minutes,
          price: s.base_price,
        }));

        const { error: svcError } = await supabase
          .from("appointment_services")
          .insert(servicesToInsert);

        if (svcError) throw svcError;
      }

      return data;
    },
    onSuccess: (result) => {
      if (result === null) return; // Conflict warning shown, don't close
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Agendamento criado com sucesso!");
      resetForm();
      onOpenChange(false);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleForceCreate = () => {
    setConflictWarning(null);
    setForceCreate(true);
    // Trigger mutation again with force flag
    setTimeout(() => mutation.mutate(), 50);
  };

  const canSubmit = professionalId && selectedServices.length > 0 && date && startTime && clientName.trim() && clientPhone.trim();

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Novo Agendamento</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* 1. Professional */}
          <div className="space-y-2">
            <Label>Profissional *</Label>
            <Select value={professionalId} onValueChange={(v) => { setProfessionalId(v); setSelectedServices([]); }}>
              <SelectTrigger><SelectValue placeholder="Selecione a profissional" /></SelectTrigger>
              <SelectContent>
                {professionals.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} — {p.role_description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 2. Services */}
          {professionalId && (
            <div className="space-y-2">
              <Label>Serviços * {selectedServices.length > 0 && <span className="text-muted-foreground font-normal">({totalDuration} min)</span>}</Label>
              {services.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum serviço vinculado a esta profissional.</p>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Pesquisar serviço..."
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      className="pl-8 h-8 text-xs"
                    />
                  </div>
                  <div className="grid gap-2 max-h-40 overflow-y-auto border border-border rounded-lg p-3">
                    {services
                      .filter(s => s.name.toLowerCase().includes(serviceSearch.toLowerCase()))
                      .map((s) => {
                        const checked = selectedServices.some((ss) => ss.id === s.id);
                        return (
                          <label key={s.id} className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 rounded-md px-2 py-1.5 -mx-1">
                            <Checkbox checked={checked} onCheckedChange={() => toggleService(s)} />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium">{s.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">{s.duration_minutes} min</span>
                            </div>
                            {s.base_price != null && (
                              <span className="text-xs text-muted-foreground shrink-0">
                                R$ {s.base_price.toFixed(2).replace(".", ",")}
                              </span>
                            )}
                          </label>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. Date */}
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

          {/* 4. Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Início *</Label>
              <Select value={startTime} onValueChange={(v) => { setStartTime(v); setManualEndTime(null); }}>
                <SelectTrigger><SelectValue placeholder="Início" /></SelectTrigger>
                <SelectContent>
                  {timeSlots.map((t) => {
                    const conflict = totalDuration > 0 ? getConflict(t, totalDuration) : null;
                    return (
                      <SelectItem key={t} value={t}>
                        <span className="flex items-center gap-2">
                          {t}
                          {conflict && (
                            <span className="text-[10px] text-amber-500 font-normal">⚠ {conflict}</span>
                          )}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Término *</Label>
              <Select value={endTime} onValueChange={setManualEndTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Término" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((t) => {
                    // Disable times before or equal to start time
                    const isBeforeStart = startTime && t <= startTime;
                    return (
                      <SelectItem key={t} value={t} disabled={!!isBeforeStart}>
                        {t} {t === suggestedEndTime && "(Sugerido)"}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 5. Client */}
          <div className="space-y-2">
            <Label>Cliente *</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cliente por nome ou telefone..."
                  value={selectedClientId ? clientName : clientSearch}
                  onChange={(e) => {
                    if (selectedClientId) {
                      setSelectedClientId(null);
                      setClientName("");
                      setClientPhone("");
                    }
                    setClientSearch(e.target.value);
                  }}
                  className="pl-9"
                />
              </div>
              {selectedClientId && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="shrink-0"
                  onClick={() => window.open(`/clientes/${selectedClientId}`, '_blank')}
                  title="Ver perfil completo"
                >
                  <User className="w-4 h-4" />
                </Button>
              )}
            </div>

            {selectedClientId && (
              <div className="space-y-2">
                <Collapsible open={showRecentServices} onOpenChange={setShowRecentServices}>
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-purple-600 text-white hover:bg-purple-700 hover:text-white border-none h-7 px-2 text-[10px] uppercase font-bold tracking-wider"
                    >
                      <History className="w-3 h-3 mr-1.5" />
                      Exibir Últimos Serviços
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 text-xs space-y-2 border rounded-md p-3 bg-muted/30">
                    <p className="font-semibold text-muted-foreground flex items-center gap-1.5 uppercase text-[9px] tracking-tight">
                      Últimos agendamentos:
                    </p>
                    {recentAppointments.length === 0 ? (
                      <p className="italic text-muted-foreground">Nenhum histórico encontrado.</p>
                    ) : (
                      <div className="space-y-2">
                        {recentAppointments.map(apt => (
                          <div key={apt.id} className="border-b border-border last:border-0 pb-1.5 mb-1.5 last:mb-0 last:pb-0">
                            <div className="flex justify-between font-medium">
                              <span>{format(parseISO(apt.date), "dd/MM/yyyy")}</span>
                              <span>{apt.start_time.slice(0, 5)}</span>
                            </div>
                            <p className="text-muted-foreground truncate">
                              {(apt as any).appointment_services?.map((s: any) => s.service_name).join(", ") || apt.notes || "-"}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}

            {filteredClients.length > 0 && !selectedClientId && (
              <div className="border border-border rounded-lg max-h-32 overflow-y-auto">
                {filteredClients.slice(0, 8).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectClient(c)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    <span className="font-medium">{c.full_name}</span>
                    {c.phone && <span className="text-muted-foreground ml-2">{c.phone}</span>}
                  </button>
                ))}
              </div>
            )}
            {clientSearch.length >= 2 && filteredClients.length === 0 && !selectedClientId && (
              <div className="space-y-4 p-6 border border-dashed border-border rounded-lg bg-gray-50/50 flex flex-col items-center justify-center text-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-700">Não encontrei este Cliente.</p>
                  <p className="text-xs text-muted-foreground">Deseja cadastrá-lo agora?</p>
                </div>
                
                <div className="w-full space-y-3">
                  <Input
                    placeholder="Nome do cliente"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                  <Input
                    placeholder="Telefone"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(maskPhone(e.target.value))}
                  />
                  
                  <Button 
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold uppercase tracking-wider gap-2 shadow-sm h-11"
                    onClick={() => createClientMutation.mutate()}
                    disabled={createClientMutation.isPending || !clientName.trim() || !clientPhone.trim()}
                  >
                    {createClientMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UserPlus className="w-4 h-4" />
                    )}
                    Cadastrar Cliente
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* 6. Notes */}
          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              placeholder="Ex: 2/5, retorno, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              maxLength={500}
            />
          </div>

          {/* Submit */}
          <Button
            onClick={() => mutation.mutate()}
            disabled={!canSubmit || mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Agendar
          </Button>
        </div>
      </DialogContent>

      {/* Conflict confirmation dialog */}
      <AlertDialog open={!!conflictWarning} onOpenChange={(open) => { if (!open) setConflictWarning(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Conflito de Horário
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              A profissional já possui um atendimento com{" "}
              <strong>{conflictWarning}</strong> neste horário.
              <br /><br />
              Deseja agendar mesmo assim? (encaixe)
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleForceCreate} className="bg-amber-500 hover:bg-amber-600">
              Agendar Mesmo Assim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default NewAppointmentDialog;
