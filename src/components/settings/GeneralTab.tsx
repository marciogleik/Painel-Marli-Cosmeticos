import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Loader2, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";

const GeneralTab = () => {
  const queryClient = useQueryClient();
  const [clinicName, setClinicName] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["clinic-settings"],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from("clinic_settings" as any)
        .select("name")
        .eq("id", "00000000-0000-0000-0000-000000000000")
        .single() as any);
      
      if (error) {
        console.error("Error fetching settings:", error);
        return { name: "Marli Cosméticos" };
      }
      
      if (data) setClinicName(data.name);
      return data;
    },
  });

  const handleSave = async () => {
    if (!clinicName.trim()) {
      toast.error("O nome da clínica não pode estar vazio");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("clinic_settings" as any)
        .update({ name: clinicName.trim(), updated_at: new Date().toISOString() })
        .eq("id", "00000000-0000-0000-0000-000000000000");

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["clinic-settings"] });
      toast.success("Configurações atualizadas com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao salvar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
        <p className="text-sm text-muted-foreground font-medium">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8 pb-24">
      <div className="flex flex-col gap-8">
        <Card className="rounded-[2.5rem] border-border/40 overflow-hidden shadow-sm hover:shadow-md transition-all">
          <CardHeader className="bg-muted/5 border-b border-border/40 py-5 px-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Building2 className="w-4 h-4" />
              </div>
              <CardTitle className="text-xl font-display font-bold">Informações da Clínica</CardTitle>
              <Sparkles className="w-4 h-4 text-primary opacity-20 ml-auto" />
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-px">Nome da Clínica</Label>
              <Input 
                value={clinicName} 
                onChange={e => setClinicName(e.target.value)} 
                className="h-12 rounded-2xl bg-muted/20 border-border/30 focus:border-primary/30 focus:ring-primary/20 font-medium transition-all"
                placeholder="Ex: Marli Cosméticos"
              />
              <p className="text-[10px] text-muted-foreground/50 ml-px">
                Este nome será usado no menu lateral e nas mensagens automáticas de confirmação.
              </p>
            </div>

            <div className="pt-2">
              <Button 
                onClick={handleSave} 
                disabled={saving || clinicName.trim() === settings?.name} 
                className="h-12 rounded-2xl px-8 font-bold gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all w-full sm:w-auto"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Salvar Configurações
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="p-6 rounded-3xl bg-primary/[0.03] border border-primary/10 flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-white border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-display font-bold text-foreground/80 leading-tight">Dica de Personalização</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              O nome definido aqui é o que seus clientes verão nas mensagens de WhatsApp e o que aparecerá no topo do painel administrativo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;
