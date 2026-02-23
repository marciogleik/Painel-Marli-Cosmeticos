import { professionals } from "@/data/clinic";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const ProfessionalsPage = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <h1 className="text-xl font-display font-bold">Profissionais</h1>
        <Button variant="gold" size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" /> Nova Profissional
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {professionals.map(prof => (
            <div key={prof.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow bg-card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-sm font-bold text-primary">
                    {prof.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{prof.name}</p>
                    <p className="text-xs text-muted-foreground">{prof.role}</p>
                  </div>
                </div>
                <button className="p-1 hover:bg-muted rounded-md">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{prof.services.length} serviços cadastrados</p>
                <div className="flex flex-wrap gap-1">
                  {[...new Set(prof.services.map(s => s.category))].map(cat => (
                    <span key={cat} className="px-2 py-0.5 rounded-full bg-gold/10 text-gold text-[10px] font-medium">{cat}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalsPage;
