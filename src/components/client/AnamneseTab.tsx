import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, ChevronDown, Pencil, Trash2, FileText, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import type { AnamnesisTemplate, TemplateField } from "@/components/settings/AnamnesesTab";
import AnamneseFillDialog from "./AnamneseFillDialog";

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

interface AnamneseTabProps {
  clientId: string;
  clientName: string;
}

const useActiveTemplates = () =>
  useQuery({
    queryKey: ["anamnesis_templates", false],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("anamnesis_templates")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return (data ?? []) as unknown as AnamnesisTemplate[];
    },
  });

const usePatientRecords = (clientId: string) =>
  useQuery({
    queryKey: ["patient_records", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patient_records")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as PatientRecord[];
    },
    enabled: !!clientId,
  });

const AnamneseTab = ({ clientId, clientName }: AnamneseTabProps) => {
  const queryClient = useQueryClient();
  const { data: templates = [] } = useActiveTemplates();
  const { data: records = [], isLoading } = usePatientRecords(clientId);
  const [fillTemplate, setFillTemplate] = useState<AnamnesisTemplate | null>(null);
  const [editingRecord, setEditingRecord] = useState<PatientRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PatientRecord | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (recordId: string) => {
      const { error } = await supabase
        .from("patient_records")
        .delete()
        .eq("id", recordId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient_records", clientId] });
      toast({ title: "Ficha excluída!" });
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const getFieldsFromContent = (record: PatientRecord): { label: string; value: string }[] => {
    const content = record.content as Record<string, unknown> | null;
    if (!content) return [];

    // Handle imported records: content is an array of {label, value}
    if (Array.isArray(content)) {
      return content
        .filter((item: any) => item.label || item.value)
        .map((item: any) => ({
          label: item.label ?? "",
          value: item.value ?? "",
        }));
    }

    // Handle template-based records: content has templateFields + answers
    const templateFields = (content.templateFields as TemplateField[]) ?? [];
    const answers = (content.answers as Record<string, string>) ?? {};

    return templateFields
      .filter((f) => f.isActive)
      .map((f) => ({
        label: f.label,
        value: answers[f.id] ?? "",
      }));
  };

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-1.5">
              <Plus className="w-4 h-4" /> Preencher Nova Ficha
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {templates.length === 0 && (
              <DropdownMenuItem disabled>
                Nenhum template cadastrado
              </DropdownMenuItem>
            )}
            {templates.map((t) => (
              <DropdownMenuItem key={t.id} onClick={() => setFillTemplate(t)}>
                <FileText className="w-4 h-4 mr-2" />
                {t.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <p className="text-xs text-muted-foreground">
          Para modificar, incluir ou excluir templates, acesse{" "}
          <span className="font-medium">Configurações &gt; Anamneses</span>.
        </p>
      </div>

      {/* Records timeline */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Nenhuma ficha preenchida para este cliente.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => {
            const date = parseISO(record.created_at);
            const fields = getFieldsFromContent(record);

            return (
              <div key={record.id} className="flex gap-4">
                {/* Date badge */}
                <div className="shrink-0 w-16 text-center">
                  <div className="bg-primary text-primary-foreground rounded-lg py-2 px-1">
                    <p className="text-lg font-bold leading-none">
                      {format(date, "dd")}
                    </p>
                  </div>
                  <p className="text-[10px] uppercase text-muted-foreground mt-1 font-medium">
                    {format(date, "MMM yyyy", { locale: ptBR })}
                  </p>
                </div>

                {/* Content card */}
                <Card className="flex-1">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-semibold text-sm">{clientName}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(date, "dd/MM/yyyy 'às' HH:mm")}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1"
                          onClick={() => setEditingRecord(record)}
                        >
                          <Pencil className="w-3 h-3" /> Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1 text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(record)}
                        >
                          <Trash2 className="w-3 h-3" /> Excluir
                        </Button>
                      </div>
                    </div>

                    {/* Template name */}
                    {record.title && (
                      <p className="text-xs text-muted-foreground mb-2 border-b border-border pb-2">
                        {record.title}
                      </p>
                    )}

                    {/* Filled fields */}
                    <div className="space-y-1">
                      {fields.map((f, i) => (
                        <p key={i} className="text-sm">
                          <span className="font-semibold">{f.label}</span>{" "}
                          {f.value || (
                            <span className="text-muted-foreground italic">
                              —
                            </span>
                          )}
                        </p>
                      ))}
                      {fields.length === 0 && (
                        <p className="text-xs text-muted-foreground italic">
                          Sem dados preenchidos
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {/* Fill dialog */}
      {fillTemplate && (
        <AnamneseFillDialog
          template={fillTemplate}
          clientId={clientId}
          existingRecord={null}
          onClose={() => setFillTemplate(null)}
        />
      )}

      {/* Edit dialog */}
      {editingRecord && (
        <AnamneseFillDialog
          template={null}
          clientId={clientId}
          existingRecord={editingRecord}
          onClose={() => setEditingRecord(null)}
        />
      )}

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => {
          if (!v) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir ficha?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A ficha será removida
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget) {
                  deleteMutation.mutate(deleteTarget.id);
                  setDeleteTarget(null);
                }
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AnamneseTab;
