import { useState } from "react";
import { useProfessionals, useServices, useProfessionalServices } from "@/hooks/useClinicData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Link2, Unlink2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const VinculosTab = () => {
  const queryClient = useQueryClient();
  const { data: professionals = [] } = useProfessionals();
  const { data: services = [] } = useServices();
  const { data: links = [] } = useProfessionalServices();
  const [selectedProf, setSelectedProf] = useState<string>("");

  const profLinks = links.filter(l => l.professional_id === selectedProf);
  const linkedServiceIds = profLinks.map(l => l.service_id);

  const toggleMutation = useMutation({
    mutationFn: async ({ serviceId, linked }: { serviceId: string; linked: boolean }) => {
      if (linked) {
        // Remove link
        const link = profLinks.find(l => l.service_id === serviceId);
        if (link) {
          const { error } = await supabase.from("professional_services").delete().eq("id", link.id);
          if (error) throw error;
        }
      } else {
        // Add link
        const { error } = await supabase.from("professional_services").insert({
          professional_id: selectedProf,
          service_id: serviceId,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professional_services"] });
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const prof = professionals.find(p => p.id === selectedProf);

  // Group services by category
  const categories = [...new Set(services.map(s => s.category))].sort();

  return (
    <div className="space-y-4">
      <div className="space-y-1.5 max-w-xs">
        <Label className="text-xs">Selecione o profissional</Label>
        <Select value={selectedProf} onValueChange={setSelectedProf}>
          <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
          <SelectContent>
            {professionals.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProf && prof && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            <strong>{prof.name}</strong> — {linkedServiceIds.length} serviço(s) vinculado(s)
          </p>

          {categories.map(cat => {
            const catServices = services.filter(s => s.category === cat);
            return (
              <div key={cat}>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">{cat}</p>
                <div className="grid gap-1">
                  {catServices.map(s => {
                    const isLinked = linkedServiceIds.includes(s.id);
                    return (
                      <label
                        key={s.id}
                        className="flex items-center gap-2.5 cursor-pointer hover:bg-muted/50 rounded-md px-3 py-1.5"
                      >
                        <Checkbox
                          checked={isLinked}
                          onCheckedChange={() => toggleMutation.mutate({ serviceId: s.id, linked: isLinked })}
                          disabled={toggleMutation.isPending}
                        />
                        <span className="text-sm flex-1">{s.name}</span>
                        <span className="text-xs text-muted-foreground">{s.duration_minutes} min</span>
                        {isLinked && <Link2 className="w-3 h-3 text-primary" />}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!selectedProf && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">Selecione um profissional para gerenciar seus serviços vinculados.</p>
        </div>
      )}
    </div>
  );
};

export default VinculosTab;
