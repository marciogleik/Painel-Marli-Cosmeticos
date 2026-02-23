import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus, Pencil, Loader2, Trash2, GripVertical, Archive, ArchiveRestore, FileText, ChevronDown, ChevronUp,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// ========== Types ==========
export interface TemplateField {
  id: string;
  type: "multiple_choice" | "short_text" | "long_text";
  label: string;
  options?: string[];
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

const FIELD_TYPE_LABELS: Record<string, string> = {
  multiple_choice: "Múltipla Escolha",
  short_text: "Texto Curto",
  long_text: "Texto Longo",
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
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg border bg-card">
      <div className="flex flex-col gap-0.5 pt-1">
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onMoveUp} disabled={isFirst}>
          <ChevronUp className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onMoveDown} disabled={isLast}>
          <ChevronDown className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="flex-1 space-y-2 min-w-0">
        <div className="grid grid-cols-[1fr_140px] gap-2">
          <Input
            value={field.label}
            onChange={(e) => onUpdate({ ...field, label: e.target.value })}
            placeholder="Nome do campo"
            className="h-8 text-sm"
          />
          <Select
            value={field.type}
            onValueChange={(v) => onUpdate({ ...field, type: v as TemplateField["type"], options: v === "multiple_choice" ? (field.options?.length ? field.options : ["Sim", "Não"]) : undefined })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple_choice">Múltipla Escolha</SelectItem>
              <SelectItem value="short_text">Texto Curto</SelectItem>
              <SelectItem value="long_text">Texto Longo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {field.type === "multiple_choice" && (
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Opções (separadas por vírgula)</Label>
            <Input
              value={(field.options ?? []).join(", ")}
              onChange={(e) => onUpdate({ ...field, options: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
              placeholder="Sim, Não"
              className="h-7 text-xs"
            />
          </div>
        )}

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-muted-foreground">
            <Switch
              checked={field.sameLine}
              onCheckedChange={(v) => onUpdate({ ...field, sameLine: v })}
              className="scale-[0.6]"
            />
            Mesma linha
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-muted-foreground">
            <Switch
              checked={field.isActive}
              onCheckedChange={(v) => onUpdate({ ...field, isActive: v })}
              className="scale-[0.6]"
            />
            Ativo
          </label>
        </div>
      </div>

      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0" onClick={onRemove}>
        <Trash2 className="w-3.5 h-3.5" />
      </Button>
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
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">{active.length} template{active.length !== 1 ? "s" : ""} ativo{active.length !== 1 ? "s" : ""}</p>
          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-muted-foreground">
            <Switch checked={showInactive} onCheckedChange={setShowInactive} className="scale-75" />
            Inativos
          </label>
        </div>
        <Button size="sm" className="gap-1.5" onClick={openNew}>
          <Plus className="w-4 h-4" /> Novo Template
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-2">
          {active.map(t => (
            <Card key={t.id} className="group">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(t.fields ?? []).filter(f => f.isActive).length} campos ativos
                  </p>
                </div>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(t)} title="Editar">
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeactivateTarget({ id: t.id, name: t.name })}
                    title="Desativar"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {showInactive && inactive.map(t => (
            <Card key={t.id} className="group opacity-50 border-dashed">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{t.name}</p>
                    <Badge variant="secondary" className="text-[10px]">Inativo</Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                  onClick={() => toggleActiveMutation.mutate({ id: t.id, is_active: true })}
                  title="Reativar"
                >
                  <ArchiveRestore className="w-3.5 h-3.5" />
                </Button>
              </CardContent>
            </Card>
          ))}

          {active.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Nenhum template cadastrado</p>
              <p className="text-xs text-muted-foreground mt-0.5">Crie seu primeiro template de anamnese</p>
            </div>
          )}
        </div>
      )}

      {/* Template editor dialog */}
      <Dialog open={dialogOpen} onOpenChange={v => { if (!v) closeDialog(); else setDialogOpen(true); }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingId ? "Editar Template" : "Novo Template de Anamnese"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs">Nome do Template *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Anamnese Facial"
                maxLength={100}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Campos ({fields.length})</Label>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={addField}>
                  <Plus className="w-3 h-3" /> Adicionar Campo
                </Button>
              </div>

              {fields.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Adicione campos ao template clicando no botão acima
                </p>
              )}

              <div className="space-y-2">
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
            </div>

            <Button
              className="w-full"
              disabled={!canSubmit || saveMutation.isPending}
              onClick={() => saveMutation.mutate()}
            >
              {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
              {editingId ? "Salvar Alterações" : "Cadastrar Template"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Deactivate confirmation */}
      <AlertDialog open={!!deactivateTarget} onOpenChange={v => { if (!v) setDeactivateTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desativar template?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deactivateTarget?.name}</strong> não poderá ser usado para novas fichas. Fichas já preenchidas serão mantidas.
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

export default AnamnesesTab;
