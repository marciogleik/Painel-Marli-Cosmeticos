import { useState } from "react";
import { useFinanceReport } from "@/hooks/useFinanceReport";
import { useYearlyComparison } from "@/hooks/useYearlyComparison";
import { useProfessionals } from "@/hooks/useClinicData";
import { format, subMonths, addMonths, subDays, startOfQuarter, startOfMonth, startOfYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, DollarSign, TrendingUp, TrendingDown, CalendarCheck, Loader2, FileDown, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, Legend,
} from "recharts";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { exportToExcel, exportToPDF } from "@/utils/financeExport";

const COLORS = [
  "hsl(43, 75%, 48%)",
  "hsl(43, 60%, 60%)",
  "hsl(200, 60%, 50%)",
  "hsl(150, 50%, 45%)",
  "hsl(340, 55%, 55%)",
  "hsl(270, 50%, 55%)",
  "hsl(20, 70%, 55%)",
  "hsl(180, 45%, 45%)",
];

const formatCurrency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const DeltaBadge = ({ value, label }: { value: number | null | undefined; label?: string }) => {
  if (value == null) return null;
  const isPositive = value >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs mt-1.5 font-medium ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {isPositive ? "+" : ""}{value.toFixed(1)}% {label ?? "vs mês anterior"}
    </span>
  );
};

const FinanceiroPage = () => {
  const [month, setMonth] = useState(new Date());
  const [selectedProfessional, setSelectedProfessional] = useState<string>("all");
  const [mode, setMode] = useState<"month" | "custom">("month");
  const [customFrom, setCustomFrom] = useState<Date | undefined>(undefined);
  const [customTo, setCustomTo] = useState<Date | undefined>(undefined);

  const { data: professionals = [] } = useProfessionals();

  const customRange = mode === "custom" && customFrom && customTo ? { from: customFrom, to: customTo } : null;
  const { data, isLoading } = useFinanceReport(
    month,
    selectedProfessional === "all" ? undefined : selectedProfessional,
    customRange,
  );

  const { data: yearlyData } = useYearlyComparison(
    selectedProfessional === "all" ? undefined : selectedProfessional,
  );

  const prev = () => setMonth(m => subMonths(m, 1));
  const next = () => setMonth(m => addMonths(m, 1));
  const isCurrentMonth = format(month, "yyyy-MM") === format(new Date(), "yyyy-MM");

  const dailyData = (data?.daily ?? []).map(d => ({
    ...d,
    label: d.date ? format(new Date(d.date + "T12:00:00"), "dd/MM") : "",
  }));

  const profData = (data?.byProfessional ?? []).map(p => ({
    name: (p.professional_name || "Prof").split(" ")[0],
    fullName: p.professional_name || "Profissional",
    total: p.total || 0,
    count: p.count || 0,
  }));

  const topServices = (data?.byService ?? []).slice(0, 8);

  const comparisonLabel = mode === "custom" ? "vs período anterior" : "vs mês anterior";

  return (
    <div className="flex flex-col h-full overflow-auto bg-transparent">
      {/* Header Hub Style */}
      <div className="px-4 sm:px-8 pt-8 sm:pt-12 pb-6 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 bg-primary/10 rounded-lg">
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs font-black tracking-[0.3em] text-primary uppercase">Inteligência Financeira</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tighter text-foreground uppercase leading-none">
          Finanças
        </h1>
        <p className="text-muted-foreground font-medium max-w-md pt-1">
          Análise profunda de receita, ticket médio e performance por profissional.
        </p>
      </div>

      <div className="px-4 sm:px-8 pb-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
        {/* Filters Glass Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 bg-background/40 backdrop-blur-md rounded-[2rem] border border-white/10 shadow-xl ring-1 ring-white/5">
          <div className="flex items-center gap-3 grow">
            <Select value={mode} onValueChange={(v) => setMode(v as "month" | "custom")}>
              <SelectTrigger className="h-11 w-[130px] sm:w-[150px] bg-white/5 border-white/10 rounded-xl font-bold text-[10px] uppercase tracking-widest">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50 rounded-xl border-white/10">
                <SelectItem value="month" className="text-[10px] font-bold uppercase tracking-widest">Mensal</SelectItem>
                <SelectItem value="custom" className="text-[10px] font-bold uppercase tracking-widest">Período</SelectItem>
              </SelectContent>
            </Select>

            {mode === "month" && (
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl h-11 px-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/10" onClick={prev}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-[11px] font-black uppercase tracking-widest min-w-[100px] text-center">
                  {format(month, "MMM yyyy", { locale: ptBR })}
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/10" onClick={next} disabled={isCurrentMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
             <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
              <SelectTrigger className="h-11 grow sm:w-[200px] bg-white/5 border-white/10 rounded-xl font-bold text-[10px] uppercase tracking-widest">
                <SelectValue placeholder="Profissional" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50 rounded-xl border-white/10">
                <SelectItem value="all" className="text-[10px] font-bold uppercase tracking-widest">Todos Profissionais</SelectItem>
                {professionals.map(p => (
                  <SelectItem key={p.id} value={p.id} className="text-[10px] font-bold uppercase tracking-widest">{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {data && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-11 w-11 shrink-0 border-white/10 bg-white/5 rounded-xl hover:bg-primary hover:text-white transition-all">
                    <FileDown className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover z-50 shadow-2xl border-white/10 rounded-xl p-1">
                  <DropdownMenuItem onClick={() => {
                    const profName = selectedProfessional !== "all" ? professionals.find(p => p.id === selectedProfessional)?.name : undefined;
                    exportToExcel(data, month, profName);
                  }} className="text-[10px] font-bold uppercase tracking-widest p-3 rounded-lg">
                    Exportar Excel (.xlsx)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    const profName = selectedProfessional !== "all" ? professionals.find(p => p.id === selectedProfessional)?.name : undefined;
                    exportToPDF(data, month, profName);
                  }} className="text-[10px] font-bold uppercase tracking-widest p-3 rounded-lg">
                    Exportar PDF (.pdf)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {mode === "custom" && (!customFrom || !customTo) ? (
          <div className="flex flex-col items-center justify-center py-24 bg-background/40 backdrop-blur-md rounded-[2.5rem] border border-white/10 border-dashed">
            <CalendarIcon className="w-12 h-12 mb-4 opacity-10" />
            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground/40">Selecione o período para análise</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats cards Glass */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-6 rounded-[2rem] border border-white/10 bg-background/40 backdrop-blur-md shadow-2xl ring-1 ring-white/5 group hover:ring-primary/40 transition-all duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary transition-all duration-500">
                    <DollarSign className="w-6 h-6 text-primary group-hover:text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground font-black tracking-[0.2em] uppercase opacity-60">Receita Total</p>
                    <p className="text-2xl sm:text-3xl font-display font-black leading-none mt-1 group-hover:text-primary transition-colors">{formatCurrency(data?.totalRevenue ?? 0)}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                    <DeltaBadge value={data?.comparison?.revenueDelta} label={comparisonLabel} />
                </div>
              </div>

              <div className="p-6 rounded-[2rem] border border-white/10 bg-background/40 backdrop-blur-md shadow-2xl ring-1 ring-white/5 group hover:ring-emerald-500/40 transition-all duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500 transition-all duration-500">
                    <CalendarCheck className="w-6 h-6 text-emerald-600 group-hover:text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground font-black tracking-[0.2em] uppercase opacity-60">Atendimentos</p>
                    <p className="text-2xl sm:text-3xl font-display font-black leading-none mt-1 group-hover:text-emerald-600">{data?.totalAppointments ?? 0}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                    <DeltaBadge value={data?.comparison?.appointmentsDelta} label={comparisonLabel} />
                </div>
              </div>

              <div className="p-6 rounded-[2rem] border border-white/10 bg-background/40 backdrop-blur-md shadow-2xl ring-1 ring-white/5 group hover:ring-amber-500/40 transition-all duration-500 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 group-hover:bg-amber-500 transition-all duration-500">
                    <TrendingUp className="w-6 h-6 text-amber-600 group-hover:text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-muted-foreground font-black tracking-[0.2em] uppercase opacity-60">Ticket Médio</p>
                    <p className="text-2xl sm:text-3xl font-display font-black leading-none mt-1 group-hover:text-amber-600">
                      {data?.totalAppointments
                        ? formatCurrency((data.totalRevenue ?? 0) / data.totalAppointments)
                        : "R$ 0,00"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                    <DeltaBadge value={data?.comparison?.ticketDelta} label={comparisonLabel} />
                </div>
              </div>
            </div>

            {/* Daily revenue chart Glass */}
            <div className="bg-background/40 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-6 sm:p-10 shadow-2xl ring-1 ring-white/5 overflow-hidden">
               <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                    <h2 className="font-display font-black text-2xl uppercase tracking-tight">Receita Diária</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Fluxo de Caixa Mensal</p>
                  </div>
               </div>
                {dailyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={dailyData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(43, 75%, 48%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(43, 75%, 48%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fontWeight: 'bold' }} tickFormatter={v => `R$${v}`} width={60} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '12px', border: 'none', color: '#fff' }}
                        itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                        formatter={(v: number) => [formatCurrency(v), "Receita"]} 
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="hsl(43, 75%, 48%)"
                        strokeWidth={3}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm font-black uppercase tracking-widest text-muted-foreground/30 text-center py-16">Sem dados para exibição</p>
                )}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Revenue by professional Glass */}
              <div className="bg-background/40 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-6 sm:p-8 shadow-2xl ring-1 ring-white/5">
                <div className="mb-6">
                    <h3 className="font-display font-black text-xl uppercase tracking-tight">Performance por Profissional</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Ranking de Receita</p>
                </div>
                {profData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={profData} layout="vertical" margin={{ left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 10, fontWeight: 'bold' }} tickFormatter={v => `R$${v}`} axisLine={false} />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fontWeight: 'bold' }} width={80} axisLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '12px', shadow: 'none', border: 'none' }}
                          itemStyle={{ fontSize: '10px', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }}
                          formatter={(v: number) => [formatCurrency(v), "Receita"]}
                          labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName ?? label}
                        />
                        <Bar dataKey="total" radius={[0, 8, 8, 0]} barSize={24}>
                          {profData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm font-black uppercase tracking-widest text-muted-foreground/30 text-center py-16">Sem dados</p>
                  )}
              </div>

               {/* Revenue by service Glass */}
              <div className="bg-background/40 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-6 sm:p-8 shadow-2xl ring-1 ring-white/5">
                <div className="mb-6">
                    <h3 className="font-display font-black text-xl uppercase tracking-tight">Top Serviços</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Mix de Receita</p>
                </div>
                {topServices.length > 0 ? (
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                          <Pie
                            data={topServices}
                            dataKey="total"
                            nameKey="service_name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            innerRadius={50}
                            stroke="none"
                          >
                            {topServices.map((_, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '12px', border: 'none', color: '#fff' }}
                            itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                            formatter={(v: number) => formatCurrency(v)} 
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="w-full space-y-2">
                        {topServices.map((s, i) => (
                          <div key={s.service_name} className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
                            <div
                              className="w-3 h-3 rounded-md shrink-0"
                              style={{ backgroundColor: COLORS[i % COLORS.length] }}
                            />
                            <span className="text-[10px] font-black uppercase tracking-tighter truncate flex-1">{s.service_name}</span>
                            <span className="text-[11px] font-bold text-primary shrink-0">{formatCurrency(s.total)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm font-black uppercase tracking-widest text-muted-foreground/30 text-center py-16">Sem dados</p>
                  )}
              </div>
            </div>

            {/* Detailed list Glass */}
            {profData.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pl-2 border-l-4 border-primary">
                  <h2 className="font-display font-black text-2xl uppercase tracking-tight">Detalhamento Profissional</h2>
                </div>
                
                <div className="bg-background/40 backdrop-blur-md rounded-[2.5rem] border border-white/10 shadow-2xl ring-1 ring-white/5 overflow-hidden">
                  <div className="hidden sm:block">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/5">
                          <th className="text-left py-6 px-10 font-black text-[10px] uppercase tracking-[0.2em] text-primary">Profissional</th>
                          <th className="text-right py-6 px-10 font-black text-[10px] uppercase tracking-[0.2em] text-primary">Atendimentos</th>
                          <th className="text-right py-6 px-10 font-black text-[10px] uppercase tracking-[0.2em] text-primary">Receita Bruta</th>
                          <th className="text-right py-6 px-10 font-black text-[10px] uppercase tracking-[0.2em] text-primary">Ticket Médio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profData.map(p => (
                          <tr key={p.fullName} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                            <td className="py-6 px-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                                        {p.name.charAt(0)}
                                    </div>
                                    <span className="font-black uppercase tracking-tight group-hover:text-primary transition-colors">{p.fullName}</span>
                                </div>
                            </td>
                            <td className="py-6 px-10 text-right font-bold text-muted-foreground/70">{p.count}</td>
                            <td className="py-6 px-10 text-right font-black text-foreground">{formatCurrency(p.total)}</td>
                            <td className="py-6 px-10 text-right">
                                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-primary/5 text-primary text-[11px] font-black">
                                    {p.count > 0 ? formatCurrency(p.total / p.count) : "—"}
                                </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Mobile Detailed List */}
                  <div className="sm:hidden p-4 space-y-4">
                    {profData.map(p => (
                      <div key={p.fullName} className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                          <p className="font-black text-base uppercase tracking-tight text-primary">{p.fullName}</p>
                          <Badge variant="outline" className="text-[10px] font-black bg-primary/10 text-primary border-none uppercase px-3">
                            {p.count} Atend.
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <p className="text-[9px] uppercase tracking-widest font-black text-muted-foreground/40 mb-1">Receita</p>
                            <p className="text-lg font-black text-foreground">{formatCurrency(p.total)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] uppercase tracking-widest font-black text-muted-foreground/40 mb-1">Ticket Médio</p>
                            <p className="text-sm font-black text-primary/80">
                              {p.count > 0 ? formatCurrency(p.total / p.count) : "—"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceiroPage;
