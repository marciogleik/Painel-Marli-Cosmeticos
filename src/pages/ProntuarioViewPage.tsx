import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Printer, ChevronLeft, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SignaturePad } from "@/components/SignaturePad";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { TemplateField } from "@/components/settings/AnamnesesTab";
import { RecordOptionsMenu } from "@/components/client/RecordOptionsMenu";
import { useEffect } from "react";

interface FieldData {
  id: string;
  label: string;
  value: string;
  type?: string;
}

const ProntuarioViewPage = () => {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSigningOpen, setIsSigningOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHeader, setShowHeader] = useState(searchParams.get("h") !== "0");

  const { data: record, isLoading } = useQuery({
    queryKey: ["patient_record", recordId],
    queryFn: async () => {
      if (!recordId) throw new Error("No record ID provided");
      
      const { data, error } = await supabase
        .from("patient_records")
        .select(`
          *,
          clients (
            full_name,
            cpf,
            phone
          )
        `)
        .eq("id", recordId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!recordId,
  });

  useEffect(() => {
    if (searchParams.get("p") === "1" && !isLoading && record) {
      const timer = setTimeout(() => {
        window.print();
        // After printing, if it was an auto-print from list, we might want to close or just stay
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, isLoading, record]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Carregando prontuário...</p>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="text-center space-y-4">
          <p className="text-lg font-medium text-destructive">Ficha não encontrada.</p>
          <Button onClick={() => navigate(-1)} variant="outline">Voltar</Button>
        </div>
      </div>
    );
  }

  const clientName = (record.clients as any)?.full_name || "Cliente sem nome";
  const dateStr = format(parseISO(record.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

  // Extract fields
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
    // legacy array format
    fields = content
      .filter((item: any) => item.label || item.value)
      .map((item: any) => ({
        id: crypto.randomUUID(),
        label: item.label ?? "",
        value: item.value ?? "",
        type: "unknown"
      }));
  } else {
    // new template-based format
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

  const handlePrint = (withHeader: boolean) => {
    setShowHeader(withHeader);
    // Use a timeout to allow the state change to render before printing
    setTimeout(() => {
      window.print();
      // Optionally reset after printing (though print is synchronous in blocking way, 
      // some browsers might need a delay to reset reliably)
      setTimeout(() => setShowHeader(true), 500);
    }, 100);
  };

  const handleShareWhatsApp = (withHeader: boolean) => {
    const baseUrl = window.location.origin;
    const signatureUrl = `${baseUrl}/assinar/${recordId}${withHeader ? "" : "?h=0"}`;
    const message = `Olá ${clientName}, por favor acesse o link abaixo para visualizar e assinar o documento "${record.title || "Ficha"}":\n\n${signatureUrl}`;
    const clientPhone = (record.clients as any)?.phone || "";
    const whatsappUrl = `https://wa.me/${clientPhone.replace(/\D/g, '') || ""}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSendToClientToSign = () => {
    const baseUrl = window.location.origin;
    const signUrl = `${baseUrl}/assinar/${recordId}`;
    const message = `Olá ${clientName}, preciso da sua assinatura no documento "${record.title || "Ficha"}". Clique no link para assinar agora:\n\n${signUrl}`;
    const clientPhone = (record.clients as any)?.phone || "";
    const whatsappUrl = `https://wa.me/${clientPhone.replace(/\D/g, '') || ""}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleLocalSignature = async (signatureDataUrl: string) => {
    if (!recordId) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(signatureDataUrl);
      const blob = await response.blob();
      
      const fileName = `${recordId}/local_signature_${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage
        .from("signatures")
        .upload(fileName, blob, { contentType: "image/png", upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("signatures")
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("patient_records")
        .update({
          signature_url: publicUrl,
          signed_at: new Date().toISOString()
        })
        .eq("id", recordId);

      if (updateError) throw updateError;

      toast.success("Assinatura salva com sucesso!");
      setIsSigningOpen(false);
      window.location.reload(); // Refresh to show signature
    } catch (err) {
      console.error("Error saving local signature:", err);
      toast.error("Erro ao salvar assinatura.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 pb-12">
      {/* Top Navbar - hidden in print */}
      <div className="bg-white dark:bg-zinc-900 border-b sticky top-0 z-10 print:hidden shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => { window.close(); navigate(-1); }} title="Fechar guia">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold">{record.title || "Ficha de Anamnese"}</h1>
              <p className="text-xs text-muted-foreground">{clientName}</p>
            </div>
          </div>
            <div className="flex items-center gap-2">
              <RecordOptionsMenu 
                recordId={recordId || ""}
                clientName={clientName}
                clientPhone={(record.clients as any)?.phone || ""}
                documentTitle={record.title || "Ficha"}
                onPrint={handlePrint}
                onShare={handleShareWhatsApp}
              />
            </div>
        </div>
      </div>

      {/* Document Paper */}
      <div className="max-w-4xl mx-auto mt-8 px-4 print:mt-0 print:max-w-none print:px-0">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm print:shadow-none p-8 md:p-12 print:p-0">
          
          {/* Header */}
          {showHeader && (
            <div className="border-b-2 border-primary/20 pb-6 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
              <div>
                <h1 className="text-2xl font-bold text-primary mb-1 uppercase tracking-tight">
                  {record.title || "Ficha de Anamnese"}
                </h1>
                <p className="text-sm font-medium">Paciente: <span className="text-foreground">{clientName}</span></p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Data / Hora</p>
                <p className="text-sm font-medium bg-muted px-2 py-1 rounded inline-block">{dateStr}</p>
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="space-y-8">
            {fields.length === 0 ? (
              <p className="text-center text-muted-foreground italic py-10">Ficha sem conteúdo registrado.</p>
            ) : (
              <div className="flex flex-wrap gap-x-6 gap-y-6">
                {fields.map((field) => {
                  const isModeloPadrao = field.type === "modelo_padrao" || field.type === "long_text" || (field.value && field.value.length > 200 && (field.value.includes("\n") || field.value.includes("|")));
                  
                  if (isModeloPadrao) {
                    return (
                      <div key={field.id} className="w-full mt-4 first:mt-0 bg-gray-50 dark:bg-zinc-950 p-6 rounded-lg border border-border/50">
                         {field.label && field.label.trim() !== "" && (
                           <h3 className="font-semibold text-lg border-b pb-2 mb-4 text-primary tracking-tight">
                             {field.label}
                           </h3>
                         )}
                         <div className="prose prose-sm dark:prose-invert max-w-none">
                            {/* Render Markdown Table correctly using remarkGfm */}
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {field.value || "*Sem conteúdo*"}
                            </ReactMarkdown>
                         </div>
                      </div>
                    );
                  }

                  return (
                    <div key={field.id} className="flex-1 min-w-[200px] border-l-[3px] border-primary/30 pl-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1 drop-shadow-sm">
                        {field.label}
                      </p>
                      <p className="text-sm font-medium leading-relaxed">
                        {field.value || <span className="opacity-50 italic">—</span>}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Signature Line */}
          <div className="mt-20 pt-10 border-t border-border flex flex-col items-center justify-center break-inside-avoid">
            {record.signature_url ? (
              <div className="flex flex-col items-center animate-in fade-in duration-700">
                <img 
                  src={record.signature_url} 
                  alt="Assinatura do Paciente" 
                  className="max-h-24 object-contain mb-2 mix-blend-multiply dark:invert"
                />
                <div className="w-64 border-b border-foreground/50 mb-2"></div>
                <p className="font-semibold text-sm text-center">{clientName}</p>
                <p className="text-[10px] text-muted-foreground text-center flex items-center gap-1">
                   Assinado digitalmente em {format(parseISO(record.signed_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center opacity-40">
                <div className="w-64 border-b border-foreground mb-4"></div>
                <p className="font-semibold text-sm text-center">{clientName}</p>
                <p className="text-xs text-muted-foreground text-center mt-1 uppercase tracking-widest">
                  Assinatura do Paciente
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};

export default ProntuarioViewPage;
