import { BarChart3, TrendingUp, Users, Calendar, DollarSign } from "lucide-react";

const stats = [
  { label: "Agendamentos Hoje", value: "12", icon: Calendar, change: "+3 vs ontem" },
  { label: "Clientes Ativos", value: "347", icon: Users, change: "+15 este mês" },
  { label: "Faturamento Mensal", value: "R$ 28.450", icon: DollarSign, change: "+12% vs mês anterior" },
  { label: "Taxa de Presença", value: "87%", icon: TrendingUp, change: "+5% vs mês anterior" },
];

const ReportsPage = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-border shrink-0">
        <h1 className="text-xl font-display font-bold">Dashboard</h1>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(stat => (
            <div key={stat.label} className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-5 h-5 text-gold" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              <p className="text-[10px] text-emerald-600 mt-0.5">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Charts placeholder */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="font-display font-bold mb-4">Agendamentos por Semana</h3>
            <div className="h-48 flex items-end gap-2">
              {[65, 80, 45, 90, 70, 85, 60].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full gold-gradient rounded-t-sm" style={{ height: `${v}%` }} />
                  <span className="text-[9px] text-muted-foreground">
                    {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <h3 className="font-display font-bold mb-4">Faturamento por Profissional</h3>
            <div className="space-y-3">
              {[
                { name: 'Dhionara', value: 5200 },
                { name: 'Luciane', value: 4800 },
                { name: 'Tais', value: 4100 },
                { name: 'Bruna', value: 3900 },
                { name: 'Michele', value: 3500 },
              ].map(item => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="text-xs w-16 shrink-0 text-muted-foreground">{item.name}</span>
                  <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full gold-gradient rounded-full"
                      style={{ width: `${(item.value / 5200) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gold w-20 text-right">R$ {item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
