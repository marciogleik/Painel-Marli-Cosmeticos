import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Printer, 
  Smartphone, 
  PenLine, 
  MoreHorizontal, 
  FileDown, 
  Loader2,
  X,
  Check
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { SignaturePad } from "@/components/SignaturePad";

interface RecordOptionsMenuProps {
  recordId: string;
  clientName: string;
  clientPhone: string;
  documentTitle: string;
  trigger?: React.ReactNode;
  onSignatureSuccess?: () => void;
  onPrint?: (withHeader: boolean) => void;
  onShare?: (withHeader: boolean) => void;
}

export const RecordOptionsMenu = ({
  recordId,
  clientName,
  clientPhone,
  documentTitle,
  trigger,
  onSignatureSuccess,
  onPrint,
  onShare
}: RecordOptionsMenuProps) => {
  const [isSigningOpen, setIsSigningOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = (action: 'print' | 'pdf' | 'whatsapp', withHeader: boolean) => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams();
    if (!withHeader) params.set("h", "0");
    if (action === 'print' || action === 'pdf') params.set("p", "1");
    
    const url = `${baseUrl}/prontuario/${recordId}?${params.toString()}`;

    if (action === 'whatsapp') {
      if (onShare) {
        onShare(withHeader);
      } else {
        const signatureUrl = `${baseUrl}/assinar/${recordId}${withHeader ? "" : "?h=0"}`;
        const message = `Olá ${clientName}, por favor acesse o link abaixo para visualizar e assinar o documento "${documentTitle || "Ficha"}":\n\n${signatureUrl}`;
        const whatsappUrl = `https://wa.me/${clientPhone.replace(/\D/g, '') || ""}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      }
    } else {
      if (onPrint) {
        onPrint(withHeader);
      } else {
        // For Print and PDF, we open the view page which will trigger print via useEffect
        window.open(url, '_blank');
      }
    }
  };

  const handleSendToClientToSign = () => {
    const baseUrl = window.location.origin;
    const signUrl = `${baseUrl}/assinar/${recordId}`;
    const message = `Olá ${clientName}, preciso da sua assinatura no documento "${documentTitle || "Ficha"}". Clique no link para assinar agora:\n\n${signUrl}`;
    const whatsappUrl = `https://wa.me/${clientPhone.replace(/\D/g, '') || ""}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleLocalSignature = async (signatureDataUrl: string) => {
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
      if (onSignatureSuccess) onSignatureSuccess();
      else window.location.reload();
    } catch (err) {
      console.error("Error saving local signature:", err);
      toast.error("Erro ao salvar assinatura.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {trigger || (
            <Button variant="outline" className="gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300 h-7 text-xs">
              <Printer className="w-4 h-4" /> OPÇÕES <MoreHorizontal className="w-3 h-3" />
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuItem onClick={() => handleAction('whatsapp', true)} className="gap-3 py-2 cursor-pointer">
            <Smartphone className="w-4 h-4 text-emerald-500" /> Enviar via WhatsApp com cabeçalho
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction('whatsapp', false)} className="gap-3 py-2 cursor-pointer">
            <Smartphone className="w-4 h-4 text-emerald-500" /> Enviar via WhatsApp sem cabeçalho
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => handleAction('print', true)} className="gap-3 py-2 cursor-pointer">
            <Printer className="w-4 h-4 text-slate-500" /> Imprimir com cabeçalho
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction('print', false)} className="gap-3 py-2 cursor-pointer">
            <Printer className="w-4 h-4 text-slate-500" /> Imprimir sem cabeçalho
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => handleAction('pdf', true)} className="gap-3 py-2 cursor-pointer">
            <FileDown className="w-4 h-4 text-blue-500" /> PDF com cabeçalho
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAction('pdf', false)} className="gap-3 py-2 cursor-pointer">
            <FileDown className="w-4 h-4 text-blue-500" /> PDF sem cabeçalho
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setIsSigningOpen(true)} className="gap-3 py-2 cursor-pointer">
            <PenLine className="w-4 h-4 text-purple-500" /> Assinatura do Cliente
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSendToClientToSign} className="gap-3 py-2 cursor-pointer">
            <Smartphone className="w-4 h-4 text-emerald-600" /> Enviar para o Cliente Assinar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isSigningOpen} onOpenChange={setIsSigningOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assinatura Digital</DialogTitle>
            <DialogDescription>
              O cliente deve assinar no quadro abaixo utilizando o dedo ou caneta touch.
            </DialogDescription>
          </DialogHeader>
          {isSubmitting ? (
            <div className="py-12 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Salvando assinatura...</p>
            </div>
          ) : (
            <SignaturePad onSave={handleLocalSignature} onCancel={() => setIsSigningOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
