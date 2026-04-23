import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, History, Calendar, User, UserCog, Clock, Loader2, Filter, ArrowRight, ShieldCheck, Scissors, X as XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { statusConfig, useProfessionals, useServices } from "@/hooks/useClinicData";
import { cn } from "@/lib/utils";
import AppointmentDetailDialog from "@/components/AppointmentDetailDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AppointmentAuditDialog from "@/components/AppointmentAuditDialog";
import { useAuth } from "@/hooks/useAuth";

const HistoricPage = () => {
    const { user } = useAuth();
    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedProfessional, setSelectedProfessional] = useState<string>("all");
    const [selectedService, setSelectedService] = useState<string>("all");
    const [dateFrom, setDateFrom] = useState<string>("");
    const [dateTo, setDateTo] = useState<string>("");
    const [auditAction, setAuditAction] = useState<string>("all");
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [auditHistoryOpen, setAuditHistoryOpen] = useState(false);
    const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

    const { data: professionals = [] } = useProfessionals(true);
    const { data: servicesList = [] } = useServices(true);

    // Verifica se é gestora
    const { data: isGestor } = useQuery({
        queryKey: ["my-role-gestor", user?.id],
        queryFn: async () => {
            if (!user?.id) return false;
            const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "gestor" });
            return !!data;
        },
        enabled: !!user?.id,
    });

    // Busca o registro profissional da usuária logada
    const { data: currentProfessional } = useQuery({
        queryKey: ["my-professional", user?.id],
        queryFn: async () => {
            if (!user?.id) return null;
            const { data } = await supabase.from("professionals").select("id").eq("user_id", user.id).single();
            return data ?? null;
        },
        enabled: !!user?.id,
    });

    // Não-gestoras só veem seus próprios agendamentos
    useEffect(() => {
        if (isGestor === false && currentProfessional?.id) {
            setSelectedProfessional(currentProfessional.id);
        }
    }, [isGestor, currentProfessional?.id]);

    const { data: appointments = [], isLoading } = useQuery({
        queryKey: ["global_history", selectedProfessional, selectedService, dateFrom, dateTo],
        queryFn: async () => {
            let query = supabase
                .from("appointments")
                .select("*, appointment_services(*)")
                .order("date", { ascending: false })
                .order("start_time", { ascending: false });

            if (selectedProfessional !== "all") query = query.eq("professional_id", selectedProfessional);
            if (dateFrom) query = query.gte("date", dateFrom);
            if (dateTo) query = query.lte("date", dateTo);

            const { data, error } = await query.limit(1000);
            if (error) throw error;

            let result = data ?? [];

            // Client-side filter for services since it's a related table
            if (selectedService !== "all") {
                result = result.filter(apt =>
                    apt.appointment_services?.some((s: any) => s.service_id === selectedService)
                );
            }

            return result;
        },
    });

    const { data: logs = [], isLoading: isLoadingLogs } = useQuery({
        queryKey: ["activity_logs", dateFrom, dateTo],
        queryFn: async () => {
            let query = supabase
                .from("activity_logs" as any)
                .select("*")
                .order("created_at", { ascending: false });

            if (dateFrom) query = query.gte("created_at", `${dateFrom}T00:00:00`);
            if (dateTo) query = query.lte("created_at", `${dateTo}T23:59:59`);

            const { data, error } = await query.limit(500);
            if (error) return []; // Table might not exist yet
            return data ?? [];
        },
    });

    const clearFilters = () => {
        setSearch("");
        setSelectedStatus("all");
        setSelectedProfessional("all");
        setSelectedService("all");
        setDateFrom("");
        setDateTo("");
        setAuditAction("all");
    };

    // Não-gestoras não podem limpar o filtro de profissional para "all"
    const handleClearFilters = () => {
        setSearch("");
        setSelectedStatus("all");
        setSelectedService("all");
        setDateFrom("");
        setDateTo("");
        setAuditAction("all");
        // Mantém o filtro da própria profissional se não for gestora
        if (isGestor !== false) {
            setSelectedProfessional("all");
        }
    };

    const filtered = useMemo(() => {
        return appointments.filter((apt) => {
            const matchesSearch =
                !search ||
                (apt.client_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
                (apt.notes ?? "").toLowerCase().includes(search.toLowerCase());

            const matchesStatus = selectedStatus === "all" || apt.status === selectedStatus;

            return matchesSearch && matchesStatus;
        });
    }, [appointments, search, selectedStatus]);

    const auditLogs = useMemo(() => {
        return logs.filter((log: any) => {
            const matchesSearch = !search || 
                (log.user_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
                (log.new_data?.client_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
                (JSON.stringify(log.new_data ?? {})).toLowerCase().includes(search.toLowerCase()) ||
                (JSON.stringify(log.old_data ?? {})).toLowerCase().includes(search.toLowerCase());
            
            const matchesAction = auditAction === "all" || log.action === auditAction;
            
            return matchesSearch && matchesAction;
        });
    }, [logs, search, auditAction]);

    const proMap = new Map(professionals.map((p) => [p.id, p.name]));

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent">
      {/* Header Hub Style */}
      <div className="px-4 sm:px-8 pt-8 sm:pt-12 pb-6 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 bg-primary/10 rounded-lg">
            <History className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs font-black tracking-[0.3em] text-primary uppercase">Rastreabilidade & Auditoria</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tighter text-foreground uppercase leading-none">
          Histórico
        </h1>
        <p className="text-muted-foreground font-medium max-w-md pt-1">
          Acompanhe todos os eventos, agendamentos e alterações realizadas no sistema.
        </p>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="appointments" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 sm:px-8 mb-6 shrink-0">
          <div className="flex overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
            <TabsList className="inline-flex h-12 w-max items-center justify-center rounded-2xl bg-background/40 p-1.5 text-muted-foreground border border-white/10 shadow-xl backdrop-blur-md ring-1 ring-white/5">
              <TabsTrigger 
                value="appointments" 
                className="rounded-xl px-6 py-2 text-xs font-black uppercase tracking-widest transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:ring-1 data-[state=active]:ring-white/10 gap-2"
              >
                <Calendar className="w-3.5 h-3.5" />
                Agendamentos
              </TabsTrigger>
              {/* Aba Auditoria: somente para gestoras */}
              {isGestor && (
                <TabsTrigger 
                  value="logs" 
                  className="rounded-xl px-6 py-2 text-xs font-black uppercase tracking-widest transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:ring-1 data-[state=active]:ring-white/10 gap-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Auditoria
                </TabsTrigger>
              )}
            </TabsList>
          </div>
        </div>

        <TabsContent value="appointments" className="flex-1 data-[state=active]:flex data-[state=active]:flex-col overflow-hidden m-0 data-[state=inactive]:hidden">
          <div className="px-4 sm:px-8 py-6 shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 bg-background/40 backdrop-blur-md border-y border-white/10 shadow-lg">
            <div className="relative group lg:col-span-3">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar cliente..."
                className="pl-10 h-11 rounded-xl bg-white/5 border-white/10 focus:border-primary/40 focus:ring-primary/20 transition-all font-bold text-[10px] uppercase tracking-widest"
              />
            </div>

            <div className="flex gap-2 lg:col-span-3">
              <div className="relative flex-1">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="bg-white/5 rounded-xl h-11 border-white/10 focus:border-primary/40 text-[10px] font-black uppercase tracking-widest px-2"
                />
              </div>
              <div className="relative flex-1">
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="bg-white/5 rounded-xl h-11 border-white/10 focus:border-primary/40 text-[10px] font-black uppercase tracking-widest px-2"
                />
              </div>
            </div>

            {/* Filtro de profissional: só visível para gestoras */}
            {isGestor && (
              <div className="relative group lg:col-span-2">
                <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
                  <SelectTrigger className="h-11 rounded-xl bg-white/5 border-white/10 focus:ring-primary/20 font-bold text-[10px] uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <UserCog className="w-3.5 h-3.5 text-muted-foreground/60" />
                      <SelectValue placeholder="Profissional" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-white/10 bg-popover z-50">
                    <SelectItem value="all" className="font-bold text-[10px] uppercase tracking-widest">Todas as Profissionais</SelectItem>
                    {professionals.map(p => (
                      <SelectItem key={p.id} value={p.id} className="font-bold text-[10px] uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-black text-primary">
                            {p.avatar_initials || p.name.slice(0, 2).toUpperCase()}
                          </div>
                          {p.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="relative lg:col-span-3">
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="h-11 rounded-xl bg-white/5 border-white/10 focus:ring-primary/20 font-bold text-[10px] uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground/60" />
                    <SelectValue placeholder="Serviço" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-white/10 bg-popover z-50">
                  <SelectItem value="all" className="font-bold text-[10px] uppercase tracking-widest">Todos os Serviços</SelectItem>
                  {servicesList.map(s => (
                    <SelectItem key={s.id} value={s.id} className="font-bold text-[10px] uppercase tracking-widest">
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-end lg:col-span-1">
              <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleClearFilters}
                  className="h-11 w-11 rounded-xl bg-primary/10 hover:bg-destructive/20 text-primary hover:text-destructive border border-primary/20 shrink-0 shadow-lg shadow-primary/5"
                  title="Limpar Filtros"
              >
                  <XIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="px-4 sm:px-8 pb-4 shrink-0 flex items-center gap-3 overflow-x-auto my-4 scrollbar-hide py-1">
            {["all", "agendado", "confirmado", "atendido", "cancelado", "falta"].map((s) => {
              const cfg = statusConfig[s as keyof typeof statusConfig] || { bgClass: "bg-muted text-muted-foreground", label: s };
              const isActive = selectedStatus === s;
              return (
                <Button
                  key={s}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "text-[10px] h-8 px-4 rounded-xl font-black uppercase tracking-[0.1em] transition-all duration-300 gap-2 shrink-0 border-border/40",
                    isActive 
                      ? "shadow-lg shadow-primary/20 scale-105" 
                      : "text-muted-foreground/60 hover:text-primary/70 hover:border-primary/20 hover:bg-primary/[0.02]"
                  )}
                  onClick={() => setSelectedStatus(s)}
                >
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                  {s === "all" ? "Todos" : (cfg as any).label}
                </Button>
              );
            })}
          </div>

          {/* List */}
          <div className="flex-1 overflow-auto px-4 sm:px-8 pb-12 space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary/40" />
                <p className="text-sm text-muted-foreground font-medium animate-pulse">Buscando registros...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 border-2 border-dashed rounded-[2.5rem] bg-muted/5 opacity-80 max-w-2xl mx-auto">
                <div className="w-20 h-20 rounded-full bg-muted/10 flex items-center justify-center border border-dashed border-border group">
                  <Calendar className="w-8 h-8 text-muted-foreground/20 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="text-center space-y-1.5 px-6">
                  <h3 className="font-display font-bold text-lg text-foreground/70">Nenhum agendamento</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed italic">
                    Não encontramos registros para os filtros selecionados.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {filtered.map((apt) => {
                  const cfg = statusConfig[apt.status as keyof typeof statusConfig] || statusConfig.agendado;
                  const services = (apt.appointment_services as any[]) || [];
                  const serviceSummary = services.length > 0
                    ? services.map((s) => s.service_name).join(", ")
                    : apt.notes || "Sem serviço registrado";

                  return (
                    <div
                      key={apt.id}
                      className={cn(
                        "group relative p-5 rounded-[2rem] border bg-card hover:border-primary/30 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-0.5 border-l-[6px]",
                        cfg.color.replace("bg-", "border-l-"),
                        apt.status === "cancelado" && "opacity-60"
                      )}
                      onClick={() => {
                        setSelectedAppointment(apt);
                        setDetailOpen(true);
                      }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                        <div className="flex items-center gap-5">
                          <div className="w-20 sm:w-24 shrink-0 text-center border-r border-border/40 pr-5 flex flex-col justify-center">
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">
                              {format(parseISO(apt.date), "dd MMM", { locale: ptBR })}
                            </p>
                            <p className="text-xl sm:text-2xl font-black Outfit text-foreground leading-none mt-1.5">
                              {apt.start_time.slice(0, 5)}
                            </p>
                          </div>
                          
                          <div className="min-w-0 space-y-1">
                            <h4 className="font-display font-bold text-lg text-foreground/90 group-hover:text-primary transition-colors truncate tracking-tight uppercase">
                              {apt.client_name}
                            </h4>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-primary/5 flex items-center justify-center">
                                <Scissors className="w-3 h-3 text-primary/60" />
                              </div>
                              <p className="text-xs text-primary/80 font-bold truncate tracking-wide uppercase">
                                {serviceSummary}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-2 pt-2 border-t border-border/20">
                              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/30 border border-border/50 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                <UserCog className="w-3 h-3 text-primary/40" />
                                {proMap.get(apt.professional_id)?.split(" ")[0] ?? "Prof"}
                              </div>
                              {apt.notes && services.length > 0 && (
                                <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground/60 italic truncate max-w-[200px]">
                                  <Clock className="w-3 h-3 h-3 opacity-40" />
                                  {apt.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 mt-2 md:mt-0">
                          <Badge variant="secondary" className={cn(
                            "text-[9px] h-7 font-black uppercase tracking-[0.15em] px-4 rounded-xl shadow-sm",
                            cfg.bgClass
                          )}>
                            {cfg.label}
                          </Badge>
                          <div className="w-10 h-10 rounded-2xl bg-muted/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
                            <ArrowRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="logs" className="flex-1 data-[state=active]:flex data-[state=active]:flex-col overflow-hidden m-0 data-[state=inactive]:hidden">
          {/* Audit Filters */}
          <div className="px-4 sm:px-8 py-5 shrink-0 flex flex-col lg:flex-row gap-4 bg-muted/5 border-b border-border/40">
            <div className="relative group flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
              <Input
                placeholder="Buscar por cliente ou usuário..."
                className="pl-10 h-11 rounded-xl bg-background border-border/40 focus:border-primary/30 focus:ring-primary/20 transition-all font-medium text-sm"
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
              />
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="bg-background rounded-xl h-11 border-border/40 focus:border-primary/30 text-xs font-bold"
                />
              </div>
              <div className="relative flex-1">
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="bg-background rounded-xl h-11 border-border/40 focus:border-primary/30 text-xs font-bold"
                />
              </div>
            </div>

            <div className="flex gap-3 shrink-0">
              <Select value={auditAction} onValueChange={setAuditAction}>
                <SelectTrigger className="h-11 rounded-xl bg-background border-border/40 focus:ring-primary/20 font-medium text-xs w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                    <SelectValue placeholder="Tipo de Ação" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-primary/10">
                  <SelectItem value="all" className="rounded-lg focus:bg-primary/10">Todas as Ações</SelectItem>
                  <SelectItem value="INSERT" className="rounded-lg focus:bg-primary/10">Criações</SelectItem>
                  <SelectItem value="UPDATE" className="rounded-lg focus:bg-primary/10">Edições</SelectItem>
                  <SelectItem value="DELETE" className="rounded-lg focus:bg-primary/10">Exclusões</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={clearFilters}
                className="h-11 w-11 rounded-xl bg-background hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-dashed border-border/40 shrink-0"
                title="Limpar Filtros"
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto px-4 sm:px-8 py-8 space-y-8">
            <div className="flex items-center justify-between gap-4 bg-background/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10 mb-2 shadow-2xl ring-1 ring-white/5">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-[1.25rem] bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-xl font-display font-black text-foreground uppercase tracking-tight">Atividades</h2>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-60">Monitoramento em Tempo Real</p>
                </div>
              </div>
              <Badge variant="outline" className="px-5 py-2 rounded-2xl border-primary/10 bg-primary/10 text-primary font-black uppercase tracking-[0.2em] text-[10px] shadow-sm border-none">
                Últimas 200 Ações
              </Badge>
            </div>

            {isLoadingLogs ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary/30" />
                <p className="text-sm text-muted-foreground font-bold animate-pulse uppercase tracking-widest opacity-60">Carregando Auditoria...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-6 border-2 border-dashed rounded-[3rem] bg-muted/5 opacity-80 max-w-3xl mx-auto border-border/30">
                <div className="w-24 h-24 rounded-full bg-muted/10 flex items-center justify-center border border-dashed border-border/40 group">
                  <ShieldCheck className="w-10 h-10 text-muted-foreground/20 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="text-center space-y-2 px-8">
                  <h3 className="font-display font-bold text-xl text-foreground/70 tracking-tight">Sem atividades recentes</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed italic">
                    A auditoria está pronta. Certifique-se de que o sistema de logs está configurado no seu banco de dados.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 relative before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-primary/30 before:via-border/40 before:to-transparent">
                {auditLogs.map((log: any) => {
                  const isUpdate = log.action === 'UPDATE';
                  const isInsert = log.action === 'INSERT';
                  const isDelete = log.action === 'DELETE';
                  
                  return (
                    <div 
                      key={log.id} 
                      className="relative pl-14 group cursor-pointer"
                      onClick={() => {
                        setSelectedRecordId(log.entity_id);
                        setAuditHistoryOpen(true);
                      }}
                    >
                      <div className={cn(
                        "absolute left-[20px] top-6 w-4 h-4 rounded-full border-4 border-background shadow-xl z-20 group-hover:scale-125 transition-transform duration-300",
                        isInsert ? "bg-emerald-500" : isUpdate ? "bg-blue-500" : "bg-rose-500"
                      )} />
                      
                      <div className="p-6 rounded-[2.5rem] border bg-card hover:border-primary/30 transition-all duration-500 shadow-sm border-l-[6px] hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden group/card">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover/card:opacity-[0.08] transition-opacity pointer-events-none">
                           {isInsert ? <Calendar className="w-24 h-24 rotate-12" /> : isUpdate ? <UserCog className="w-24 h-24 -rotate-12" /> : <ShieldCheck className="w-24 h-24" />}
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
                          <div className="w-full md:w-40 shrink-0 md:border-r border-border/40 md:pr-6 flex items-center justify-between md:flex-col md:items-start md:justify-center gap-2">
                            <p className="font-black text-muted-foreground/50 uppercase tracking-[0.1em] text-[11px]">
                              {format(parseISO(log.created_at), "dd/MM HH:mm", { locale: ptBR })}
                            </p>
                            <Badge variant="outline" className={cn(
                              "text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-xl border-2 shadow-sm",
                              isInsert ? "bg-emerald-50 text-emerald-700 border-emerald-100/50" :
                              isUpdate ? "bg-blue-50 text-blue-700 border-blue-100/50" :
                              "bg-rose-50 text-rose-700 border-rose-100/50"
                            )}>
                              {isInsert ? 'CRIADO' :
                               isUpdate ? 'EDITADO' : 'REMOVIDO'}
                            </Badge>
                          </div>

                          <div className="flex-1 min-w-0 flex items-start gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-muted/20 border border-border/40 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-primary/5 transition-colors">
                              <User className="w-6 h-6 text-muted-foreground/40 group-hover:text-primary/40 transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0 space-y-3">
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <span className="font-display font-bold text-base text-foreground/90 uppercase tracking-tight">{log.user_name || "Sistema"}</span>
                                <span className="px-2 py-0.5 rounded-lg bg-muted text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest border border-border/40">Painel Administrativo</span>
                              </div>
                              
                              <div className="text-sm text-muted-foreground/80 leading-relaxed font-medium">
                                {isUpdate && log.new_data && log.old_data && (
                                  <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 rounded-full bg-primary/40" />
                                      <p className="flex items-center gap-2">
                                        <span className="font-bold opacity-50 uppercase text-[11px] tracking-wider">Cliente:</span>
                                        <span className="font-black text-foreground uppercase tracking-tight text-base bg-muted/30 px-3 py-0.5 rounded-lg border border-border/20">{log.new_data.client_name}</span>
                                      </p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      {log.old_data.status !== log.new_data.status && (
                                        <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-muted/20 border border-border/50 group/diff shadow-inner">
                                          <span className="font-black opacity-30 uppercase text-[9px] tracking-[0.2em] mb-1">Mudança de Status</span>
                                          <div className="flex items-center gap-3">
                                            <span className="line-through opacity-25 text-xs font-bold uppercase">{log.old_data.status}</span>
                                            <ArrowRight className="w-4 h-4 text-primary animate-pulse" />
                                            <Badge className="font-black text-primary bg-primary/10 hover:bg-primary/10 border-primary/20 uppercase text-[10px] tracking-widest py-1 px-3">
                                              {log.new_data.status}
                                            </Badge>
                                          </div>
                                        </div>
                                      )}
                                      {log.old_data.date !== log.new_data.date && (
                                        <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-muted/20 border border-border/50 group/diff shadow-inner">
                                          <span className="font-black opacity-30 uppercase text-[9px] tracking-[0.2em] mb-1">Nova Data</span>
                                          <div className="flex items-center gap-3">
                                            <span className="line-through opacity-25 text-xs font-bold">{log.old_data.date}</span>
                                            <ArrowRight className="w-4 h-4 text-primary animate-pulse" />
                                            <span className="font-black text-foreground/90 bg-muted px-3 py-1 rounded-xl border border-border/40 text-xs tracking-tight">
                                              {log.new_data.date}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                                {isInsert && log.new_data && (
                                  <div className="flex flex-col gap-3 p-5 rounded-[2rem] bg-emerald-500/[0.03] border border-emerald-500/10 border-dashed">
                                    <p className="flex items-center gap-3">
                                      <span className="font-black text-emerald-600/60 uppercase text-[10px] tracking-widest">Novo Registro</span>
                                    </p>
                                    <h5 className="font-black text-foreground/90 text-lg uppercase tracking-tight">{log.new_data.client_name}</h5>
                                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/60 uppercase">
                                      <Calendar className="w-4 h-4 text-emerald-500/40" />
                                      Agendado para {log.new_data.date} às {log.new_data.start_time}
                                    </div>
                                  </div>
                                )}
                                {isDelete && log.old_data && (
                                  <div className="flex flex-col gap-3 p-5 rounded-[2rem] bg-rose-500/[0.03] border border-rose-500/10 border-dashed">
                                    <p className="flex items-center gap-3">
                                      <span className="font-black text-rose-600/60 uppercase text-[10px] tracking-widest">Remoção Efetuada</span>
                                    </p>
                                    <h5 className="font-black text-rose-900/60 text-lg uppercase tracking-tight line-through opacity-40">{log.old_data.client_name}</h5>
                                    <div className="text-xs font-bold text-rose-600/60 uppercase flex items-center gap-2">
                                       <History className="w-4 h-4 opacity-40" />
                                       Registro do dia {log.old_data.date} removido
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="absolute top-4 right-4 hidden md:block">
                             <div className="w-8 h-8 rounded-full bg-muted/10 border border-border/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="w-4 h-4 text-muted-foreground/40 -rotate-45" />
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AppointmentDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        appointment={selectedAppointment}
      />

      <AppointmentAuditDialog
        open={auditHistoryOpen}
        onOpenChange={setAuditHistoryOpen}
        recordId={selectedRecordId}
      />
    </div>
  );
};

export default HistoricPage;
