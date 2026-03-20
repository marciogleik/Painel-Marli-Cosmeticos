import { useState } from "react";
import { useProfessionals, useServices, useProfessionalServices } from "@/hooks/useClinicData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Link2, Unlink2, Users, Scissors, Info, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const VinculosTab = () => {
  const queryClient = useQueryClient();
  const { data: professionals = [], isLoading: loadingProfs } = useProfessionals();
  const { data: services = [], isLoading: loadingServices } = useServices();
  const { data: links = [], isLoading: loadingLinks } = useProfessionalServices();
  const [selectedProf, setSelectedProf] = useState<string>("");

  const profLinks = links.filter(l => l.professional_id === selectedProf);
  const linkedServiceIds = profLinks.map(l => l.service_id);

  const toggleMutation = useMutation({
    mutationFn: async ({ serviceId, linked, serviceName }: { serviceId: string; linked: boolean; serviceName: string }) => {
      if (linked) {
        const link = profLinks.find(l => l.service_id === serviceId);
        if (link) {
          const { error } = await supabase.from("professional_services").delete().eq("id", link.id);
          if (error) throw error;
        }
      } else {
        const { error } = await supabase.from("professional_services").insert({
          professional_id: selectedProf,
          service_id: serviceId,
        });
        if (error) throw error;
      }
      return { linked, serviceName };
    },
    onSuccess: ({ linked, serviceName }) => {
      queryClient.invalidateQueries({ queryKey: ["professional_services"] });
      toast({ 
        title: linked ? "Vínculo removido" : "Serviço vinculado", 
        description: `${serviceName} foi ${linked ? "desvinculado" : "vinculado"} com sucesso.`,
      });
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao atualizar vínculo", description: err.message, variant: "destructive" });
    },
  });

  const prof = professionals.find(p => p.id === selectedProf);
  const categories = [...new Set(services.map(s => s.category))].sort();

  const isLoading = loadingProfs || loadingServices || loadingLinks;

  return (
    <div className="space-y-6 max-w-4xl pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-card p-6 rounded-3xl border border-border/40 shadow-sm">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group">
              <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground/90">Gestão de Vínculos</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
            Selecione uma profissional para definir quais serviços ela pode realizar. Isso determinará a disponibilidade na agenda.
          </p>
        </div>

        <div className="w-full md:w-72 space-y-1.5 px-0.5">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-px flex items-center gap-1.5">
            Profissional <ChevronRight className="w-3 h-3" />
          </Label>
          <Select value={selectedProf} onValueChange={setSelectedProf}>
            <SelectTrigger className="h-11 rounded-xl bg-background border-primary/10 focus:ring-primary/20 transition-all font-medium">
              <SelectValue placeholder="Selecione um membro da equipe" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-primary/10">
              {professionals.map(p => (
                <SelectItem key={p.id} value={p.id} className="rounded-lg py-3 focus:bg-primary/10 focus:text-primary">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                      {p.avatar_initials || p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium">{p.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedProf && prof ? (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-8">
          <div className="flex items-center justify-between bg-primary/[0.03] border border-primary/10 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                {prof.user_id ? <CheckCircle2 className="w-6 h-6" /> : <Info className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-display font-bold text-lg text-foreground/80 leading-tight">{prof.name}</h4>
                <p className="text-xs text-muted-foreground font-medium">{prof.role_description || "Equipe operacional"}</p>
              </div>
            </div>
            <div className="text-right pr-2">
              <div className="text-2xl font-black text-primary leading-none">{linkedServiceIds.length}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Serviços Habilitados</div>
            </div>
          </div>

          <div className="grid gap-8">
            {categories.map(cat => {
              const catServices = services.filter(s => s.category === cat);
              if (catServices.length === 0) return null;
              
              return (
                <div key={cat} className="space-y-3 px-1">
                  <div className="flex items-center gap-3">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
                    <h3 className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">{cat}</h3>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-border/50 to-transparent" />
                  </div>
                  
                  <div className="grid gap-2 sm:grid-cols-2">
                    {catServices.map(s => {
                      const isLinked = linkedServiceIds.includes(s.id);
                      const isPending = toggleMutation.isPending && toggleMutation.variables?.serviceId === s.id;
                      
                      return (
                        <label
                          key={s.id}
                          className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                            isLinked 
                              ? "bg-primary/[0.02] border-primary/20 shadow-sm" 
                              : "bg-background border-border/40 hover:border-primary/20 hover:bg-primary/[0.01]"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Checkbox
                              checked={isLinked}
                              onCheckedChange={() => toggleMutation.mutate({ serviceId: s.id, linked: isLinked, serviceName: s.name })}
                              disabled={toggleMutation.isPending}
                              className={`rounded-lg h-5 w-5 border-primary/20 data-[state=checked]:bg-primary transition-all duration-500 ${isPending ? "opacity-50" : ""}`}
                            />
                            <div className="min-w-0">
                              <span className={`text-sm font-bold block truncate transition-colors ${
                                isLinked ? "text-primary" : "text-foreground/80 group-hover:text-primary/70"
                              }`}>
                                {s.name}
                              </span>
                              <span className="text-[10px] font-medium text-muted-foreground/60 flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                {s.duration_minutes} min
                              </span>
                            </div>
                          </div>
                          
                          <div className={`transition-all duration-300 ${isLinked ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}>
                            {isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin text-primary/40" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-primary" />
                              </div>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-4 border border-dashed rounded-[2.5rem] bg-muted/5 opacity-80 max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-muted/10 flex items-center justify-center border border-dashed border-border group">
            <Scissors className="w-8 h-8 text-muted-foreground/20 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="text-center space-y-1.5 px-6">
            <h3 className="font-display font-bold text-lg text-foreground/70">Aguardando Seleção</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed italic">
              Selecione uma profissional acima para gerenciar seu catálogo de serviços e disponibilidade na agenda.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal Badge for consistency
const Badge = ({ children, variant = "outline", className = "" }: any) => {
  const styles = {
    outline: "border border-border",
    secondary: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${styles[variant as keyof typeof styles]} ${className}`}>
      {children}
    </span>
  );
};

export default VinculosTab;
