import { useState } from "react";
import { useFinanceReport } from "@/hooks/useFinanceReport";
import { useProfessionals } from "@/hooks/useClinicData";
import { format, subMonths, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, DollarSign, TrendingUp, TrendingDown, CalendarCheck, Loader2, FileDown, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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

  const prev = () => setMonth(m => subMonths(m, 1));
  const next = () => setMonth(m => addMonths(m, 1));
  const isCurrentMonth = format(month, "yyyy-MM") === format(new Date(), "yyyy-MM");

  const dailyData = (data?.daily ?? []).map(d => ({
    ...d,
    label: format(new Date(d.date + "T12:00:00"), "dd/MM"),
  }));

  const profData = (data?.byProfessional ?? []).map(p => ({
    name: p.professional_name.split(" ")[0],
    fullName: p.professional_name,
    total: p.total,
    count: p.count,
  }));

  const topServices = (data?.byService ?? []).slice(0, 8);

  const comparisonLabel = mode === "custom" ? "vs período anterior" : "vs mês anterior";

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="px-8 pt-8 pb-4">
        <h1 className="text-2xl font-display font-bold">Relatório Financeiro</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Análise de receita por profissional e serviço
        </p>
      </div>

      <div className="px-8 pb-8 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Mode toggle */}
          <Select value={mode} onValueChange={(v) => setMode(v as "month" | "custom")}>
            <SelectTrigger className="h-8 w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mensal</SelectItem>
              <SelectItem value="custom">Período</SelectItem>
            </SelectContent>
          </Select>

          {mode === "month" ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={prev}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-semibold min-w-[130px] text-center capitalize">
                {format(month, "MMMM yyyy", { locale: ptBR })}
              </span>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={next} disabled={isCurrentMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn("h-8 gap-1.5 text-xs", !customFrom && "text-muted-foreground")}>
                    <CalendarIcon className="w-3.5 h-3.5" />
                    {customFrom ? format(customFrom, "dd/MM/yyyy") : "Data início"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customFrom}
                    onSelect={(d) => {
                      setCustomFrom(d);
                      if (d && customTo && d > customTo) setCustomTo(undefined);
                    }}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <span className="text-xs text-muted-foreground">até</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn("h-8 gap-1.5 text-xs", !customTo && "text-muted-foreground")}>
                    <CalendarIcon className="w-3.5 h-3.5" />
                    {customTo ? format(customTo, "dd/MM/yyyy") : "Data fim"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customTo}
                    onSelect={setCustomTo}
                    disabled={(date) => date > new Date() || (customFrom ? date < customFrom : false)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
            <SelectTrigger className="h-8 w-[200px]">
              <SelectValue placeholder="Todos profissionais" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos profissionais</SelectItem>
              {professionals.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {data && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5">
                  <FileDown className="w-4 h-4" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {
                  const profName = selectedProfessional !== "all" ? professionals.find(p => p.id === selectedProfessional)?.name : undefined;
                  exportToExcel(data, month, profName);
                }}>
                  Exportar Excel (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  const profName = selectedProfessional !== "all" ? professionals.find(p => p.id === selectedProfessional)?.name : undefined;
                  exportToPDF(data, month, profName);
                }}>
                  Exportar PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {mode === "custom" && (!customFrom || !customTo) ? (
          <div className="flex justify-center py-16">
            <p className="text-sm text-muted-foreground">Selecione as datas de início e fim para visualizar o relatório</p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Receita Total</p>
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mt-2">{formatCurrency(data?.totalRevenue ?? 0)}</p>
                  <DeltaBadge value={data?.comparison?.revenueDelta} label={comparisonLabel} />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Agendamentos</p>
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                      <CalendarCheck className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mt-2">{data?.totalAppointments ?? 0}</p>
                  <DeltaBadge value={data?.comparison?.appointmentsDelta} label={comparisonLabel} />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Ticket Médio</p>
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    {data?.totalAppointments
                      ? formatCurrency((data.totalRevenue ?? 0) / data.totalAppointments)
                      : "R$ 0,00"}
                  </p>
                  <DeltaBadge value={data?.comparison?.ticketDelta} label={comparisonLabel} />
                </CardContent>
              </Card>
            </div>

            {/* Daily revenue chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-display">Receita Diária</CardTitle>
              </CardHeader>
              <CardContent>
                {dailyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={dailyData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(43, 75%, 48%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(43, 75%, 48%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 89%)" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `R$${v}`} width={65} />
                      <Tooltip formatter={(v: number) => [formatCurrency(v), "Receita"]} />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="hsl(43, 75%, 48%)"
                        strokeWidth={2}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">Sem dados para o período</p>
                )}
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Revenue by professional */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-display">Receita por Profissional</CardTitle>
                </CardHeader>
                <CardContent>
                  {profData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={profData} layout="vertical" margin={{ left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 89%)" />
                        <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `R$${v}`} />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                        <Tooltip
                          formatter={(v: number) => [formatCurrency(v), "Receita"]}
                          labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName ?? label}
                        />
                        <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                          {profData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">Sem dados</p>
                  )}
                </CardContent>
              </Card>

              {/* Revenue by service (top 8) */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-display">Top Serviços por Receita</CardTitle>
                </CardHeader>
                <CardContent>
                  {topServices.length > 0 ? (
                    <div className="flex items-center gap-4">
                      <ResponsiveContainer width="50%" height={240}>
                        <PieChart>
                          <Pie
                            data={topServices}
                            dataKey="total"
                            nameKey="service_name"
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            innerRadius={45}
                          >
                            {topServices.map((_, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v: number) => formatCurrency(v)} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex-1 space-y-1.5">
                        {topServices.map((s, i) => (
                          <div key={s.service_name} className="flex items-center gap-2 text-xs">
                            <div
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: COLORS[i % COLORS.length] }}
                            />
                            <span className="truncate flex-1">{s.service_name}</span>
                            <span className="font-medium text-foreground shrink-0">{formatCurrency(s.total)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">Sem dados</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Detailed table by professional */}
            {profData.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-display">Detalhamento por Profissional</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 font-medium text-muted-foreground">Profissional</th>
                          <th className="text-right py-2 font-medium text-muted-foreground">Atendimentos</th>
                          <th className="text-right py-2 font-medium text-muted-foreground">Receita</th>
                          <th className="text-right py-2 font-medium text-muted-foreground">Ticket Médio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profData.map(p => (
                          <tr key={p.fullName} className="border-b border-border last:border-0">
                            <td className="py-2.5 font-medium">{p.fullName}</td>
                            <td className="py-2.5 text-right text-muted-foreground">{p.count}</td>
                            <td className="py-2.5 text-right font-medium">{formatCurrency(p.total)}</td>
                            <td className="py-2.5 text-right text-muted-foreground">
                              {p.count > 0 ? formatCurrency(p.total / p.count) : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FinanceiroPage;
