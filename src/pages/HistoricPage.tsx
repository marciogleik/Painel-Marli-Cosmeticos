import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, History, Calendar, User, UserCog, Clock, Loader2, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { statusConfig } from "@/hooks/useClinicData";
import { cn } from "@/lib/utils";
import AppointmentDetailDialog from "@/components/AppointmentDetailDialog";
import { Button } from "@/components/ui/button";

const HistoricPage = () => {
    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const { data: professionals = [] } = useQuery({
        queryKey: ["professionals"],
        queryFn: async () => {
            const { data, error } = await supabase.from("professionals").select("id, name");
            if (error) throw error;
            return data ?? [];
        },
    });

    const { data: appointments = [], isLoading } = useQuery({
        queryKey: ["global_history"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("appointments")
                .select("*, appointment_services(*)")
                .order("date", { ascending: false })
                .order("start_time", { ascending: false })
                .limit(2000);
            if (error) throw error;
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

            {/* Filters */}
            <div className="px-8 py-4 shrink-0 flex items-center gap-3 flex-wrap">
                <div className="relative max-w-md flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por cliente ou observação..."
                        className="pl-9 bg-card"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {["all", "agendado", "confirmado", "atendido", "cancelado", "falta"].map((s) => (
                        <Button
                            key={s}
                            variant={selectedStatus === s ? "default" : "outline"}
                            size="sm"
                            className="text-[10px] h-7 px-2"
                            onClick={() => setSelectedStatus(s)}
                        >
                            {s === "all" ? "Todos" : s.charAt(0).toUpperCase() + s.slice(1)}
                        </Button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-auto px-8 pb-8 space-y-2">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
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
                                    "p-4 rounded-lg border bg-card hover:border-primary/30 transition-all cursor-pointer group",
                                    apt.status === "cancelado" && "opacity-60"
                                )}
                                onClick={() => {
                                    setSelectedAppointment(apt);
                                    setDetailOpen(true);
                                }}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 shrink-0 text-center border-r pr-4">
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold">
                                                {format(parseISO(apt.date), "dd MMM", { locale: ptBR })}
                                            </p>
                                            <p className="text-sm font-semibold">{apt.start_time.slice(0, 5)}</p>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                                                {apt.client_name}
                                            </p>
                                            <p className="text-xs text-primary font-medium truncate">
                                                {serviceSummary}
                                            </p>
                                            <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <UserCog className="w-3 h-3" />
                                                    {proMap.get(apt.professional_id) ?? "Profissional"}
                                                </span>
                                                {apt.notes && services.length > 0 && (
                                                    <span className="flex items-center gap-1 italic truncate max-w-[200px]">
                                                        <Clock className="w-3 h-3" />
                                                        {apt.notes}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className={cn("text-[10px] h-6", cfg.bgClass)}>
                                        {cfg.label}
                                    </Badge>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <AppointmentDetailDialog
                open={detailOpen}
                onOpenChange={setDetailOpen}
                appointment={selectedAppointment}
            />
        </div>
    );
};

export default HistoricPage;
