import { useState } from "react";
import { useServices, type DBService } from "@/hooks/useClinicData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Loader2, Clock, DollarSign, Archive, ArchiveRestore } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CATEGORIES = [
  "Avaliação", "Capilar", "Corporal", "Depilação", "Facial",
  "Geral", "Injetáveis", "Micropigmentação", "Pés", "Sobrancelha", "Unhas"
];

interface SvcForm {
  name: string;
  category: string;
  duration_minutes: number;
  base_price: string;
  requires_evaluation: boolean;
}

const emptyForm: SvcForm = { name: "", category: "Geral", duration_minutes: 30, base_price: "", requires_evaluation: false };

const ServicosTab = () => {
  const queryClient = useQueryClient();
  const [showInactive, setShowInactive] = useState(false);
  const { data: services = [], isLoading } = useServices(showInactive);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SvcForm>(emptyForm);
  const [deactivateTarget, setDeactivateTarget] = useState<{ id: string; name: string } | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        duration_minutes: form.duration_minutes,
        base_price: form.base_price ? parseFloat(form.base_price.replace(",", ".")) : null,
        requires_evaluation: form.requires_evaluation,
      };

      if (editingId) {
        const { error } = await supabase.from("services").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("services").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidateAll();
      toast({ title: editingId ? "Serviço atualizado!" : "Serviço cadastrado!" });
      closeDialog();
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("services")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { is_active }) => {
      invalidateAll();
      toast({ title: is_active ? "Serviço reativado!" : "Serviço desativado!" });
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["services"] });
  };

  const openEdit = (s: DBService) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      category: s.category,
      duration_minutes: s.duration_minutes,
      base_price: s.base_price != null ? s.base_price.toFixed(2).replace(".", ",") : "",
      requires_evaluation: s.requires_evaluation,
    });
    setDialogOpen(true);
  };

  const openNew = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };
  const closeDialog = () => { setDialogOpen(false); setEditingId(null); setForm(emptyForm); };

  const active = services.filter(s => s.is_active);
  const inactive = services.filter(s => !s.is_active);
  const filteredActive = filterCategory === "all" ? active : active.filter(s => s.category === filterCategory);
  const filteredInactive = filterCategory === "all" ? inactive : inactive.filter(s => s.category === filterCategory);
  const canSubmit = form.name.trim().length >= 2 && form.duration_minutes > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm text-muted-foreground">{active.length} serviços ativos</p>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="h-8 w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-muted-foreground">
            <Switch checked={showInactive} onCheckedChange={setShowInactive} className="scale-75" />
            Inativos
          </label>
        </div>
        <Button size="sm" className="gap-1.5" onClick={openNew}>
          <Plus className="w-4 h-4" /> Novo Serviço
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid gap-2">
          {filteredActive.map(s => (
            <Card key={s.id} className="group">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{s.name}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">{s.category}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{s.duration_minutes} min</span>
                    {s.base_price != null && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />R$ {s.base_price.toFixed(2).replace(".", ",")}
                      </span>
                    )}
                    {s.requires_evaluation && <span className="text-[10px] text-primary">Requer avaliação</span>}
                  </div>
                </div>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(s)} title="Editar">
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeactivateTarget({ id: s.id, name: s.name })}
                    title="Desativar"
                    disabled={toggleActiveMutation.isPending}
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {showInactive && filteredInactive.map(s => (
            <Card key={s.id} className="group opacity-50 border-dashed">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{s.name}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">Inativo</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                  onClick={() => toggleActiveMutation.mutate({ id: s.id, is_active: true })}
                  title="Reativar"
                  disabled={toggleActiveMutation.isPending}
                >
                  <ArchiveRestore className="w-3.5 h-3.5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={v => { if (!v) closeDialog(); else setDialogOpen(true); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">{editingId ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs">Nome *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome do serviço" maxLength={100} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Categoria</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Duração (min) *</Label>
                <Input type="number" min={5} max={480} value={form.duration_minutes} onChange={e => setForm(f => ({ ...f, duration_minutes: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Preço base (R$)</Label>
              <Input value={form.base_price} onChange={e => setForm(f => ({ ...f, base_price: e.target.value }))} placeholder="0,00" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox checked={form.requires_evaluation} onCheckedChange={v => setForm(f => ({ ...f, requires_evaluation: !!v }))} />
              <span className="text-sm">Requer avaliação prévia</span>
            </label>
            <Button className="w-full" disabled={!canSubmit || mutation.isPending} onClick={() => mutation.mutate()}>
              {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
              {editingId ? "Salvar" : "Cadastrar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deactivateTarget} onOpenChange={v => { if (!v) setDeactivateTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desativar serviço?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deactivateTarget?.name}</strong> não aparecerá mais na agenda e nos vínculos. Você poderá reativá-lo depois.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deactivateTarget) {
                  toggleActiveMutation.mutate({ id: deactivateTarget.id, is_active: false });
                  setDeactivateTarget(null);
                }
              }}
            >
              Desativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ServicosTab;
