import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

interface PatientRecord {
  id: string;
  client_id: string;
  professional_id: string | null;
  record_type: string;
  title: string | null;
  content: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

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
    ? ((existingRecord.content as Record<string, unknown>)?.templateFields as TemplateField[]) ?? []
    : (template?.fields ?? []).filter((f) => f.isActive);

  const title = isEditing
    ? existingRecord.title ?? "Ficha"
    : template?.name ?? "Ficha";

  useEffect(() => {
    if (isEditing && existingRecord.content) {
      const content = existingRecord.content as Record<string, unknown>;
      setAnswers((content.answers as Record<string, string>) ?? {});
    } else {
      setAnswers({});
    }
  }, [isEditing, existingRecord]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const content = {
        templateFields: fields,
        answers,
        templateId: isEditing
          ? (existingRecord.content as Record<string, unknown>)?.templateId
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
