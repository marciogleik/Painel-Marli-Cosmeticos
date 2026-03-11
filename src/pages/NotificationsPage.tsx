import { useNotifications } from "@/hooks/useClinicData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bell, Calendar, User, UserCheck, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const NotificationsPage = () => {
    const { data: notifications, isLoading, error } = useNotifications();

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground p-8 bg-background/50 backdrop-blur-sm rounded-xl border border-dashed">
                <Bell className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg font-display">Ops! Ocorreu um erro ao carregar as notificações.</p>
                <p className="text-sm">Por favor, tente novamente em alguns instantes.</p>
            </div>
        );
    }

    return (
        <div className="container max-w-5xl py-8 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-display font-black tracking-tight text-foreground uppercase">
                        Notificações <span className="text-primary text-lg">Central</span>
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        Fique por dentro de todos os agendamentos e atividades da clínica.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-3 py-1 text-xs font-bold uppercase tracking-widest border-primary/20 bg-primary/5">
                        {notifications?.length || 0} Eventos
                    </Badge>
                </div>
            </div>

            <Card className="border-none shadow-2xl bg-background/40 backdrop-blur-md overflow-hidden ring-1 ring-white/10">
                <CardHeader className="border-b bg-muted/30 pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-display font-bold">Fluxo de Agendamentos</CardTitle>
                        <CardDescription className="text-xs font-medium uppercase tracking-tighter opacity-70">
                            Últimas 50 atividades processadas
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[650px]">
                        <div className="divide-y divide-border/50">
                            {isLoading ? (
                                Array(6).fill(0).map((_, i) => (
                                    <div key={i} className="p-6 space-y-3">
                                        <div className="flex justify-between">
                                            <Skeleton className="h-5 w-40" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                        <Skeleton className="h-4 w-full" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-4 w-20" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <AnimatePresence initial={false}>
                                    {notifications?.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground animate-in zoom-in-95 duration-500">
                                            <div className="relative">
                                                <Bell className="w-16 h-16 opacity-10" />
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                                                    transition={{ repeat: Infinity, duration: 3 }}
                                                    className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full"
                                                />
                                            </div>
                                            <p className="mt-4 font-display font-bold text-lg">Nenhuma notificação por enquanto.</p>
                                            <p className="text-sm opacity-60">Os novos agendamentos aparecerão aqui automaticamente.</p>
                                        </div>
                                    ) : (
                                        notifications?.map((notif, index) => (
                                            <motion.div
                                                key={notif.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className={cn(
                                                    "group p-6 hover:bg-muted/40 transition-all duration-300 relative border-l-4",
                                                    notif.type === 'new_appointment' ? "border-l-primary" : "border-l-muted"
                                                )}
                                            >
                                                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                                    <div className="space-y-3 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            {notif.is_read ? (
                                                                <CheckCircle2 className="w-4 h-4 text-primary opacity-60" />
                                                            ) : (
                                                                <Circle className="w-4 h-4 text-primary fill-primary animate-pulse" />
                                                            )}
                                                            <h3 className="text-lg font-display font-black uppercase tracking-tight leading-none">
                                                                {notif.title}
                                                            </h3>
                                                            <Badge variant="secondary" className="text-[10px] uppercase font-black px-1.5 py-0 h-4 min-w-[60px] justify-center bg-primary/10 text-primary border-none">
                                                                {notif.type === 'new_appointment' ? 'AGENDADO' : notif.type}
                                                            </Badge>
                                                        </div>

                                                        <p className="text-sm font-medium text-foreground/90 leading-relaxed italic bg-muted/30 p-2 rounded border border-foreground/5 shadow-inner">
                                                            "{notif.content}"
                                                        </p>

                                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                                                            <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                                                                <UserCheck className="w-3.5 h-3.5 text-primary" />
                                                                <span>Por: {notif.metadata?.executed_by || 'Sistema'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                                                                <User className="w-3.5 h-3.5 text-primary" />
                                                                <span>Prof: {notif.metadata?.professional_name || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                                                                <Calendar className="w-3.5 h-3.5 text-primary" />
                                                                <span>{notif.metadata?.date ? format(new Date(notif.metadata.date + "T12:00:00"), "dd MMM", { locale: ptBR }) : 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-right shrink-0">
                                                        <time className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 block">
                                                            {format(new Date(notif.created_at), "HH:mm", { locale: ptBR })}
                                                        </time>
                                                        <span className="text-[9px] font-bold text-muted-foreground/40 block mt-0.5">
                                                            {format(new Date(notif.created_at), "dd/MM/yyyy", { locale: ptBR })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <div className="pt-4 flex justify-center text-[10px] font-display font-black uppercase tracking-[0.2em] text-muted-foreground/30">
                Marli Cosméticos • Notificação em Tempo Real
            </div>
        </div>
    );
};

export default NotificationsPage;
