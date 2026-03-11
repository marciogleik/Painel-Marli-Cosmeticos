import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, History, Calendar, User, UserCog, Clock, Loader2, Filter, ArrowRight, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { statusConfig, useProfessionals, useServices } from "@/hooks/useClinicData";
import { cn } from "@/lib/utils";
import AppointmentDetailDialog from "@/components/AppointmentDetailDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const HistoricPage = () => {
    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedProfessional, setSelectedProfessional] = useState<string>("all");
    const [selectedService, setSelectedService] = useState<string>("all");
    const [dateFrom, setDateFrom] = useState<string>("");
    const [dateTo, setDateTo] = useState<string>("");
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const { data: professionals = [] } = useProfessionals(true);
    const { data: servicesList = [] } = useServices(true);

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
        queryKey: ["activity_logs"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("activity_logs" as any)
                .select("*")
                .order("created_at", { ascending: false })
                .limit(200);
            if (error) return []; // Table might not exist yet
            return data ?? [];
        },
    });

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

    const proMap = new Map(professionals.map((p) => [p.id, p.name]));

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="px-8 pt-8 pb-4 shrink-0">
                <div className="flex items-center gap-3 mb-1">
                    <History className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-display font-bold">Histórico Global</h1>
                </div>
                <p className="text-sm text-muted-foreground">
                    Visualize e busque todos os agendamentos registrados no sistema.
                </p>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="appointments" className="flex-1 flex flex-col overflow-hidden">
                <div className="px-8 border-b">
                    <TabsList className="bg-transparent border-b-0 h-10 gap-4">
                        <TabsTrigger value="appointments" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 h-full font-bold text-sm">
                            Agendamentos
                        </TabsTrigger>
                        <TabsTrigger value="logs" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 h-full font-bold text-sm text-muted-foreground data-[state=active]:text-foreground">
                            Auditoria de Alterações
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Filters Row (only for appointments) */}
                <TabsContent value="appointments" className="flex-1 flex flex-col overflow-hidden m-0">
                    <div className="px-8 py-4 shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 bg-muted/5">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar cliente ou obs..."
                                className="pl-9 bg-card border-muted-foreground/20 focus:border-primary transition-all"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="bg-card text-xs border-muted-foreground/20"
                                placeholder="De"
                            />
                            <Input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="bg-card text-xs border-muted-foreground/20"
                                placeholder="Até"
                            />
                        </div>

                        <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
                            <SelectTrigger className="bg-card text-xs border-muted-foreground/20">
                                <SelectValue placeholder="Profissional" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as profissionais</SelectItem>
                                {professionals.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedService} onValueChange={setSelectedService}>
                            <SelectTrigger className="bg-card text-xs border-muted-foreground/20">
                                <SelectValue placeholder="Serviço" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os serviços</SelectItem>
                                {servicesList.map(s => (
                                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="px-8 pb-3 shrink-0 flex items-center gap-2 overflow-x-auto my-2">
                        {["all", "agendado", "confirmado", "atendido", "cancelado", "falta"].map((s) => (
                            <Button
                                key={s}
                                variant={selectedStatus === s ? "default" : "outline"}
                                size="sm"
                                className={cn(
                                    "text-[10px] h-7 px-3 rounded-full font-bold uppercase tracking-wider transition-all",
                                    selectedStatus === s ? "shadow-md scale-105" : "text-muted-foreground/70"
                                )}
                                onClick={() => setSelectedStatus(s)}
                            >
                                {s === "all" ? "Todos" : s.charAt(0).toUpperCase() + s.slice(1)}
                            </Button>
                        ))}
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-auto px-8 pb-8 space-y-3">
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
                                <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">Nenhum agendamento encontrado.</p>
                            </div>
                        ) : (
                            filtered.map((apt) => {
                                const cfg = statusConfig[apt.status as keyof typeof statusConfig] || statusConfig.agendado;
                                const services = (apt.appointment_services as any[]) || [];
                                const serviceSummary = services.length > 0
                                    ? services.map((s) => s.service_name).join(", ")
                                    : apt.notes || "Sem serviço registrado";

                                return (
                                    <div
                                        key={apt.id}
                                        className={cn(
                                            "p-4 rounded-xl border bg-card hover:border-primary group shadow-sm transition-all hover:shadow-md border-l-4",
                                            cfg.color.replace("bg-", "border-l-"),
                                            apt.status === "cancelado" && "opacity-60"
                                        )}
                                        onClick={() => {
                                            setSelectedAppointment(apt);
                                            setDetailOpen(true);
                                        }}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-start gap-5">
                                                <div className="w-24 shrink-0 text-center border-r pr-5 flex flex-col justify-center">
                                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">
                                                        {format(parseISO(apt.date), "dd MMMM", { locale: ptBR })}
                                                    </p>
                                                    <p className="text-lg font-black Outfit text-foreground leading-none mt-1">
                                                        {apt.start_time.slice(0, 5)}
                                                    </p>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-base group-hover:text-primary transition-colors Outfit leading-tight uppercase tracking-tight">
                                                        {apt.client_name}
                                                    </p>
                                                    <p className="text-xs text-primary font-black truncate tracking-tight uppercase opacity-90">
                                                        {serviceSummary}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                                                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/50 border border-muted-foreground/10">
                                                            <UserCog className="w-3 h-3" />
                                                            {proMap.get(apt.professional_id) ?? "Profissional"}
                                                        </span>
                                                        {apt.notes && services.length > 0 && (
                                                            <span className="flex items-center gap-1.5 italic truncate max-w-[250px] opacity-70">
                                                                <Clock className="w-3 h-3" />
                                                                {apt.notes}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className={cn("text-[9px] h-6 font-black uppercase tracking-widest px-3 rounded-md shadow-sm", cfg.bgClass)}>
                                                {cfg.label}
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="logs" className="flex-1 flex flex-col overflow-hidden m-0 p-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-bold Outfit">Registro de Atividades</h2>
                        </div>
                        <p className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full font-medium">Últimas 200 operações</p>
                    </div>

                    {isLoadingLogs ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-16 border-2 border-dashed rounded-2xl bg-muted/10">
                            <ShieldCheck className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                            <p className="text-base font-bold text-muted-foreground">Nenhuma atividade registrada</p>
                            <p className="text-sm text-muted-foreground/70 mt-1 max-w-sm mx-auto">
                                Certifique-se de executar o script SQL no seu Dashboard do Supabase para ativar a auditoria.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 overflow-auto pr-2">
                            {logs.map((log: any) => (
                                <div key={log.id} className="p-4 rounded-xl border bg-card text-xs flex items-center gap-6 shadow-sm hover:shadow-md transition-all hover:border-primary/20">
                                    <div className="w-40 shrink-0 border-r pr-6 flex flex-col justify-center">
                                        <p className="font-black text-muted-foreground opacity-80 uppercase tracking-tighter">
                                            {format(parseISO(log.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                        </p>
                                        <div className="flex mt-1">
                                            <Badge variant="outline" className={cn(
                                                "text-[9px] px-2 py-0.5 font-black uppercase tracking-widest rounded",
                                                log.action === 'INSERT' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                    log.action === 'UPDATE' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                        "bg-rose-50 text-rose-700 border-rose-200"
                                            )}>
                                                {log.action === 'INSERT' ? 'CRIAÇÃO' :
                                                    log.action === 'UPDATE' ? 'EDIÇÃO' : 'EXCLUSÃO'}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                                            <User className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="font-black text-sm Outfit uppercase tracking-tight">{log.user_name || "Sistema"}</span>
                                                <span className="text-muted-foreground font-medium lowercase">executou em</span>
                                                <span className="font-black text-primary uppercase tracking-wider bg-primary/5 px-2 py-0.5 rounded">Agendamento</span>
                                            </div>
                                            {log.action === 'UPDATE' && log.new_data && log.old_data && (
                                                <div className="text-muted-foreground flex items-center gap-2 flex-wrap">
                                                    <span className="font-bold">Cliente:</span>
                                                    <span className="font-black text-foreground uppercase tracking-tight">{log.new_data.client_name}</span>
                                                    {log.old_data.status !== log.new_data.status && (
                                                        <div className="flex items-center gap-1.5 ml-2 bg-muted/40 px-2 py-0.5 rounded border border-muted-foreground/10">
                                                            <span className="font-bold">Status:</span>
                                                            <span className="line-through opacity-50">{log.old_data.status}</span>
                                                            <ArrowRight className="w-3 h-3" />
                                                            <span className="font-black text-foreground">{log.new_data.status}</span>
                                                        </div>
                                                    )}
                                                    {log.old_data.date !== log.new_data.date && (
                                                        <div className="flex items-center gap-1.5 ml-2 bg-muted/40 px-2 py-0.5 rounded border border-muted-foreground/10">
                                                            <span className="font-bold">Data:</span>
                                                            <span className="line-through opacity-50">{log.old_data.date}</span>
                                                            <ArrowRight className="w-3 h-3" />
                                                            <span className="font-black text-foreground">{log.new_data.date}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {log.action === 'INSERT' && log.new_data && (
                                                <p className="text-muted-foreground">
                                                    Novo agendamento para <span className="font-black text-foreground uppercase tracking-tight">{log.new_data.client_name}</span> no dia <span className="font-bold text-foreground">{log.new_data.date}</span>
                                                </p>
                                            )}
                                            {log.action === 'DELETE' && log.old_data && (
                                                <p className="text-rose-600 font-medium">
                                                    Removido agendamento de <span className="font-black uppercase tracking-tight">{log.old_data.client_name}</span> do dia {log.old_data.date}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            <AppointmentDetailDialog
                open={detailOpen}
                onOpenChange={setDetailOpen}
                appointment={selectedAppointment}
            />
        </div>
    );
};

export default HistoricPage;
