import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { AnamnesisTemplate, TemplateField } from "@/components/settings/AnamnesesTab";
import type { PatientRecord } from "./AnamneseTab";

// PatientRecord is now imported from AnamneseTab

interface AnamneseFillDialogProps {
  template: AnamnesisTemplate | null;
  clientId: string;
  existingRecord: PatientRecord | null;
  onClose: () => void;
}

const AnamneseFillDialog = ({
  template,
  clientId,
  existingRecord,
  onClose,
}: AnamneseFillDialogProps) => {
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const isEditing = !!existingRecord;

  // Derive fields from template or existing record
  const fields: TemplateField[] = isEditing
    ? ((existingRecord.content as any)?.templateFields as TemplateField[]) ?? []
    : (template?.fields ?? []).filter((f) => f.isActive);

  const title = isEditing
    ? existingRecord.title ?? "Ficha"
    : template?.name ?? "Ficha";

  const { data: client } = useQuery({
    queryKey: ["client", clientId],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("*").eq("id", clientId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!clientId,
  });

  const replaceTags = useCallback((text: string) => {
    if (!text || !client) return text;
    let replaced = text;
    replaced = replaced.replace(/@NomeCliente/g, client.full_name || "");
    replaced = replaced.replace(/@CPF/g, client.cpf || "");
    replaced = replaced.replace(/@RG/g, ""); // Not in DB schema
    replaced = replaced.replace(/@DataNascimento/g, client.birth_date ? new Date(client.birth_date).toLocaleDateString("pt-BR") : "");
    replaced = replaced.replace(/@Telefone1/g, client.phone || "");
    replaced = replaced.replace(/@Email1/g, client.email || "");
    replaced = replaced.replace(/@CEP/g, ""); // Not in DB schema
    replaced = replaced.replace(/@Endereco/g, client.address || "");
    replaced = replaced.replace(/@Numero/g, ""); // Not in DB schema
    replaced = replaced.replace(/@Complemento/g, ""); // Not in DB schema
    replaced = replaced.replace(/@Bairro/g, ""); // Not in DB schema
    replaced = replaced.replace(/@Cidade/g, client.city || "");
    replaced = replaced.replace(/@Estado/g, ""); // Not in DB schema
    replaced = replaced.replace(/@DataAtual/g, new Date().toLocaleDateString("pt-BR"));
    return replaced;
  }, [client]);

  const [hasInitializedModels, setHasInitializedModels] = useState(false);

  useEffect(() => {
    if (isEditing && existingRecord.content) {
      if (!hasInitializedModels) {
        const content = existingRecord.content as any;
        setAnswers((content.answers as Record<string, string>) ?? {});
        setHasInitializedModels(true);
      }
    } else if (!isEditing && client && !hasInitializedModels) {
      const initialAnswers: Record<string, string> = {};
      fields.forEach(f => {
        if (f.type === "modelo_padrao" && f.content) {
          initialAnswers[f.id] = replaceTags(f.content);
        }
      });
      setAnswers(initialAnswers);
      setHasInitializedModels(true);
    }
  }, [isEditing, existingRecord, client, fields, hasInitializedModels, replaceTags]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const content = {
        templateFields: fields,
        answers,
        templateId: isEditing
          ? (existingRecord.content as any)?.templateId
          : template?.id,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("patient_records")
          .update({ content: JSON.parse(JSON.stringify(content)), updated_at: new Date().toISOString() })
          .eq("id", existingRecord.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("patient_records").insert([{
          client_id: clientId,
          record_type: "anamnese",
          title,
          content: JSON.parse(JSON.stringify(content)),
        }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient_records", clientId] });
      toast({ title: isEditing ? "Ficha atualizada!" : "Ficha preenchida!" });
      onClose();
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const updateAnswer = (fieldId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  // Group fields considering sameLine
  const renderFields = () => {
    const elements: JSX.Element[] = [];
    let i = 0;

    while (i < fields.length) {
      const field = fields[i];

      // Check if next field wants same line
      if (i + 1 < fields.length && fields[i + 1].sameLine) {
        const nextField = fields[i + 1];
        elements.push(
          <div key={field.id} className="grid grid-cols-2 gap-3">
            {renderField(field)}
            {renderField(nextField)}
          </div>
        );
        i += 2;
      } else {
        elements.push(
          <div key={field.id}>{renderField(field)}</div>
        );
        i += 1;
      }
    }
    return elements;
  };

  const renderField = (field: TemplateField) => {
    const value = answers[field.id] ?? "";

    switch (field.type) {
      case "multiple_choice":
        return (
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">{field.label}</Label>
            <RadioGroup
              value={value}
              onValueChange={(v) => updateAnswer(field.id, v)}
              className="flex flex-wrap gap-3"
            >
              {(field.options ?? []).map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-1.5 cursor-pointer text-sm"
                >
                  <RadioGroupItem value={opt} />
                  {opt}
                </label>
              ))}
            </RadioGroup>
          </div>
        );

      case "long_text":
        return (
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">{field.label}</Label>
            <Textarea
              value={value}
              onChange={(e) => updateAnswer(field.id, e.target.value)}
              placeholder={field.label}
              rows={3}
            />
          </div>
        );

      case "modelo_padrao":
        return (
          <div className="space-y-1.5 col-span-full">
            <Label className="text-sm font-medium">{field.label}</Label>
            <Textarea
              value={value}
              onChange={(e) => updateAnswer(field.id, e.target.value)}
              placeholder="Conteúdo do Contrato..."
              className="min-h-[250px] text-sm whitespace-pre-wrap"
            />
          </div>
        );

      case "number":
        return (
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">{field.label}</Label>
            <Input
              type="number"
              value={value}
              onChange={(e) => updateAnswer(field.id, e.target.value)}
              placeholder={field.label}
              step="any"
            />
          </div>
        );

      case "short_text":
      default:
        return (
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">{field.label}</Label>
            <Input
              value={value}
              onChange={(e) => updateAnswer(field.id, e.target.value)}
              placeholder={field.label}
            />
          </div>
        );
    }
  };

  return (
    <Dialog open onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEditing ? `Editar: ${title}` : title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {fields.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              Nenhum campo configurado neste template.
            </p>
          ) : (
            renderFields()
          )}

          <Button
            className="w-full"
            disabled={saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
          >
            {saveMutation.isPending && (
              <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
            )}
            {isEditing ? "Salvar Alterações" : "Salvar Ficha"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnamneseFillDialog;
