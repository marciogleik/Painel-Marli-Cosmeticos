import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, Image, File, ChevronDown, ChevronUp, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface AnexosTabProps {
  clientId: string;
}

const useClientAttachments = (clientId: string) =>
  useQuery({
    queryKey: ["client_attachments", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_attachments")
        .select("*")
        .eq("client_id", clientId)
        .order("attachment_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!clientId,
  });

const fileIcon = (type: string | null) => {
  if (type === "image") return <Image className="w-4 h-4 text-emerald-600" />;
  if (type === "pdf") return <FileText className="w-4 h-4 text-red-600" />;
  return <File className="w-4 h-4 text-muted-foreground" />;
};

const AnexosTab = ({ clientId }: AnexosTabProps) => {
  const { data: attachments, isLoading } = useClientAttachments(clientId);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
      </div>
    );
  }

  if (!attachments?.length) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        Nenhum anexo encontrado para este cliente.
      </p>
    );
  }

  // Group by ficha_type
  const grouped = attachments.reduce<Record<string, typeof attachments>>((acc, att) => {
    const key = att.ficha_type || "Sem categoria";
    if (!acc[key]) acc[key] = [];
    acc[key].push(att);
    return acc;
  }, {});

  const sortedGroups = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {attachments.length} anexo{attachments.length !== 1 ? "s" : ""} encontrado{attachments.length !== 1 ? "s" : ""}
        </p>
      </div>

      {sortedGroups.map(([group, items]) => (
        <div key={group} className="border border-border rounded-lg overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-3 bg-muted/50 hover:bg-muted transition-colors text-left"
            onClick={() => setExpandedId(expandedId === group ? null : group)}
          >
            <span className="text-sm font-medium flex items-center gap-2">
              {group}
              <Badge variant="secondary" className="text-[10px]">{items.length}</Badge>
            </span>
            {expandedId === group ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {expandedId === group && (
            <div className="divide-y divide-border">
              {items.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors"
                >
                  {fileIcon(att.file_type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {att.file_path.split("/").pop() || att.file_path}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(att.attachment_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      {att.professional_name ? ` • ${att.professional_name}` : ""}
                      {att.ficha_code ? ` • Cód: ${att.ficha_code}` : ""}
                    </p>
                    {att.notes && (
                      <p className="text-xs text-muted-foreground mt-0.5 italic">{att.notes}</p>
                    )}
                  </div>

                  {att.file_type === "image" && att.file_path.startsWith("uploads/") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs shrink-0"
                      onClick={() => {
                        const { data } = supabase.storage
                          .from("client-attachments")
                          .getPublicUrl(att.file_path);
                        setPreviewUrl(data.publicUrl);
                      }}
                    >
                      Visualizar
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Image preview dialog */}
      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="max-w-3xl p-2">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Anexo"
              className="w-full h-auto max-h-[80vh] object-contain rounded"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnexosTab;
