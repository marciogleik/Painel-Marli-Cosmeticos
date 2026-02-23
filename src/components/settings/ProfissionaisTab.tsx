import { useState } from "react";
import { useProfessionals } from "@/hooks/useClinicData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProfForm {
  name: string;
  role_description: string;
  avatar_initials: string;
}

const emptyForm: ProfForm = { name: "", role_description: "", avatar_initials: "" };

const ProfissionaisTab = () => {
  const queryClient = useQueryClient();
  const { data: professionals = [], isLoading } = useProfessionals();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProfForm>(emptyForm);

  const generateInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const initials = form.avatar_initials || generateInitials(form.name);
      if (editingId) {
        const { error } = await supabase
          .from("professionals")
          .update({ name: form.name.trim(), role_description: form.role_description.trim() || null, avatar_initials: initials })
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("professionals")
          .insert({ name: form.name.trim(), role_description: form.role_description.trim() || null, avatar_initials: initials });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
      toast({ title: editingId ? "Profissional atualizado!" : "Profissional cadastrado!" });
      closeDialog();
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const openEdit = (p: { id: string; name: string; role_description: string | null; avatar_initials: string | null }) => {
    setEditingId(p.id);
    setForm({ name: p.name, role_description: p.role_description || "", avatar_initials: p.avatar_initials || "" });
    setDialogOpen(true);
  };

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const canSubmit = form.name.trim().length >= 2;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{professionals.length} profissionais cadastrados</p>
        <Button size="sm" className="gap-1.5" onClick={openNew}>
          <Plus className="w-4 h-4" /> Novo Profissional
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {professionals.map(p => (
            <Card key={p.id} className="group relative">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">{p.avatar_initials || p.name.slice(0, 2).toUpperCase()}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{p.role_description || "—"}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => openEdit(p)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={v => { if (!v) closeDialog(); else setDialogOpen(true); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">{editingId ? "Editar Profissional" : "Novo Profissional"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs">Nome *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome completo" maxLength={100} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Função / Especialidade</Label>
              <Input value={form.role_description} onChange={e => setForm(f => ({ ...f, role_description: e.target.value }))} placeholder="Ex: Estética / Depilação" maxLength={100} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Iniciais (avatar)</Label>
              <Input value={form.avatar_initials} onChange={e => setForm(f => ({ ...f, avatar_initials: e.target.value.toUpperCase().slice(0, 3) }))} placeholder="Auto" maxLength={3} className="w-20" />
            </div>
            <Button className="w-full" disabled={!canSubmit || mutation.isPending} onClick={() => mutation.mutate()}>
              {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
              {editingId ? "Salvar" : "Cadastrar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfissionaisTab;
