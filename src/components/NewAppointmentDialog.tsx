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
  type DBService,
} from "@/hooks/useClinicData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
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
import { format, parseISO, addDays, addWeeks, addMonths, addYears } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2, Search, AlertTriangle, UserPlus, User, History, GripVertical, X } from "lucide-react";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion, useDragControls } from "framer-motion";

interface NewAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate?: Date;
  defaultProfessionalId?: string;
  defaultStartTime?: string;
  onDateSelect?: (date: Date) => void;
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
  defaultStartTime,
  onDateSelect
}: NewAppointmentDialogProps) => {
  const queryClient = useQueryClient();
  const { data: professionals = [] } = useProfessionals({ onlyVisibleInAgenda: true });

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
  const [recurrence, setRecurrence] = useState("none");
  const [repeatCount, setRepeatCount] = useState("1");
  const [status, setStatus] = useState("agendado");
  const [showQuickRegister, setShowQuickRegister] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");

  // Update states when props change (sync)
  useEffect(() => {
    if (open) {
      if (defaultProfessionalId) setProfessionalId(defaultProfessionalId);
      if (defaultStartTime) setStartTime(defaultStartTime);
      
      // Only update local state if the incoming defaultDate is different from the current local date
      if (defaultDate && (!date || defaultDate.getTime() !== date.getTime())) {
        setDate(defaultDate);
      }
    }
  }, [open, defaultProfessionalId, defaultStartTime, defaultDate]);

  const services = useServicesForProfessional(professionalId);
  const { data: clientsData } = useClients({ search: clientSearch, pageSize: 20 });
  const clients = clientsData?.data ?? [];

  const dateStr = date ? format(date, "yyyy-MM-dd") : undefined;
  const { getConflict } = useOccupiedSlots(professionalId || undefined, dateStr);

  const cleanSearch = clientSearch.trim().normalize("NFC");
  const filteredClients = cleanSearch.length >= 2
    ? clients.filter(c =>
      c.full_name.normalize("NFC").toLowerCase().includes(cleanSearch.toLowerCase()) ||
      matchesPhone(c.phone, cleanSearch)
    )
    : [];

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
    setRecurrence("none");
    setRepeatCount("1");
    setStatus("agendado");
    setShowQuickRegister(false);
    setNewClientName("");
    setNewClientPhone("");
  };

  const createClientMutation = useMutation({
    mutationFn: async () => {
      if (!newClientName.trim() || !newClientPhone.trim()) {
        throw new Error("Preencha o nome e o telefone do cliente.");
      }

      const { data, error } = await supabase
        .from("clients")
        .insert({
          full_name: newClientName.trim(),
          phone: newClientPhone.trim(),
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
      toast.success("Cliente cadastrado com sucesso!", {
        icon: <UserPlus className="w-4 h-4 text-white" />,
        className: "bg-green-600 text-white border-none",
      });
      setShowQuickRegister(false);
      setNewClientName("");
      setNewClientPhone("");
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
      const datesToProcess: string[] = [dateStr];
      if (recurrence !== "none") {
        const occurrences = parseInt(repeatCount);
        let incrementFn: (d: Date, i: number) => Date;

        switch (recurrence) {
          case 'daily': incrementFn = (d, i) => addDays(d, i); break;
          case 'weekly': incrementFn = (d, i) => addWeeks(d, i); break;
          case 'biweekly': incrementFn = (d, i) => addWeeks(d, i * 2); break;
          case 'monthly': incrementFn = (d, i) => addMonths(d, i); break;
          case 'quarterly': incrementFn = (d, i) => addMonths(d, i * 3); break;
          case 'semiannual': incrementFn = (d, i) => addMonths(d, i * 6); break;
          case 'annual': incrementFn = (d, i) => addYears(d, i); break;
          default: incrementFn = (d) => d;
        }

        for (let i = 1; i < occurrences; i++) {
          datesToProcess.push(format(incrementFn(date, i), "yyyy-MM-dd"));
        }
      }

      if (!forceCreate) {
        const conflict = await checkAppointmentConflict({
          professionalId,
          date: dateStr,
          startTime: startTime + ":00",
          endTime: endTime + ":00",
        });
        if (conflict) {
          setConflictWarning(conflict);
          return null;
        }
      }

      let effectiveClientId = selectedClientId;
      if (!effectiveClientId && clientPhone.trim()) {
        const { data: existingClient } = await supabase
          .from("clients")
          .select("id")
          .eq("phone", clientPhone.trim())
          .maybeSingle();

        if (existingClient) {
          effectiveClientId = existingClient.id;
        } else {
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

      const appointmentsToInsert = datesToProcess.map(d => ({
        professional_id: professionalId,
        client_id: effectiveClientId,
        client_name: clientName.trim(),
        client_phone: clientPhone.trim() || null,
        date: d,
        start_time: startTime + ":00",
        end_time: endTime + ":00",
        status: status,
        notes: notes.trim() || null,
      }));

      const { data: createdApts, error } = await supabase
        .from("appointments")
        .insert(appointmentsToInsert)
        .select("id");

      if (error) throw error;

      if (createdApts) {
        const allServicesToInsert = createdApts.flatMap(apt => 
          selectedServices.map(s => ({
            appointment_id: apt.id,
            service_name: s.name,
            service_id: s.id,
            duration_minutes: s.duration_minutes,
            price: s.base_price,
          }))
        );

        const { error: svcError } = await supabase
          .from("appointment_services")
          .insert(allServicesToInsert);

        if (svcError) throw svcError;
      }
      return createdApts;
    },
    onSuccess: (result) => {
      if (result === null) return;
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
    setTimeout(() => mutation.mutate(), 50);
  };

  const canSubmit = professionalId && selectedServices.length > 0 && date && startTime && clientName.trim() && clientPhone.trim();

  const dragControls = useDragControls();

  return (
    <Dialog modal={false} open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v); }}>
      <DialogContent 
        hideOverlay={true}
        hideCloseButton={true}
        className="sm:max-w-lg w-[min(calc(100vw-2rem),32rem)] p-0 bg-transparent border-none shadow-none pointer-events-none flex items-center justify-center translate-y-[-50%] translate-x-[-50%]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <motion.div 
          drag
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          className="relative bg-background border-2 rounded-xl shadow-2xl p-4 sm:p-6 pointer-events-auto flex flex-col gap-4 max-h-[85vh] w-full overflow-y-auto cursor-default scrollbar-thin"
        >
          <DialogHeader 
            className="cursor-move select-none border-b pb-3 mb-2 flex flex-row items-center gap-2"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <GripVertical className="w-5 h-5 text-muted-foreground" />
            <DialogTitle className="font-display">Novo Agendamento</DialogTitle>
            <DialogDescription className="sr-only">
              Preencha os dados abaixo para criar um novo agendamento na agenda.
            </DialogDescription>
          </DialogHeader>

          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>

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
            {!professionalId && (
              <div className="bg-muted/30 border border-dashed rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Selecione uma profissional acima para visualizar os serviços disponíveis.
                </p>
              </div>
            )}

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
                    onSelect={(newDate) => {
                      if (newDate) {
                        setDate(newDate);
                        if (onDateSelect) onDateSelect(newDate);
                      }
                    }}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* 4. Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        setClientSearch(e.nativeEvent instanceof InputEvent && e.nativeEvent.data ? e.nativeEvent.data : "");
                      } else {
                        setClientSearch(e.target.value);
                      }
                    }}
                    className="pl-9"
                  />
                </div>
                {selectedClientId ? (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="shrink-0"
                    onClick={() => window.open(`/clientes/${selectedClientId}`, '_blank')}
                    title="Ver perfil completo"
                  >
                    <User className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    variant={showQuickRegister ? "default" : "outline"}
                    size="icon"
                    className={cn("shrink-0", showQuickRegister && "bg-purple-600 hover:bg-purple-700 text-white border-purple-600")}
                    onClick={() => {
                      if (!showQuickRegister && clientSearch && !newClientName) {
                        setNewClientName(clientSearch);
                      }
                      setShowQuickRegister(!showQuickRegister);
                    }}
                    title="Cadastrar Novo Cliente Rápido"
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {showQuickRegister && !selectedClientId && (
                <div className="bg-muted/40 border border-border rounded-lg p-3 space-y-3 mt-2 animate-in slide-in-from-top-2 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-purple-600" />
                  <div className="flex items-center justify-between pb-1 border-b">
                    <span className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                      <UserPlus className="w-3.5 h-3.5 text-purple-600" /> Cadastro Rápido
                    </span>
                    <button onClick={() => setShowQuickRegister(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground uppercase font-semibold">Nome Completo *</Label>
                      <Input 
                        placeholder="Ex: Maria Alice" 
                        value={newClientName} 
                        onChange={e => setNewClientName(e.target.value)} 
                        className="h-8 text-sm bg-background border-muted"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] text-muted-foreground uppercase font-semibold">Telefone (WhatsApp) *</Label>
                      <Input 
                        placeholder="(66) 99999-9999" 
                        value={newClientPhone} 
                        onChange={e => setNewClientPhone(maskPhone(e.target.value))} 
                        className="h-8 text-sm bg-background border-muted"
                        maxLength={15}
                      />
                    </div>
                  </div>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="w-full h-8 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-md shadow-purple-500/20"
                    onClick={() => createClientMutation.mutate()}
                    disabled={createClientMutation.isPending || !newClientName.trim() || newClientPhone.length < 14}
                  >
                    {createClientMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <UserPlus className="w-3.5 h-3.5 mr-1.5" />}
                    {createClientMutation.isPending ? "Cadastrando e Vinculando..." : "Salvar e Selecionar Cliente"}
                  </Button>
                </div>
              )}

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
                                {(apt as any).appointment_services?.map((s: any) => s.service_name).join(", ") || "Sem serviço registrado"}
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
            </div>

            {/* Status and Recurrence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue placeholder="Selecione o status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agendado">Agendado</SelectItem>
                    <SelectItem value="atendendo">Atendendo</SelectItem>
                    <SelectItem value="atendido">Atendido</SelectItem>
                    <SelectItem value="atrasado">Atrasado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="espera">Espera</SelectItem>
                    <SelectItem value="faltou">Faltou</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Repetir?</Label>
                <Select value={recurrence} onValueChange={(v) => { setRecurrence(v); setRepeatCount(v === "none" ? "1" : "2"); }}>
                  <SelectTrigger><SelectValue placeholder="Não repetir" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Não repetir</SelectItem>
                    <SelectItem value="daily">Diariamente</SelectItem>
                    <SelectItem value="weekly">Semanalmente</SelectItem>
                    <SelectItem value="biweekly">Quinzenalmente</SelectItem>
                    <SelectItem value="monthly">Mensalmente</SelectItem>
                    <SelectItem value="quarterly">Trimestralmente</SelectItem>
                    <SelectItem value="semiannual">Semestralmente</SelectItem>
                    <SelectItem value="annual">Anualmente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {recurrence !== "none" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantas vezes?</Label>
                  <Select value={repeatCount} onValueChange={setRepeatCount}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 9 }, (_, i) => i + 2).map(n => (
                        <SelectItem key={n} value={String(n)}>{n}x</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end pb-2">
                  <p className="text-xs text-muted-foreground">
                    Serão criados <strong>{repeatCount}</strong> agendamentos no total
                  </p>
                </div>
              </div>
            )}

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

            <Button
              onClick={() => mutation.mutate()}
              disabled={!canSubmit || mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Agendar
            </Button>
          </div>
        </motion.div>
      </DialogContent>

      <AlertDialog open={!!conflictWarning} onOpenChange={(open) => { if (!open) setConflictWarning(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Conflito de Horário
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              A profissional já possui um atendimento com <strong>{conflictWarning}</strong> neste horário.
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
