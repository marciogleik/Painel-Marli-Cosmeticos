import { useEffect, useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown as ChevronDownIcon, ChevronUp as ChevronUpIcon } from "lucide-react";
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
import { Plus, ChevronDown, Pencil, Trash2, FileText, Loader2, Image, Lock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { SignaturePad } from "@/components/SignaturePad";
import type { AnamnesisTemplate, TemplateField } from "@/components/settings/AnamnesesTab";
import { useAuth } from "@/hooks/useAuth";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];
export type PatientRecord = Tables["patient_records"]["Row"];
import AnamneseFillDialog from "./AnamneseFillDialog";
import { RecordOptionsMenu } from "./RecordOptionsMenu";
import { parseLegacyTechnicalObservation } from "@/utils/legacyProcedureParser";

// PatientRecord is now imported from types

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
        .select(`
          *,
          client_attachments (
            id,
            file_path,
            file_type,
            privacy_type,
            professional_id
          )
        `)
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as (PatientRecord & { client_attachments: any[] })[];
    },
    enabled: !!clientId,
  });

/** Parsed Q&A row */
interface QARow {
  question: string;
  answer: string;
  isRaw?: boolean;
}

/** Flatten fields into displayable Q&A rows */
const flattenFields = (fields: { label: string; value: string }[]): QARow[] => {
  const rows: QARow[] = [];
  for (const f of fields) {
    if (!f.value) continue;

    // Se for o JSON estruturado da nova grid, ou um campo puramente técnico legado,
    // não podemos dar split por \n, senão destruímos a string (e geramos a lista vertical repetitiva).
    const isTech = ["observação", "observações", "técnica", "procedimento", "descrição", "histórico"].some(k => (f.label || "").toLowerCase().includes(k));
    let isStructuredJson = false;
    try {
      const parsed = JSON.parse(f.value);
      if (parsed?.isStructured) isStructuredJson = true;
    } catch (e) {}

    if (isStructuredJson || isTech) {
      rows.push({ question: f.label, answer: f.value });
      continue;
    }

    const lines = f.value ? f.value.split("\n").filter(Boolean) : [];
    const hasMultipleQA = lines.length > 1 && lines.some((l) => /\?.*:/.test(l));

    if (hasMultipleQA) {
      // If there's a label, add it as a section header
      if (f.label) {
        rows.push({ question: f.label, answer: "", isRaw: false });
      }
      for (const line of lines) {
        // Try to split on "?: " or ": " patterns
        const qMatch = line.match(/^(.+?\??)\s*:\s*(.+)$/);
        if (qMatch) {
          rows.push({ question: qMatch[1].trim(), answer: qMatch[2].trim() });
        } else {
          rows.push({ question: "", answer: line, isRaw: true });
        }
      }
    } else {
      rows.push({ question: f.label, answer: f.value });
    }
  }
  return rows;
};

  const RecordFields = ({
    fields,
    recordId,
    isExpanded,
    onToggle,
    collapsedLimit,
  }: {
    fields: { label: string; value: string }[];
    recordId: string;
    isExpanded: boolean;
    onToggle: () => void;
    collapsedLimit: number;
  }) => {
    const rows = useMemo(() => flattenFields(fields), [fields]);
  
    if (rows.length === 0) {
      return (
        <p className="text-xs text-muted-foreground italic">Sem dados preenchidos</p>
      );
    }
  
    const needsCollapse = rows.length > collapsedLimit;
    const visibleRows = needsCollapse && !isExpanded ? rows.slice(0, collapsedLimit) : rows;
    const hiddenCount = rows.length - collapsedLimit;
  
    // Separate regular fields from technical tables to render tables at the bottom
    const regularRows: typeof visibleRows = [];
    const tableRows: Array<{ question: string; parsed: any }> = [];
  
    const renderedTableHashes = new Set<string>();
  
    visibleRows.forEach(row => {
      const isTechnicalField = ["observação", "observações", "técnica", "procedimento", "descrição", "histórico", "laser"].some(k => row.question.toLowerCase().includes(k)) || 
                               (!row.answer.includes('{') && (row.answer.match(/\s{3,}/g) || []).length > 2 && (row.answer.includes('Sessão') || row.answer.includes('Data'))) || 
                               row.answer.includes('{"isStructured":true');
                               
      if (isTechnicalField) {
        const parsed = parseLegacyTechnicalObservation(row.answer, row.question);
        if (parsed.isTable) {
          const rowHash = JSON.stringify(parsed.rows);
          if (!renderedTableHashes.has(rowHash)) {
            tableRows.push({ question: row.question, parsed });
            renderedTableHashes.add(rowHash);
          }
          return;
        }
      }
      regularRows.push(row);
    });

  return (
    <div className="space-y-4">
      {regularRows.length > 0 && (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {regularRows.map((row, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-muted/40" : "bg-card"}>
                  {row.isRaw ? (
                    <td colSpan={2} className="px-4 py-2 text-foreground break-words whitespace-pre-wrap">
                      {row.answer}
                    </td>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-semibold text-foreground w-[35%] align-top whitespace-pre-wrap">
                        {row.question}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground align-top break-words whitespace-pre-wrap">
                        {row.answer || <span className="italic opacity-50">—</span>}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Render Technical Tables at the bottom */}
      {tableRows.map((item, i) => (
        <div key={`table-${i}`} className="bg-card w-full pt-2 pb-4 border-t border-border mt-4 first:border-0 first:mt-0">
          <p className="font-semibold text-foreground mb-3 text-sm">{item.question}</p>
          <div className="rounded-md border border-border overflow-hidden mb-3">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted">
                <tr>
                  {item.parsed.columns.map((col, cIdx) => (
                      <th key={cIdx} className="px-3 py-2 font-semibold whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {item.parsed.rows.map((r, idx) => (
                  <tr key={idx} className="hover:bg-muted/30 group">
                    {item.parsed.columns.map((col, cIdx) => (
                        <td key={cIdx} className={col.toLowerCase().includes('data') ? "px-3 py-2 whitespace-nowrap font-medium text-primary" : "px-3 py-2 text-muted-foreground"}>
                            {r[cIdx]}
                        </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {item.parsed.notes && (
            <div className="bg-amber-50/50 dark:bg-amber-900/10 p-3 rounded text-xs text-muted-foreground border border-amber-100 dark:border-amber-900/30">
              <span className="font-semibold block mb-0.5 text-amber-800 dark:text-amber-500">Notas Adicionais:</span>
              <div className="whitespace-pre-wrap">{item.parsed.notes}</div>
            </div>
          )}
        </div>
      ))}

      {needsCollapse && (
        <button
          onClick={onToggle}
          className="flex items-center gap-1 text-xs text-primary hover:underline pt-0.5 mx-1"
        >
          {isExpanded ? (
            <>
              <ChevronUpIcon className="w-3.5 h-3.5" /> Recolher
            </>
          ) : (
            <>
              <ChevronDownIcon className="w-3.5 h-3.5" /> Ver mais {hiddenCount} itens
            </>
          )}
        </button>
      )}
    </div>
  );
};

const RecordThumbnail = ({ filePath, onClick }: { filePath: string, onClick: () => void }) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const getThumbnailUrl = async () => {
      const path = filePath.startsWith('uploads/') ? filePath : `uploads/${filePath}`;
      const { data } = await supabase.storage
        .from("client-attachments")
        .createSignedUrl(path, 3600); // 1 hour expiry
      if (data?.signedUrl) setUrl(data.signedUrl);
    };
    getThumbnailUrl();
  }, [filePath]);

  return (
    <button
      onClick={onClick}
      className="w-20 h-20 rounded-md border border-border overflow-hidden hover:opacity-80 transition-opacity bg-muted flex items-center justify-center shrink-0"
    >
      {url ? (
        <img
          src={url}
          alt="Anexo"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-1 opacity-50">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          <span className="text-[10px]">Carregando</span>
        </div>
      )}
    </button>
  );
};

const RecordImages = ({ attachments, currentUserId, userRole }: { attachments: any[], currentUserId?: string, userRole?: string }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const visibleAttachments = attachments.filter(att => {
    if (userRole === 'gestor') return true;
    if (att.privacy_type === 'public') return true;
    if (att.privacy_type === 'private') return true;
    if (att.privacy_type === 'only_me' && att.professional_id === currentUserId) return true;
    return false;
  });

  if (visibleAttachments.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
        <Image className="w-3 h-3" /> Imagens e Anexos ({visibleAttachments.length})
      </p>
      <div className="flex flex-wrap gap-2">
        {visibleAttachments.map((att) => (
          <div key={att.id} className="relative group">
            {att.file_type === 'image' || att.file_path.match(/\.(jpg|jpeg|png|webp)$/i) ? (
              <RecordThumbnail 
                filePath={att.file_path} 
                onClick={async () => {
                  const path = att.file_path.startsWith('uploads/') ? att.file_path : `uploads/${att.file_path}`;
                  const { data, error } = await supabase.storage
                    .from("client-attachments")
                    .createSignedUrl(path, 300);
                  if (error || !data?.signedUrl) return;
                  setPreviewUrl(data.signedUrl);
                }}
              />
            ) : (
              <div className="w-20 h-20 rounded-md border border-border bg-muted flex items-center justify-center flex-col gap-1 p-1">
                <FileText className="w-6 h-6 text-muted-foreground" />
                <span className="text-[9px] truncate w-full text-center">{att.file_path.split('/').pop()}</span>
              </div>
            )}
            {att.privacy_type === 'only_me' && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5" title="Apenas eu">
                <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2V7a5 5 0 00-5-5zM7 7a3 3 0 016 0v2H7V7z"></path></svg>
              </div>
            )}
          </div>
        ))}
      </div>

      <AlertDialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <AlertDialogContent className="max-w-3xl p-2 bg-transparent border-none">
          <div className="relative">
            <img src={previewUrl!} className="w-full h-auto max-h-[85vh] object-contain rounded-lg" />
            <Button 
              variant="outline" 
              size="sm" 
              className="absolute top-2 right-2 bg-background/80"
              onClick={() => setPreviewUrl(null)}
            >
              Fechar
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};



const AnamneseTab = ({ clientId, clientName }: AnamneseTabProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: templates = [] } = useActiveTemplates();
  const { data: records = [], isLoading } = usePatientRecords(clientId);
  const [fillTemplate, setFillTemplate] = useState<AnamnesisTemplate | null>(null);
  const [editingRecord, setEditingRecord] = useState<PatientRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PatientRecord | null>(null);
  const [expandedRecords, setExpandedRecords] = useState<Set<string>>(new Set());
  const [signingRecordId, setSigningRecordId] = useState<string | null>(null);
  const [isSigningOpen, setIsSigningOpen] = useState(false);

  const COLLAPSED_LIMIT = 5;

  const { data: client } = useQuery({
    queryKey: ["client_phone", clientId],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("phone").eq("id", clientId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!clientId,
  });

  const toggleExpand = (id: string) => {
    setExpandedRecords((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
    let content = record.content;
    if (!content) return [];

    // Content might be stored as a JSON string — parse it
    if (typeof content === "string") {
      try {
        content = JSON.parse(content);
      } catch {
        return [];
      }
    }

    const contentObj = content as any;

    // Handle imported records: content is an array of {label, value}
    if (Array.isArray(contentObj)) {
      return contentObj
        .filter((item: any) => item.label || item.value)
        .map((item: any) => ({
          label: item.label ?? "",
          value: item.value ?? "",
        }));
    }

    // Handle template-based records: content has templateFields + answers
    const templateFields = (contentObj.templateFields as TemplateField[]) ?? [];
    const answers = (contentObj.answers as Record<string, string>) ?? {};

    const fieldsData = templateFields
      .filter((f) => f.isActive)
      .map((f) => ({
        label: f.label,
        value: answers[f.id] ?? "",
      }));

    // Add hidden/legacy fields that have content, like 'proced_realizado'
    const specialKeys = ["proced_realizado", "observacoes_tecnicas", "evolucao"];
    specialKeys.forEach(key => {
      if (answers[key] && !fieldsData.find(f => f.label.includes("Procedimento") || f.label.includes("Observações Técnicas"))) {
        fieldsData.push({
          label: key === "proced_realizado" ? "Observações Técnicas / Procedimento" : key.charAt(0).toUpperCase() + key.slice(1).replace("_", " "),
          value: answers[key],
        });
      }
    });

    return fieldsData;
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
                        <RecordOptionsMenu 
                          recordId={record.id}
                          clientName={clientName}
                          clientPhone={client?.phone || ""}
                          documentTitle={record.title || "Ficha"}
                          onSignatureSuccess={() => queryClient.invalidateQueries({ queryKey: ["patient_records", clientId] })}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => setEditingRecord(record)}
                          title="Editar Ficha"
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(record)}
                          title="Excluir Ficha"
                        >
                          <Trash2 className="w-3 h-3" />
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
                    <RecordFields
                      fields={fields}
                      recordId={record.id}
                      isExpanded={expandedRecords.has(record.id)}
                      onToggle={() => toggleExpand(record.id)}
                      collapsedLimit={COLLAPSED_LIMIT}
                    />

                    {/* Inline Images */}
                    <RecordImages 
                      attachments={(record as any).client_attachments || []} 
                      currentUserId={user?.id}
                      userRole={(user as any)?.app_metadata?.role}
                    />

                    {/* Signature Preview */}
                    {record.signature_url && (
                      <div className="mt-4 pt-4 border-t border-dashed flex flex-col items-start gap-1">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Assinatura do Cliente</p>
                        <div className="bg-white rounded border p-1 shadow-sm">
                          <img 
                            src={record.signature_url} 
                            alt="Assinatura" 
                            className="h-12 object-contain mix-blend-multiply dark:invert"
                          />
                        </div>
                        <p className="text-[9px] text-muted-foreground italic">
                          Assinado em {format(parseISO(record.signed_at || record.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    )}
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
          onSaveAndSign={(recordId) => {
            setFillTemplate(null);
            setSigningRecordId(recordId);
            setIsSigningOpen(true);
          }}
        />
      )}

      {/* Edit dialog */}
      {(() => {
        if (!editingRecord) return null;
        
        // Find the template for the editing record
        const content = editingRecord.content as any;
        const templateId = content?.templateId;
        const template = templateId 
          ? templates.find(t => t.id === templateId) 
          : templates.find(t => t.name === editingRecord.title);

        return (
          <AnamneseFillDialog
            template={template || null}
            clientId={clientId}
            existingRecord={editingRecord}
            onClose={() => setEditingRecord(null)}
            onSaveAndSign={(recordId) => {
              setEditingRecord(null);
              setSigningRecordId(recordId);
              setIsSigningOpen(true);
            }}
          />
        );
      })()}

      {/* Integrated Signature Dialog */}
      {isSigningOpen && signingRecordId && (
        <Dialog open={isSigningOpen} onOpenChange={setIsSigningOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Assinatura Digital</DialogTitle>
              <DialogDescription>
                O documento foi salvo. Agora, o cliente deve assinar no quadro abaixo.
              </DialogDescription>
            </DialogHeader>
            <SignaturePad 
              onSave={async (signatureDataUrl) => {
                try {
                  const response = await fetch(signatureDataUrl);
                  const blob = await response.blob();
                  const fileName = `${signingRecordId}/local_signature_${Date.now()}.png`;
                  
                  await supabase.storage
                    .from("signatures")
                    .upload(fileName, blob, { contentType: "image/png", upsert: true });

                  const { data: { publicUrl } } = supabase.storage
                    .from("signatures")
                    .getPublicUrl(fileName);

                  await supabase
                    .from("patient_records")
                    .update({
                      signature_url: publicUrl,
                      signed_at: new Date().toISOString()
                    })
                    .eq("id", signingRecordId);

                  toast({ title: "Assinatura salva com sucesso!" });
                  setIsSigningOpen(false);
                  setSigningRecordId(null);
                  queryClient.invalidateQueries({ queryKey: ["patient_records", clientId] });
                } catch (err) {
                  console.error("Error saving signature:", err);
                  toast({ title: "Erro ao salvar assinatura", variant: "destructive" });
                }
              }} 
              onCancel={() => {
                setIsSigningOpen(false);
                setSigningRecordId(null);
              }} 
            />
          </DialogContent>
        </Dialog>
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
