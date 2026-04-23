import { useNotifications } from "@/hooks/useClinicData";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Bell, Calendar, User, UserCheck, CheckCircle2, Circle, 
  Sparkles, Lightbulb, Zap, Rocket, Shield, Star, 
  ArrowRight, Info
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SYSTEM_UPDATES = [
  {
    id: "upd-1",
    date: "2026-03-20",
    title: "Nova Central de Notificações",
    description: "Lançamos uma interface unificada para você acompanhar agendamentos e novidades do sistema em um só lugar.",
    type: "new",
    icon: Rocket
  },
  {
    id: "upd-2",
    date: "2026-03-19",
    title: "Relatórios Financeiros Avançados",
    description: "Agora você pode visualizar comparativos anuais e projeções de faturamento com mais clareza no menu Financeiro.",
    type: "improvement",
    icon: Sparkles
  },
  {
    id: "upd-3",
    date: "2026-03-18",
    title: "Estética Premium Global",
    description: "Todo o sistema recebeu um banho de design: fontes mais legíveis, layouts responsivos e cores mais sofisticadas.",
    type: "improvement",
    icon: Star
  },
  {
    id: "upd-4",
    date: "2026-03-17",
    title: "Segurança Reforçada",
    description: "Atualizamos nossas camadas de proteção de dados para garantir que as informações das suas clientes estejam sempre seguras.",
    type: "info",
    icon: Shield
  }
];

const QUICK_TIPS = [
  {
    id: "tip-1",
    title: "Busca Inteligente",
    content: "Pressione Shift + K em qualquer lugar para abrir a busca global e encontrar clientes ou serviços rapidamente.",
    icon: Zap
  },
  {
    id: "tip-2",
    title: "Agendamento Ágil",
    content: "Na agenda, você pode arrastar e soltar agendamentos para trocar o horário ou o profissional em segundos.",
    icon: Calendar
  },
  {
    id: "tip-3",
    title: "Fichas de Anamnese",
    content: "Capture a assinatura digital da cliente diretamente no tablet ou celular para uma experiência sem papel.",
    icon: UserCheck
  },
  {
    id: "tip-4",
    title: "Visualização Mensal",
    content: "No dashboard, clique nos cards de estatísticas para ver o detalhamento completo de cada métrica.",
    icon: Lightbulb
  }
];

const NotificationsPage = () => {
    const { user } = useAuth();

    // Verifica se é gestora e busca o nome do profissional logado
    const { data: isGestor } = useQuery({
        queryKey: ["my-role-gestor", user?.id],
        queryFn: async () => {
            if (!user?.id) return false;
            const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "gestor" });
            return !!data;
        },
        enabled: !!user?.id,
    });

    const { data: currentProfessional } = useQuery({
        queryKey: ["my-professional", user?.id],
        queryFn: async () => {
            if (!user?.id) return null;
            const { data } = await supabase.from("professionals").select("id, name").eq("user_id", user.id).single();
            return data ?? null;
        },
        enabled: !!user?.id,
    });

    // Gestoras veem tudo; profissionais só veem as próprias
    const filterName = isGestor === false ? (currentProfessional?.name ?? null) : null;
    const { data: notifications, isLoading, error } = useNotifications(filterName);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground p-8 bg-background/50 backdrop-blur-sm rounded-xl border border-dashed">
                <Bell className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg font-display font-bold">Ops! Ocorreu um erro ao carregar as notificações.</p>
                <p className="text-sm">Por favor, tente novamente em alguns instantes.</p>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl py-8 space-y-8 animate-in fade-in duration-700">
            {/* Header Hub */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-2">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Bell className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-xs font-black tracking-[0.3em] text-primary uppercase">Hub de Comunicação</span>
                    </div>
                    <h1 className="text-5xl font-display font-black tracking-tighter text-foreground uppercase leading-none">
                        Notificações
                    </h1>
                    <p className="text-muted-foreground font-medium max-w-md">
                        Sua central estratégica para atividades, novidades do sistema e dicas de produtividade.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-2xl bg-background/40 backdrop-blur-md border border-white/10 shadow-lg flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/70">Sistema Online</span>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="activities" className="w-full space-y-8">
                <TabsList className="bg-background/40 backdrop-blur-md p-1.5 h-auto rounded-2xl border border-white/10 shadow-xl inline-flex w-full sm:w-auto">
                    <TabsTrigger 
                        value="activities" 
                        className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 gap-2"
                    >
                        <Zap className="w-3.5 h-3.5" />
                        Atividades
                    </TabsTrigger>
                    <TabsTrigger 
                        value="news" 
                        className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 gap-2"
                    >
                        <Rocket className="w-3.5 h-3.5" />
                        Novidades
                    </TabsTrigger>
                    <TabsTrigger 
                        value="tips" 
                        className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 gap-2"
                    >
                        <Lightbulb className="w-3.5 h-3.5" />
                        Dicas
                    </TabsTrigger>
                </TabsList>

                {/* TAB: ACTIVITIES */}
                <TabsContent value="activities" className="mt-0 outline-none">
                    <Card className="border-none shadow-2xl bg-background/40 backdrop-blur-md overflow-hidden ring-1 ring-white/10 rounded-3xl">
                        <CardHeader className="border-b border-white/5 bg-muted/20 pb-4 px-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-2xl font-display font-black uppercase tracking-tight">Fluxo de Agendamentos</CardTitle>
                                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-primary/60">
                                        Monitoramento em tempo real
                                    </CardDescription>
                                </div>
                                <Badge variant="outline" className="px-3 py-1 text-[10px] font-black uppercase tracking-widest border-primary/20 bg-primary/5 rounded-lg">
                                    {notifications?.length || 0} Registros
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[600px]">
                                <div className="divide-y divide-white/5">
                                    {isLoading ? (
                                        Array(6).fill(0).map((_, i) => (
                                            <div key={i} className="p-8 space-y-4">
                                                <div className="flex justify-between">
                                                    <Skeleton className="h-6 w-48 rounded-lg" />
                                                    <Skeleton className="h-4 w-24 rounded-lg" />
                                                </div>
                                                <Skeleton className="h-4 w-full rounded-lg" />
                                                <div className="flex gap-4">
                                                    <Skeleton className="h-4 w-32 rounded-lg" />
                                                    <Skeleton className="h-4 w-32 rounded-lg" />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <AnimatePresence initial={false}>
                                            {notifications?.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
                                                    <div className="relative mb-6">
                                                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                                                        <Bell className="w-20 h-20 opacity-20 relative z-10" />
                                                    </div>
                                                    <p className="font-display font-black text-2xl uppercase tracking-tighter text-foreground">Nenhuma atividade</p>
                                                    <p className="text-sm font-medium opacity-60">Novos eventos aparecerão aqui automaticamente.</p>
                                                </div>
                                            ) : (
                                                notifications?.map((notif, index) => (
                                                    <motion.div
                                                        key={notif.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.03 }}
                                                        className={cn(
                                                            "group p-8 hover:bg-white/5 transition-all duration-300 relative border-l-[6px]",
                                                            notif.type === 'new_appointment' ? "border-l-primary" : "border-l-muted"
                                                        )}
                                                    >
                                                        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                                                            <div className="space-y-4 flex-1">
                                                                <div className="flex items-center gap-3">
                                                                    {!notif.is_read && (
                                                                        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                                                    )}
                                                                    <h3 className="text-xl font-display font-black uppercase tracking-tight leading-none text-foreground/90 group-hover:text-primary transition-colors">
                                                                        {notif.title}
                                                                    </h3>
                                                                    <Badge className="text-[10px] font-black px-2 py-0.5 rounded-md bg-primary/10 text-primary border-none uppercase tracking-tighter">
                                                                        {notif.type === 'new_appointment' ? 'AGENDADO' : notif.type}
                                                                    </Badge>
                                                                </div>

                                                                <p className="text-base font-medium text-foreground/70 leading-relaxed italic bg-white/5 p-4 rounded-2xl border border-white/5 shadow-inner group-hover:bg-white/10 transition-colors">
                                                                    "{notif.content}"
                                                                </p>

                                                                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-1 text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground/60">
                                                                    <div className="flex items-center gap-2 group/item">
                                                                        <UserCheck className="w-4 h-4 text-primary opacity-70 group-hover/item:opacity-100 transition-opacity" />
                                                                        <span className="group-hover/item:text-foreground transition-colors items-center flex gap-1">
                                                                            Por: <span className="text-foreground">{notif.metadata?.executed_by || 'Sistema'}</span>
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 group/item">
                                                                        <User className="w-4 h-4 text-primary opacity-70 group-hover/item:opacity-100 transition-opacity" />
                                                                        <span className="group-hover/item:text-foreground transition-colors items-center flex gap-1">
                                                                            Prof: <span className="text-foreground">{notif.metadata?.professional_name || 'N/A'}</span>
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 group/item">
                                                                        <Calendar className="w-4 h-4 text-primary opacity-70 group-hover/item:opacity-100 transition-opacity" />
                                                                        <span className="group-hover/item:text-foreground transition-colors">
                                                                            {notif.metadata?.date ? format(new Date(notif.metadata.date + "T12:00:00"), "dd 'de' MMMM", { locale: ptBR }) : 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="lg:text-right shrink-0 bg-white/5 lg:bg-transparent p-3 lg:p-0 rounded-xl w-full lg:w-auto flex lg:flex-col justify-between items-center lg:items-end">
                                                                <time className="text-sm font-black tracking-widest text-primary block leading-none">
                                                                    {format(new Date(notif.created_at), "HH:mm", { locale: ptBR })}
                                                                </time>
                                                                <span className="text-[10px] font-bold text-muted-foreground/40 block mt-1 uppercase tracking-tighter">
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
                </TabsContent>

                {/* TAB: NEWS (SYSTEM UPDATES) */}
                <TabsContent value="news" className="mt-0 outline-none">
                    <div className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="bg-primary/10 border-primary/20 p-6 rounded-3xl flex items-center gap-4 border-dashed border-2">
                                <div className="p-3 bg-primary rounded-2xl">
                                    <Rocket className="w-6 h-6 text-primary-foreground" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Status</p>
                                    <h4 className="font-display font-black text-sm uppercase">Versão 2.4.0</h4>
                                </div>
                            </Card>
                            <Card className="bg-background/40 backdrop-blur-md border-white/10 p-6 rounded-3xl flex items-center gap-4">
                                <div className="p-3 bg-muted/20 rounded-2xl">
                                    <Zap className="w-6 h-6 text-foreground/70" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Velocidade</p>
                                    <h4 className="font-display font-black text-sm uppercase">+40% Otimizada</h4>
                                </div>
                            </Card>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-display font-black uppercase tracking-tight pl-2">Melhorias do Sistema</h3>
                            <div className="space-y-4">
                                {SYSTEM_UPDATES.map((update, index) => (
                                    <motion.div
                                        key={update.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className="border-none shadow-xl bg-background/40 backdrop-blur-md overflow-hidden ring-1 ring-white/10 rounded-3xl group hover:ring-primary/30 transition-all duration-500">
                                            <div className="flex flex-col md:flex-row items-stretch">
                                                <div className="md:w-16 bg-muted/30 flex items-center justify-center p-6 border-r border-white/5">
                                                    <update.icon className="w-6 h-6 text-primary" />
                                                </div>
                                                <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className={cn(
                                                                "text-[9px] font-black uppercase px-2 py-0 border-none rounded-sm tracking-tighter",
                                                                update.type === 'new' ? "bg-green-500/10 text-green-500" : 
                                                                update.type === 'improvement' ? "bg-blue-500/10 text-blue-500" : 
                                                                "bg-primary/10 text-primary"
                                                            )}>
                                                                {update.type === 'new' ? 'NOVO' : update.type === 'improvement' ? 'MELHORIA' : 'AVISO'}
                                                            </Badge>
                                                            <span className="text-[10px] font-bold text-muted-foreground/40">
                                                                {format(new Date(update.date + "T12:00:00"), "dd 'de' MMM", { locale: ptBR })}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-xl font-display font-black uppercase tracking-tight group-hover:text-primary transition-colors">
                                                            {update.title}
                                                        </h4>
                                                        <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-2xl">
                                                            {update.description}
                                                        </p>
                                                    </div>
                                                    <div className="shrink-0 flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                                                            <ArrowRight className="w-4 h-4 group-hover:text-primary-foreground transition-colors" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* TAB: TIPS */}
                <TabsContent value="tips" className="mt-0 outline-none">
                    <div className="space-y-6">
                        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
                            <div className="relative z-10 space-y-4 flex-1">
                                <h3 className="text-3xl font-display font-black uppercase tracking-tight leading-none">Você no Controle</h3>
                                <p className="text-muted-foreground font-medium max-w-lg">
                                    Preparamos estas dicas rápidas para você aproveitar ao máximo todas as funcionalidades do Painel Marli.
                                </p>
                                <NavLink to="/faq">
                                    <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                                        Explorar Base de Conhecimento
                                    </button>
                                </NavLink>
                            </div>
                            <div className="relative z-10 p-8 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shrink-0">
                                <Info className="w-16 h-16 text-primary" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {QUICK_TIPS.map((tip, index) => (
                                <motion.div
                                    key={tip.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="h-full border-none shadow-xl bg-background/40 backdrop-blur-md p-8 rounded-[2.5rem] ring-1 ring-white/10 hover:ring-primary/50 transition-all duration-500 relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <tip.icon className="w-24 h-24" />
                                        </div>
                                        <div className="relative z-10 space-y-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-inner group-hover:bg-primary transition-all duration-500">
                                                <tip.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                                            </div>
                                            <h4 className="text-2xl font-display font-black uppercase tracking-tight group-hover:text-primary transition-all">
                                                {tip.title}
                                            </h4>
                                            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                                                {tip.content}
                                            </p>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="pt-8 flex flex-col items-center gap-4">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent" />
                <div className="text-[10px] font-display font-black uppercase tracking-[0.3em] text-muted-foreground/30">
                    Marli Cosméticos • Inteligência Operacional
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;
