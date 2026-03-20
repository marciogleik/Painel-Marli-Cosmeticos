import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Plus, Pencil, Loader2, Trash2, GripVertical, Archive, ArchiveRestore, FileText, ChevronDown, ChevronUp,
  Type, AlignLeft, ListChecks, FileCode, Hash, Sparkles
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// ========== Types ==========
export interface TemplateField {
  id: string;
  type: "multiple_choice" | "short_text" | "long_text" | "modelo_padrao" | "number";
  label: string;
  options?: string[];
  content?: string;
  sameLine: boolean;
  isActive: boolean;
}

export interface AnamnesisTemplate {
  id: string;
  name: string;
  is_active: boolean;
  fields: TemplateField[];
  created_at: string;
  updated_at: string;
}

const FIELD_TYPE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  short_text: { label: "Texto Curto", icon: Type, color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  long_text: { label: "Texto Longo", icon: AlignLeft, color: "bg-indigo-500/10 text-indigo-600 border-indigo-200" },
  multiple_choice: { label: "Múltipla Escolha", icon: ListChecks, color: "bg-purple-500/10 text-purple-600 border-purple-200" },
  modelo_padrao: { label: "Modelo Padrão", icon: FileCode, color: "bg-amber-500/10 text-amber-600 border-amber-200" },
  number: { label: "Número", icon: Hash, color: "bg-green-500/10 text-green-600 border-green-200" },
};

const genId = () => crypto.randomUUID();

// ========== Hook ==========
const useAnamnesisTemplates = (includeInactive = false) => {
  return useQuery({
    queryKey: ["anamnesis_templates", includeInactive],
    queryFn: async () => {
      let query = supabase
        .from("anamnesis_templates")
        .select("*")
        .order("name");

      if (!includeInactive) query = query.eq("is_active", true);

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as unknown as AnamnesisTemplate[];
    },
  });
};

// ========== Field Editor Row ==========
const FieldRow = ({
  field,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  field: TemplateField;
  onUpdate: (f: TemplateField) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) => {
  const config = FIELD_TYPE_CONFIG[field.type];
  const Icon = config.icon;

  return (
    <div className="group relative flex flex-col gap-3 p-4 rounded-xl border border-border/40 bg-card hover:border-primary/20 hover:shadow-sm transition-all">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className={`p-1.5 rounded-lg border ${config.color} shrink-0`}>
            <Icon className="w-4 h-4" />
          </div>
          <Input
            value={field.label}
            onChange={(e) => onUpdate({ ...field, label: e.target.value })}
            placeholder="Nome do campo..."
            className="h-9 font-bold bg-transparent border-none focus-visible:ring-0 px-0 -ml-1 text-sm placeholder:font-normal"
          />
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={onMoveUp} disabled={isFirst}>
            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={onMoveDown} disabled={isLast}>
            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive" onClick={onRemove}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-4 items-center pl-8">
        <Select
          value={field.type}
          onValueChange={(v) => onUpdate({ ...field, type: v as TemplateField["type"], options: v === "multiple_choice" ? (field.options?.length ? field.options : ["Sim", "Não"]) : undefined })}
        >
          <SelectTrigger className="h-8 text-xs bg-muted/30 border-none rounded-lg focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {Object.entries(FIELD_TYPE_CONFIG).map(([val, cfg]) => (
              <SelectItem key={val} value={val}>
                <div className="flex items-center gap-2">
                  <cfg.icon className="w-3.5 h-3.5 opacity-60" />
                  <span>{cfg.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer group/switch">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover/switch:text-foreground/70 transition-colors">Mesma linha</span>
            <Switch
              checked={field.sameLine}
              onCheckedChange={(v) => onUpdate({ ...field, sameLine: v })}
              className="scale-[0.7]"
            />
          </label>
          <label className="flex items-center gap-2 cursor-pointer group/switch">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover/switch:text-foreground/70 transition-colors">Ativo</span>
            <Switch
              checked={field.isActive}
              onCheckedChange={(v) => onUpdate({ ...field, isActive: v })}
              className="scale-[0.7]"
            />
          </label>
        </div>
      </div>

      {field.type === "multiple_choice" && (
        <div className="pl-8 pt-1 space-y-1.5">
          <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Opções (separadas por vírgula)</Label>
          <Input
            value={(field.options ?? []).join(", ")}
            onChange={(e) => onUpdate({ ...field, options: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
            placeholder="Sim, Não, Talvez"
            className="h-8 text-xs bg-muted/20 border-dashed rounded-lg"
          />
        </div>
      )}

      {field.type === "modelo_padrao" && (
        <div className="pl-8 pt-1 space-y-1.5">
          <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Conteúdo do Modelo</Label>
          <Textarea
            value={field.content ?? ""}
            onChange={(e) => onUpdate({ ...field, content: e.target.value })}
            placeholder="Digite o texto do contrato com as variáveis (@NomeCliente, etc)"
            className="text-xs min-h-[120px] bg-muted/20 border-dashed rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

// ========== Main Component ==========
const AnamnesesTab = () => {
  const queryClient = useQueryClient();
  const [showInactive, setShowInactive] = useState(false);
  const { data: templates = [], isLoading } = useAnamnesisTemplates(showInactive);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [deactivateTarget, setDeactivateTarget] = useState<{ id: string; name: string } | null>(null);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: name.trim(),
        fields: JSON.parse(JSON.stringify(fields)),
      };

      if (editingId) {
        const { error } = await supabase.from("anamnesis_templates").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("anamnesis_templates").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anamnesis_templates"] });
      toast({ title: editingId ? "Template atualizado!" : "Template cadastrado!" });
      closeDialog();
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("anamnesis_templates").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { is_active }) => {
      queryClient.invalidateQueries({ queryKey: ["anamnesis_templates"] });
      toast({ title: is_active ? "Template reativado!" : "Template desativado!" });
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const openNew = () => {
    setEditingId(null);
    setName("");
    setFields([]);
    setDialogOpen(true);
  };

  const openEdit = (t: AnamnesisTemplate) => {
    setEditingId(t.id);
    setName(t.name);
    setFields(t.fields ?? []);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setName("");
    setFields([]);
  };

  const addField = () => {
    setFields(prev => [
      ...prev,
      { id: genId(), type: "short_text", label: "", sameLine: false, isActive: true },
    ]);
  };

  const updateField = (index: number, updated: TemplateField) => {
    setFields(prev => prev.map((f, i) => (i === index ? updated : f)));
  };

  const removeField = (index: number) => {
    setFields(prev => prev.filter((_, i) => i !== index));
  };

  const moveField = (index: number, direction: -1 | 1) => {
    setFields(prev => {
      const arr = [...prev];
      const target = index + direction;
      if (target < 0 || target >= arr.length) return arr;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return arr;
    });
  };

  const active = templates.filter(t => t.is_active);
  const inactive = templates.filter(t => !t.is_active);
  const canSubmit = name.trim().length >= 2 && fields.length > 0 && fields.every(f => f.label.trim().length > 0);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-xs font-bold text-primary flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              {active.length} Template{active.length !== 1 ? "s" : ""} Ativo{active.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/10 border border-border/20">
            <Switch checked={showInactive} onCheckedChange={setShowInactive} className="scale-75" />
            <span className="text-xs font-medium text-muted-foreground">Inativos</span>
          </div>
        </div>
        <Button size="lg" className="h-10 px-5 rounded-xl gap-2 font-bold shadow-sm shadow-primary/20" onClick={openNew}>
          <Plus className="w-4 h-4" /> Novo Template
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
          <p className="text-sm text-muted-foreground animate-pulse font-medium">Carregando templates...</p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full space-y-3">
          {active.map(t => (
            <AccordionItem value={t.id} key={t.id} className="border-none">
              <Card className="overflow-hidden border-border/40 hover:border-primary/20 transition-all shadow-sm">
                <AccordionTrigger className="hover:no-underline p-0 data-[state=open]:bg-muted/10 transition-colors">
                  <div className="flex items-center gap-4 text-left w-full p-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-base text-foreground/90">{t.name}</h3>
                      <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                        <Sparkles className="w-3 h-3 opacity-60" />
                        {(t.fields ?? []).filter(f => f.isActive).length} campos ativos
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-0 border-t border-border/10 bg-muted/5">
                  <div className="p-5 space-y-5">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-8 rounded-lg gap-1.5 font-bold" onClick={() => openEdit(t)}>
                        <Pencil className="w-3.5 h-3.5 text-primary" /> Editar Estrutura
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 rounded-lg gap-1.5 font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                        onClick={() => setDeactivateTarget({ id: t.id, name: t.name })}
                      >
                        <Archive className="w-3.5 h-3.5" /> Desativar
                      </Button>
                    </div>
                    
                    {(!t.fields || t.fields.length === 0) ? (
                      <div className="text-center py-6 border-2 border-dashed border-border/30 rounded-2xl">
                        <p className="text-sm text-muted-foreground font-medium">Nenhum campo configurado neste template.</p>
                      </div>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {t.fields.map((f, i) => {
                          const config = FIELD_TYPE_CONFIG[f.type] || { label: f.type, icon: FileText, color: "bg-muted" };
                          return (
                            <div key={f.id} className="flex flex-col gap-2 p-4 rounded-xl border border-border/40 bg-background/60 shadow-sm">
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-muted-foreground/50">{String(i + 1).padStart(2, "0")}</span>
                                    <p className="font-bold text-sm text-foreground/80 leading-tight">{f.label}</p>
                                  </div>
                                  <Badge variant="outline" className={`text-[10px] font-bold px-2 border-none ${config.color}`}>
                                    {config.label}
                                  </Badge>
                                </div>
                                {!f.isActive && <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-tighter">Inativo</Badge>}
                              </div>
                              
                              {f.options && f.options.length > 0 && (
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {f.options.slice(0, 5).map(opt => (
                                    <Badge key={opt} className="bg-muted/50 text-muted-foreground text-[9px] font-medium border-none px-1.5">
                                      {opt}
                                    </Badge>
                                  ))}
                                  {f.options.length > 5 && (
                                    <span className="text-[9px] text-muted-foreground/60 font-medium pl-1">+{f.options.length - 5} mais...</span>
                                  )}
                                </div>
                              )}

                              {f.sameLine && (
                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-primary/60 uppercase tracking-widest mt-auto pt-2 border-t border-border/5">
                                  <GripVertical className="w-2.5 h-2.5" /> Lado a Lado
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}

          {showInactive && inactive.map(t => (
            <Card key={t.id} className="group overflow-hidden rounded-2xl border-dashed border-border opacity-50 scale-[0.98] grayscale-[0.8] hover:grayscale-0 transition-all">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-2xl bg-muted/40 flex items-center justify-center text-muted-foreground shrink-0">
                  <Archive className="w-5 h-5 opacity-40" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-sm text-muted-foreground truncate">{t.name}</h3>
                  <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5">Template Inativo</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary hover:bg-primary/5"
                  onClick={() => toggleActiveMutation.mutate({ id: t.id, is_active: true })}
                >
                  <ArchiveRestore className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}

          {active.length === 0 && !isLoading && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center border border-dashed border-border">
                <FileText className="w-8 h-8 text-muted-foreground/20" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-foreground/70">Nenhum template encontrado</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">Comece criando um novo template para agilizar seus prontuários.</p>
              </div>
            </div>
          )}
        </Accordion>
      )}

      {/* Template editor dialog */}
      <Dialog open={dialogOpen} onOpenChange={v => { if (!v) closeDialog(); else setDialogOpen(true); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-0 border-none shadow-2xl">
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/10 p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                {editingId ? "Editar Template" : "Novo Template"}
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Nome do Template *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Anamnese Corporal Express"
                maxLength={100}
                className="h-11 rounded-xl font-medium"
              />
            </div>

            <Separator className="opacity-40" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground/80">Configuração de Campos</h4>
                  <p className="text-[10px] text-muted-foreground font-medium">Defina as perguntas e tipos de resposta</p>
                </div>
                <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs gap-1.5 font-bold border-primary/20 text-primary hover:bg-primary/5" onClick={addField}>
                  <Plus className="w-3.5 h-3.5" /> Adicionar Campo
                </Button>
              </div>

              {fields.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border/20 rounded-3xl bg-muted/5">
                  <Sparkles className="w-10 h-10 text-muted-foreground/10 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground font-medium max-w-[200px] mx-auto">
                    Nenhum campo adicionado. Clique no botão acima para começar.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {fields.map((field, i) => (
                    <FieldRow
                      key={field.id}
                      field={field}
                      onUpdate={(f) => updateField(i, f)}
                      onRemove={() => removeField(i)}
                      onMoveUp={() => moveField(i, -1)}
                      onMoveDown={() => moveField(i, 1)}
                      isFirst={i === 0}
                      isLast={i === fields.length - 1}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="sticky bottom-0 z-10 bg-background/80 backdrop-blur-md border-t border-border/10 p-6 flex gap-3">
            <Button variant="ghost" className="flex-1 h-11 rounded-xl font-bold" onClick={closeDialog}>Cancelar</Button>
            <Button
              className="flex-[2] h-11 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20"
              disabled={!canSubmit || saveMutation.isPending}
              onClick={() => saveMutation.mutate()}
            >
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? <Pencil className="w-3.5 h-3.5" /> : <Plus className="w-4 h-4" />}
              {editingId ? "Salvar Alterações" : "Criar Template"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Deactivate confirmation */}
      <AlertDialog open={!!deactivateTarget} onOpenChange={v => { if (!v) setDeactivateTarget(null); }}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Desativar template?</AlertDialogTitle>
            <AlertDialogDescription>
              O template <strong className="text-foreground">{deactivateTarget?.name}</strong> não poderá mais ser utilizado em novas consultas. Os prontuários existentes baseados nele não serão afetados.
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

export default AnamnesesTab;
