import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SignaturePad } from "@/components/SignaturePad";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle2, FileText, Smartphone } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import type { TemplateField } from "@/components/settings/AnamnesesTab";

interface FieldData {
  id: string;
  label: string;
  value: string;
  type?: string;
}

const PublicSignaturePage = () => {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showHeader = searchParams.get("h") !== "0";
  
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [signed, setSigned] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!recordId) return;
      
      try {
        const { data, error } = await supabase
          .from("patient_records")
          .select(`
            *,
            clients (
              full_name,
              cpf
            )
          `)
          .eq("id", recordId)
          .single();

        if (error) throw error;
        setRecord(data);
      } catch (err: any) {
        console.error("Error fetching record:", err);
        setError("Não foi possível carregar o documento. Verifique se o link está correto.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [recordId]);

  const handleSaveSignature = async (signatureDataUrl: string) => {
    if (!recordId || !record) return;

    setSubmitting(true);
    try {
      // 1. Convert DataURL to Blob
      const response = await fetch(signatureDataUrl);
      const blob = await response.blob();
      
      // 2. Upload to Supabase Storage
      const fileName = `${recordId}/signature_${Date.now()}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("signatures")
        .upload(fileName, blob, {
          contentType: "image/png",
          upsert: true
        });

      if (uploadError) throw uploadError;

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("signatures")
        .getPublicUrl(fileName);

      // 4. Update Patient Record
      const { error: updateError } = await supabase
        .from("patient_records")
        .update({
          signature_url: publicUrl,
          signed_at: new Date().toISOString()
        })
        .eq("id", recordId);

      if (updateError) throw updateError;

      setSigned(true);
      toast.success("Assinatura registrada com sucesso!");
    } catch (err: any) {
      console.error("Error saving signature:", err);
      toast.error("Erro ao salvar assinatura. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground animate-pulse">Carregando documento...</p>
        </div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full border-destructive/20 shadow-xl shadow-destructive/5">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-2" />
            <CardTitle className="text-destructive">Erro no Link</CardTitle>
            <CardDescription>{error || "Documento não encontrado."}</CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-8 text-sm text-muted-foreground">
             Por favor, solicite um novo link ao profissional.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (signed || record.signature_url) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full border-emerald-100 shadow-xl shadow-emerald-500/5">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <CardTitle>Documento Assinado!</CardTitle>
            <CardDescription>
              Obrigado, sua assinatura foi registrada com sucesso.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
             <div className="bg-muted/30 p-4 rounded-lg border border-border/50 text-sm italic text-center text-muted-foreground">
                "Este documento está agora vinculado à sua assinatura digital e armazenado de forma segura no prontuário clínico."
             </div>
             <p className="text-xs text-center text-muted-foreground">Você já pode fechar esta aba.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-12">
      <div className="max-w-3xl mx-auto pt-6 px-4">
        
        {/* Intro Card */}
        <Card className="mb-6 border-none shadow-sm overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary to-purple-600" />
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
             <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-primary" />
             </div>
             <div>
               <CardTitle className="text-lg">Assinatura Digital</CardTitle>
               <CardDescription>
                  Leia o documento abaixo e faça sua assinatura no campo indicado.
               </CardDescription>
             </div>
          </CardHeader>
        </Card>

        {/* Document Content (Simplified Preview) */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-border p-6 md:p-10 mb-8 max-h-[50vh] overflow-y-auto relative ring-1 ring-black/5">
          {showHeader && (
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <FileText className="w-32 h-32" />
            </div>
          )}
          
          {showHeader && (
            <div className="text-center mb-10 border-b border-primary/10 pb-6 animate-in fade-in duration-300">
              <h1 className="text-xl font-bold uppercase tracking-tight text-primary mb-2">
                {record.title || "Documento Clínico"}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground font-medium">
                <span>Paciente: <span className="text-foreground">{(record.clients as any)?.full_name}</span></span>
                <span className="opacity-30">•</span>
                <span>Data: {format(parseISO(record.created_at), "dd/MM/yyyy", { locale: ptBR })}</span>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {(() => {
              let content = record.content as any;
              if (typeof content === "string") {
                try {
                  content = JSON.parse(content);
                } catch {
                  content = {};
                }
              }

              let fields: FieldData[] = [];
              if (Array.isArray(content)) {
                fields = content
                  .filter((item: any) => item.label || item.value)
                  .map((item: any) => ({
                    id: crypto.randomUUID(),
                    label: item.label ?? "",
                    value: item.value ?? "",
                    type: "unknown"
                  }));
              } else {
                const templateFields = (content.templateFields as TemplateField[]) ?? [];
                const answers = (content.answers as Record<string, string>) ?? {};

                fields = templateFields
                  .filter((f) => f.isActive)
                  .map((f) => ({
                    id: f.id,
                    label: f.label,
                    value: answers[f.id] ?? "",
                    type: f.type,
                  }));
              }

              if (fields.length === 0) {
                return (
                  <p className="italic text-muted-foreground text-center py-4">O conteúdo detalhado pode ser visualizado no prontuário impresso.</p>
                );
              }

              return (
                <div className="flex flex-wrap gap-x-6 gap-y-6">
                  {fields.map((field) => {
                    const isLongText = field.type === "modelo_padrao" || field.type === "long_text" || (field.value && field.value.length > 200);
                    
                    if (isLongText) {
                      return (
                        <div key={field.id} className="w-full bg-gray-50 dark:bg-zinc-950 p-4 rounded-lg border border-border/50">
                           {field.label && (
                             <h3 className="font-semibold text-sm border-b pb-2 mb-3 text-primary tracking-tight">
                               {field.label}
                             </h3>
                           )}
                           <div className="prose prose-sm dark:prose-invert max-w-none">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {field.value || "*Sem conteúdo*"}
                              </ReactMarkdown>
                           </div>
                        </div>
                      );
                    }

                    return (
                      <div key={field.id} className="flex-1 min-w-[200px] border-l-2 border-primary/20 pl-3 py-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                          {field.label}
                        </p>
                        <p className="text-sm font-medium leading-relaxed">
                          {field.value || <span className="opacity-30">—</span>}
                        </p>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Signature Area */}
        <Card className="border-2 border-primary/20 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="bg-muted/30 pb-4 border-b">
            <div className="flex items-center gap-2">
               <Smartphone className="w-5 h-5 text-primary" />
               <CardTitle className="text-base">Assine com o dedo no quadro abaixo</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {submitting ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm font-medium">Enviando assinatura...</p>
              </div>
            ) : (
              <SignaturePad onSave={handleSaveSignature} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicSignaturePage;
