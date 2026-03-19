import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, X, Check, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import type { AnamnesisTemplate, TemplateField } from "@/components/settings/AnamnesesTab";
import type { PatientRecord } from "./AnamneseTab";

// PatientRecord is now imported from AnamneseTab

interface AnamneseFillDialogProps {
  template: AnamnesisTemplate | null;
  clientId: string;
  existingRecord: PatientRecord | null;
  onClose: () => void;
  onSaveAndSign?: (recordId: string) => void;
}

const AnamneseFillDialog = ({
  template,
  clientId,
  existingRecord,
  onClose,
  onSaveAndSign,
}: AnamneseFillDialogProps) => {
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const isEditing = !!existingRecord;

  // Derive fields from template or existing record
  const fields: TemplateField[] = (
    isEditing
      ? (((existingRecord.content as any)?.templateFields as TemplateField[]) || (template?.fields ?? []))
      : (template?.fields ?? [])
  ).filter((f) => f.isActive);

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
        return existingRecord.id;
      } else {
        const { data, error } = await supabase.from("patient_records").insert([{
          client_id: clientId,
          record_type: "anamnese",
          title,
          content: JSON.parse(JSON.stringify(content)),
        }]).select("id").single();
        if (error) throw error;
        return data?.id;
      }
    },
    onSuccess: (newRecordId) => {
      queryClient.invalidateQueries({ queryKey: ["patient_records", clientId] });
      toast({ title: isEditing ? "Ficha atualizada!" : "Ficha preenchida!" });
      
      const shouldSign = (saveMutation.variables as any)?.shouldSign;
      if (shouldSign && newRecordId) {
        if (onSaveAndSign) {
          onSaveAndSign(newRecordId);
        }
      } else {
        onClose();
      }
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
          <div className="space-y-3">
            <Label className="text-base font-medium text-slate-700">{field.label}</Label>
            <RadioGroup
              value={value}
              onValueChange={(v) => updateAnswer(field.id, v)}
              className="flex flex-col gap-2"
            >
              {(field.options ?? []).map((opt) => {
                const isSelected = value === opt;
                return (
                  <label
                    key={opt}
                    className={`flex items-center gap-2 cursor-pointer text-sm font-medium transition-colors ${isSelected ? 'text-blue-600' : 'text-slate-600'}`}
                  >
                    <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                       {isSelected && <Check className="w-3 h-3 text-white stroke-[4]" />}
                       <RadioGroupItem value={opt} className="sr-only" />
                    </div>
                    {opt}
                  </label>
                );
              })}
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
          <div className="space-y-3 col-span-full mt-4">
            <Label className="text-base font-medium text-slate-700 border-b w-full block pb-2">{field.label}</Label>
            <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
               {/* Toolbar placeholder to match UI image */}
               <div className="bg-[#f0f2f5] border-b p-2 flex flex-wrap gap-1">
                  <div className="flex gap-0.5 border-r pr-1 mr-1">
                    {['B', 'I', 'U'].map(b => (
                      <div key={b} className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded cursor-pointer">{b}</div>
                    ))}
                  </div>
                  <div className="flex gap-0.5 border-r pr-1 mr-1">
                    {['S', 'X', 'Y'].map(b => (
                      <div key={b} className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded cursor-pointer">{b}</div>
                    ))}
                  </div>
               </div>
               <Textarea
                 value={value}
                 onChange={(e) => updateAnswer(field.id, e.target.value)}
                 placeholder="Digite aqui..."
                 className="min-h-[300px] text-sm whitespace-pre border-none focus-visible:ring-0 bg-white rounded-none font-mono"
                 style={{ tabSize: 20 }}
               />
            </div>
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
      <DialogContent className="max-w-5xl p-0 overflow-hidden border-none shadow-2xl h-[95vh] flex flex-col">
        {/* Custom Blue Header */}
        <div className="bg-[#5c7cbe] text-white px-4 py-3 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-medium">{title}</h2>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={onClose}
            className="bg-[#eb5757] hover:bg-[#d44343] text-white border-none h-8 gap-1 upper px-4"
          >
            <X className="w-4 h-4" /> FECHAR
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto bg-white p-6 pt-8">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Top Metadata Fields */}
            <div className="flex flex-wrap gap-8 items-end mb-10 border-b pb-8">
              <div className="space-y-2">
                <Label className="text-slate-500 font-normal">Data Cadastro</Label>
                <Input 
                  type="text" 
                  value={new Date(existingRecord?.created_at || new Date()).toLocaleDateString("pt-BR")} 
                  readOnly 
                  className="max-w-[150px] bg-white border-slate-200"
                />
              </div>
              <div className="space-y-2 flex-1 min-w-[300px]">
                <Label className="text-slate-500 font-normal">Quem pode ver esta ficha ou contrato?</Label>
                <Select defaultValue="public">
                  <SelectTrigger className="w-full bg-white border-slate-200">
                    <SelectValue placeholder="Selecione a visibilidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Público - todos podem ver</SelectItem>
                    <SelectItem value="private">Privado - apenas eu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6">
              {fields.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">
                  Nenhum campo configurado neste template.
                </p>
              ) : (
                renderFields()
              )}
            </div>
          </div>
        </div>

        {/* Custom Footer with Green Save Button */}
        <div className="p-4 bg-slate-50 border-t flex flex-col sm:flex-row gap-3 items-center justify-center shrink-0">
          <Button
            className="w-full sm:max-w-md h-12 bg-[#27ae60] hover:bg-[#219150] text-white font-bold uppercase tracking-wider gap-2 shadow-lg transition-all"
            disabled={saveMutation.isPending}
            onClick={() => saveMutation.mutate({ shouldSign: false } as any)}
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Check className="w-5 h-5" />
            )}
            SALVAR
          </Button>
          <Button
            className="w-full sm:max-w-md h-12 bg-[#5c7cbe] hover:bg-[#4a65a1] text-white font-bold uppercase tracking-wider gap-2 shadow-lg transition-all"
            disabled={saveMutation.isPending}
            onClick={() => saveMutation.mutate({ shouldSign: true } as any)}
          >
            {saveMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            SALVAR E ASSINAR
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto h-12 bg-[#e0e4ed] hover:bg-[#d1d7e2] text-slate-700 border-none px-10 font-bold uppercase tracking-wider gap-2"
          >
            <X className="w-5 h-5" /> FECHAR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnamneseFillDialog;
