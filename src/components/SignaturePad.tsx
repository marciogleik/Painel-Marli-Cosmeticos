import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle2 } from "lucide-react";

interface SignaturePadProps {
  onSave: (signatureDataUrl: string) => void;
  onCancel?: () => void;
}

export const SignaturePad = ({ onSave, onCancel }: SignaturePadProps) => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigCanvas.current?.clear();
  };

  const save = () => {
    if (sigCanvas.current?.isEmpty()) {
      return;
    }
    const signatureDataUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png");
    if (signatureDataUrl) {
      onSave(signatureDataUrl);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg bg-white overflow-hidden shadow-inner h-48 sm:h-64 relative touch-none">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            className: "w-full h-full cursor-crosshair",
            style: { width: "100%", height: "100%" }
          }}
        />
        <div className="absolute top-2 right-2 pointer-events-none">
          <span className="text-[10px] uppercase font-bold text-muted-foreground/50 tracking-widest">
            Assine aqui
          </span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={clear}
          className="flex-1 gap-2 border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
          Limpar
        </Button>
        <Button 
          onClick={save}
          className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
        >
          <CheckCircle2 className="w-4 h-4" />
          Confirmar
        </Button>
      </div>
      
      {onCancel && (
        <Button variant="ghost" onClick={onCancel} className="text-muted-foreground">
          Cancelar
        </Button>
      )}
    </div>
  );
};
