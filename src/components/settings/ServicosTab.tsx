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
import { 
  Plus, Pencil, Loader2, Clock, DollarSign, Archive, ArchiveRestore,
  Scissors, Sparkles, Zap, User, Settings, Syringe, PenTool, Eye, Footprints, ClipboardCheck, Hand 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CATEGORIES = [
  "Avaliação", "Capilar", "Corporal", "Depilação", "Facial",
  "Geral", "Injetáveis", "Micropigmentação", "Pés", "Sobrancelha", "Unhas"
];

const CATEGORY_ICONS: Record<string, any> = {
  "Avaliação": ClipboardCheck,
  "Capilar": Scissors,
  "Corporal": Sparkles,
  "Depilação": Zap,
  "Facial": User,
  "Geral": Settings,
  "Injetáveis": Syringe,
  "Micropigmentação": PenTool,
  "Pés": Footprints,
  "Sobrancelha": Eye,
  "Unhas": Hand,
};

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
  const [search, setSearch] = useState("");
  const [deactivateTarget, setDeactivateTarget] = useState<{ id: string; name: string } | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [form, setForm] = useState<SvcForm>(emptyForm);

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

  const filteredActive = active.filter(s => {
    const matchesCategory = filterCategory === "all" || s.category === filterCategory;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredInactive = inactive.filter(s => {
    const matchesCategory = filterCategory === "all" || s.category === filterCategory;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    const Icon = CATEGORY_ICONS[category] || Settings;
    return <Icon className="w-5 h-5" />;
  };

  const canSubmit = form.name.trim().length >= 2 && form.duration_minutes > 0;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Pesquisar serviço..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-9 rounded-xl bg-muted/20 border-border/40 focus:bg-background transition-all"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
              <Sparkles className="w-4 h-4 opacity-40 shrink-0" />
            </div>
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="h-10 w-full sm:w-[160px] rounded-xl bg-muted/20 border-border/40">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">Todas categorias</SelectItem>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/10 border border-border/20">
            <Switch checked={showInactive} onCheckedChange={setShowInactive} className="scale-75" />
            <span className="text-xs font-medium text-muted-foreground">Inativos</span>
          </div>
        </div>
        <Button size="lg" className="h-10 px-5 rounded-xl gap-2 font-bold shadow-sm shadow-primary/20" onClick={openNew}>
          <Plus className="w-4 h-4" /> Novo Serviço
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
          <p className="text-sm text-muted-foreground animate-pulse font-medium">Carregando serviços...</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredActive.map(s => (
            <Card key={s.id} className="group overflow-hidden rounded-2xl border-border/40 hover:border-primary/30 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-0">
                <div className="flex items-start justify-between p-5">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                      {getCategoryIcon(s.category)}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted font-bold text-muted-foreground/80 tracking-wide uppercase">{s.category}</span>
                        {s.requires_evaluation && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold tracking-wide uppercase">Avaliação</span>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-base leading-tight text-foreground/90 truncate">{s.name}</h3>
                      <div className="flex items-center gap-3 pt-1">
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 opacity-60" />{s.duration_minutes} min</span>
                        {s.base_price != null && (
                          <span className="text-xs font-bold text-foreground/70 flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5 opacity-60" />R$ {s.base_price.toFixed(2).replace(".", ",")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/5" onClick={() => openEdit(s)} title="Editar">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                      onClick={() => setDeactivateTarget({ id: s.id, name: s.name })}
                      title="Desativar"
                      disabled={toggleActiveMutation.isPending}
                    >
                      <Archive className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {showInactive && filteredInactive.map(s => (
            <Card key={s.id} className="group overflow-hidden rounded-2xl border-dashed border-border group opacity-60 scale-[0.98] grayscale-[0.5] hover:grayscale-0 transition-all">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center text-muted-foreground shrink-0">
                      <Archive className="w-5 h-5 opacity-40" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest pl-0.5">Inativo</p>
                      <h3 className="font-display font-bold text-base leading-tight text-muted-foreground truncate">{s.name}</h3>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary hover:bg-primary/5"
                    onClick={() => toggleActiveMutation.mutate({ id: s.id, is_active: true })}
                    title="Reativar"
                    disabled={toggleActiveMutation.isPending}
                  >
                    <ArchiveRestore className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredActive.length === 0 && !isLoading && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center border border-dashed border-border">
                <Scissors className="w-8 h-8 text-muted-foreground/20" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-foreground/70">Nenhum serviço encontrado</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">Tente ajustar sua busca ou filtros para encontrar o serviço desejado.</p>
              </div>
            </div>
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={v => { if (!v) closeDialog(); else setDialogOpen(true); }}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">{editingId ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Nome *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome do serviço" maxLength={100} className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Categoria</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl">{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Duração (min) *</Label>
                <Input type="number" min={5} max={480} value={form.duration_minutes} onChange={e => setForm(f => ({ ...f, duration_minutes: parseInt(e.target.value) || 0 }))} className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Preço base (R$)</Label>
              <Input value={form.base_price} onChange={e => setForm(f => ({ ...f, base_price: e.target.value }))} placeholder="0,00" className="rounded-xl" />
            </div>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-muted/5 cursor-pointer hover:bg-muted/10 transition-colors">
              <Checkbox checked={form.requires_evaluation} onCheckedChange={v => setForm(f => ({ ...f, requires_evaluation: !!v }))} />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground/80">Requer avaliação prévia</span>
                <span className="text-[10px] text-muted-foreground leading-tight">Agendamentos dependerão de uma consulta inicial</span>
              </div>
            </label>
            <Button className="w-full h-11 rounded-xl font-bold gap-2" disabled={!canSubmit || mutation.isPending} onClick={() => mutation.mutate()}>
              {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? <Pencil className="w-3.5 h-3.5" /> : <Plus className="w-4 h-4" />}
              {editingId ? "Salvar Alterações" : "Cadastrar Serviço"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deactivateTarget} onOpenChange={v => { if (!v) setDeactivateTarget(null); }}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Desativar serviço?</AlertDialogTitle>
            <AlertDialogDescription>
              O serviço <strong className="text-foreground">{deactivateTarget?.name}</strong> não aparecerá mais para novos agendamentos. Você poderá reativá-lo futuramente nas configurações.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deactivateTarget) {
                  toggleActiveMutation.mutate({ id: deactivateTarget.id, is_active: false });
                  setDeactivateTarget(null);
                }
              }}
            >
              Sim, Desativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ServicosTab;
