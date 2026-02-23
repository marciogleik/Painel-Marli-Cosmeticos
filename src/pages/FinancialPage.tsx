const FinancialPage = ({ type }: { type: 'receber' | 'pagar' | 'caixa' }) => {
  const titles: Record<string, string> = {
    receber: 'Contas a Receber',
    pagar: 'Contas a Pagar',
    caixa: 'Fluxo de Caixa',
  };

  const sampleData = [
    { id: '1', description: 'Limpeza de Pele - Maria Silva', value: 150, date: '2026-02-23', status: 'paid' },
    { id: '2', description: 'Peeling Químico - Ana Oliveira', value: 200, date: '2026-02-23', status: 'pending' },
    { id: '3', description: 'Design Sobrancelha - Carla Santos', value: 60, date: '2026-02-23', status: 'paid' },
    { id: '4', description: 'Depilação a Laser - Fernanda Lima', value: 250, date: '2026-02-22', status: 'paid' },
    { id: '5', description: 'Drenagem Linfática - Julia Costa', value: 170, date: '2026-02-21', status: 'overdue' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-border shrink-0">
        <h1 className="text-xl font-display font-bold">{titles[type]}</h1>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 sticky top-0">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Descrição</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Data</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Valor</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sampleData.map(item => (
              <tr key={item.id} className="hover:bg-muted/30">
                <td className="px-6 py-3">{item.description}</td>
                <td className="px-6 py-3 text-muted-foreground">{item.date}</td>
                <td className="px-6 py-3 text-gold font-semibold">R$ {item.value.toFixed(2)}</td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    item.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                    item.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {item.status === 'paid' ? 'Pago' : item.status === 'pending' ? 'Pendente' : 'Atrasado'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialPage;
