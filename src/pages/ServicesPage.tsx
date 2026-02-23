import { professionals } from "@/data/clinic";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Clock } from "lucide-react";

const ServicesPage = () => {
  const allServices = professionals.flatMap(p =>
    p.services.map(s => ({ ...s, professional: p.name }))
  );
  const categories = [...new Set(allServices.map(s => s.category))];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <h1 className="text-xl font-display font-bold">Serviços</h1>
        <Button variant="gold" size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" /> Novo Serviço
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {categories.map(cat => (
          <div key={cat}>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{cat}</h2>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Serviço</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Duração</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Preço</th>
                    <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground hidden md:table-cell">Profissional</th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {allServices.filter(s => s.category === cat).map(s => (
                    <tr key={`${s.id}-${s.professional}`} className="hover:bg-muted/30">
                      <td className="px-4 py-2.5 font-medium">
                        {s.name}
                        {s.requiresEvaluation && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">Avaliação</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.duration} min</span>
                      </td>
                      <td className="px-4 py-2.5 text-gold font-semibold">R$ {s.price.toFixed(2)}</td>
                      <td className="px-4 py-2.5 text-muted-foreground hidden md:table-cell">{s.professional}</td>
                      <td className="px-2 py-2.5">
                        <button className="p-1 hover:bg-muted rounded-md">
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
