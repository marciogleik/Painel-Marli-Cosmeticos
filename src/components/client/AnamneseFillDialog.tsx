import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, X, Check, Save, ChevronDown, FileText, Table } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import type { AnamnesisTemplate, TemplateField } from "@/components/settings/AnamnesesTab";
import type { PatientRecord } from "./AnamneseTab";
import { TableEditor } from "./TableEditor";
import { TechnicalObservationsGrid } from "./TechnicalObservationsGrid";
import { parseLegacyTechnicalObservation } from "@/utils/legacyProcedureParser";

// PatientRecord is now imported from AnamneseTab

const isTableField = (label: string, fieldType?: string, currentValue?: any) => {
  const l = (label || "").toLowerCase();
  
  // If it's multiple choice or short text, it's NOT a table, even if it has keywords
  if (fieldType === "multiple_choice" || fieldType === "short_text") return false;

  // Condição Especial para "Laser" que salva num formato legado com muitos espaços
  if (l === 'laser' || l === 'sessão' || l === 'procedimento') return true;

  if (typeof currentValue === 'string' && currentValue && !currentValue.includes('{')) {
    const isLegacyTable = (currentValue.includes('Sessão') || currentValue.includes('Data') || currentValue.includes('Parâmetros'));
    const spacesCount = (currentValue.match(/\s{3,}/g) || []).length;
    if (isLegacyTable && spacesCount > 2) return true; // Detect mock tables
  }

  if (l.includes('observações técnicas') || l.includes('evolução') || l.includes('técnica') || 
      l.includes('histórico') || l.includes('procedimento realizado')) return true;

  return false;
};

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
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const isEditing = !!existingRecord;

  // Derive fields from template or existing record with Sync Logic
  const fields: TemplateField[] = (() => {
    if (!isEditing) return (template?.fields ?? []).filter(f => f.isActive);
    
    const savedFields = ((existingRecord.content as any)?.templateFields as TemplateField[]) || [];
    const currentTemplateFields = template?.fields ?? [];
    
    if (currentTemplateFields.length === 0) return savedFields.filter(f => f.isActive);
    
    // Map current template fields for lookup
    const templateIds = new Set(currentTemplateFields.map(f => f.id));
    const savedMap = new Map(savedFields.map(f => [f.id, f]));
    
    // 1. Start with current template fields (authoritative structure)
    const syncedFields = currentTemplateFields.map(tField => {
      const saved = savedMap.get(tField.id);
      // We keep the template's version of the field but it will use the answer from state
      return tField;
    });
    
    // 2. Add orphaned fields (existed in record but removed from template) to preserve history
    const orphanedFields = savedFields.filter(f => !templateIds.has(f.id));
    
    return [...syncedFields, ...orphanedFields].filter(f => f.isActive);
  })().filter((f) => f.isActive);

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

  const { data: myProfessional } = useQuery({
    queryKey: ["my-professional-id", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("professionals")
        .select("id")
        .eq("user_id", user.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const [hasInitializedModels, setHasInitializedModels] = useState(false);

  const parseLegacyAnswers = useCallback((text: string, templateFields: TemplateField[]) => {
    const legacyAnswers: Record<string, string> = {};
    if (!text) return legacyAnswers;

    // Split by newline and try to find labels
    const lines = text.split("\n");
    templateFields.forEach(field => {
      const cleanLabel = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
      const targetLabel = cleanLabel(field.label);
      
      // Try exact or contains match on the line label
      const line = lines.find(l => {
        const lineParts = l.split(":");
        if (lineParts.length < 2) return false;
        const lineLabel = cleanLabel(lineParts[0]);
        return lineLabel === targetLabel || lineLabel.includes(targetLabel) || targetLabel.includes(lineLabel);
      });

      if (line) {
        const parts = line.split(":");
        let value = parts.slice(1).join(":").trim();
        while (value.startsWith(":")) value = value.substring(1).trim();
        legacyAnswers[field.id] = value;
      }
    });

    // Special case for procedural notes which might be at the end or in a different format
    if (!legacyAnswers['proced_realizado']) {
      const procedLine = lines.find(l => l.includes("Procedimento Realizado"));
      if (procedLine) {
        const parts = procedLine.split(":");
        legacyAnswers['proced_realizado'] = parts.slice(1).join(":").trim();
      }
    }

    return legacyAnswers;
  }, []);

  useEffect(() => {
    if (isEditing && existingRecord.content) {
      if (!hasInitializedModels) {
        const content = existingRecord.content as any;
        let initialAnswers = (content.answers as Record<string, string>) ?? {};
        
        // If answers are empty but we have an array (legacy format), try to parse
        if (Object.keys(initialAnswers).length === 0 && Array.isArray(content)) {
          const legacyContent = content as { label: string; value: string }[];
          const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
          const mappedIds = new Set<string>();
          
          // 1. Map items to fields by label (fuzzy match)
          legacyContent.forEach(item => {
            const itemL = clean(item.label || "");
            if (!itemL) return;

            const field = fields.find(f => {
              const fL = clean(f.label);
              return fL === itemL || fL.includes(itemL) || itemL.includes(fL);
            });

            if (field) {
              initialAnswers[field.id] = item.value;
              mappedIds.add(field.id);
            }
          });

          // 2. If technical or description fields exist, they might contain multiple Q&A pairs
          legacyContent.forEach(item => {
            const isTechnical = ["observação", "descrição", "laser", "técnica", "anotações"].some(k => item.label?.toLowerCase().includes(k));
            if (isTechnical && item.value) {
              const parsed = parseLegacyAnswers(item.value, fields);
              Object.keys(parsed).forEach(fid => {
                if (!initialAnswers[fid]) {
                  initialAnswers[fid] = parsed[fid];
                  mappedIds.add(fid);
                }
              });
            }
          });

          // 3. Data Loss Prevention: If we have legacy data that wasn't mapped, 
          // and we have a technical/table field, dump everything unmapped into its notes.
          const tableField = fields.find(f => isTableField(f.label, f.type));
          if (tableField) {
            let unmappedNote = "";
            legacyContent.forEach(item => {
               // If this item's label wasn't reasonably mapped to any field, add to notes
               const field = fields.find(f => clean(f.label) === clean(item.label || ""));
               if (!field && item.value && item.value.length > 0) {
                 unmappedNote += (unmappedNote ? "\n\n" : "") + `${item.label}: ${item.value}`;
               }
            });

            if (unmappedNote) {
              const currentVal = initialAnswers[tableField.id] || "";
              if (currentVal.includes('{"isStructured":true')) {
                try {
                  const parsed = JSON.parse(currentVal);
                  parsed.notes = (parsed.notes ? parsed.notes + "\n\n" : "") + "DADOS RECUPERADOS:\n" + unmappedNote;
                  initialAnswers[tableField.id] = JSON.stringify(parsed);
                } catch(e) {}
              } else {
                initialAnswers[tableField.id] = (currentVal ? currentVal + "\n\n" : "") + "DADOS RECUPERADOS:\n" + unmappedNote;
              }
            }
          }
        }
        
        // Final Cleanup: move table-like data to technical field
        const cleanedAnswers = { ...initialAnswers };
        const mainTableField = fields.find(f => isTableField(f.label, f.type));
        
        if (mainTableField) {
          Object.keys(cleanedAnswers).forEach(fid => {
            const val = cleanedAnswers[fid];
            if (fid !== mainTableField.id && typeof val === 'string' && val.length > 20) {
              const parsed = parseLegacyTechnicalObservation(val);
              if (parsed.isTable || val.toLowerCase().includes("procedimento realizado")) {
                if (!cleanedAnswers[mainTableField.id] || cleanedAnswers[mainTableField.id].length < 10) {
                  cleanedAnswers[mainTableField.id] = val;
                  cleanedAnswers[fid] = "";
                }
              }
            }
          });
        }
        
        setAnswers(cleanedAnswers);
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
  }, [isEditing, existingRecord, client, fields, hasInitializedModels, replaceTags, parseLegacyAnswers]);

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
          professional_id: myProfessional?.id || null,
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

    if (isTableField(field.label, field.type, value)) {
      return (
        <div className="space-y-3 col-span-full mt-6 mb-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <Label className="text-base font-semibold text-[#5c7cbe]">{field.label}</Label>
          </div>
          <TechnicalObservationsGrid 
            label={field.label}
            value={value} 
            onChange={(v) => updateAnswer(field.id, v)} 
          />
        </div>
      );
    }

    switch (field.type) {
      case "multiple_choice":
        return (
          <div className="space-y-3">
            <Label className="text-base font-medium text-slate-700">{field.label}</Label>
            <div className="flex flex-col gap-2">
              {(field.options ?? []).map((opt) => {
                const isSelected = value === opt;
                return (
                  <div
                    key={opt}
                    onClick={() => updateAnswer(field.id, opt)}
                    className={`flex items-center gap-2 cursor-pointer text-sm font-medium transition-colors ${isSelected ? 'text-blue-600' : 'text-slate-600'}`}
                  >
                    <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                       {isSelected && <Check className="w-3 h-3 text-white stroke-[4]" />}
                    </div>
                    {opt}
                  </div>
                );
              })}
            </div>
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
          <div className="space-y-3 col-span-full mt-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <Label className="text-base font-semibold text-[#5c7cbe]">{field.label}</Label>
            </div>
            <div className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
               {/* Professional Toolbar matching the UI image */}
               <div className="bg-[#f8f9fa] border-b p-1.5 flex flex-wrap gap-1 items-center">
                  <div className="flex gap-0.5 border-r border-slate-300 pr-1.5 mr-1">
                    {['B', 'I', 'U'].map(b => (
                      <button key={b} className="w-8 h-8 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200 rounded transition-colors text-xs">{b}</button>
                    ))}
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 rounded transition-colors">
                      <div className="w-3 h-3 bg-slate-700 rounded-sm" />
                    </button>
                  </div>
                  <div className="flex gap-0.5 border-r border-slate-300 pr-1.5 mr-1">
                    {['S', 'X²', 'X₂'].map(b => (
                      <button key={b} className="w-8 h-8 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200 rounded transition-colors text-[10px]">{b}</button>
                    ))}
                  </div>
                  <div className="flex gap-0.5 border-r border-slate-300 pr-1.5 mr-1 line-clamp-1">
                    <button className="h-8 px-2 flex items-center justify-center font-medium text-slate-700 hover:bg-slate-200 rounded transition-colors text-[10px] gap-1">13 <ChevronDown className="w-3 h-3" /></button>
                    <button className="h-8 px-2 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200 rounded transition-colors text-[10px] gap-1"><span className="border-b-2 border-yellow-400">A</span> <ChevronDown className="w-3 h-3" /></button>
                  </div>
                  <div className="flex gap-0.5 mr-1">
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 rounded transition-colors">
                      <FileText className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 rounded transition-colors rotate-90">
                      <ChevronDown className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 rounded transition-colors ml-1 border-l pl-2">
                      <Table className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
               </div>
               <Textarea
                 value={value}
                 onChange={(e) => updateAnswer(field.id, e.target.value)}
                 placeholder="Digite aqui..."
                 className="min-h-[250px] text-sm whitespace-pre border-none focus-visible:ring-0 bg-white rounded-none font-mono p-4 leading-relaxed"
                 style={{ tabSize: 20 }}
               />
               <div className="bg-[#f8f9fa] border-t h-2 flex items-center justify-center">
                 <div className="w-12 h-1 bg-slate-200 rounded-full" />
               </div>
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
