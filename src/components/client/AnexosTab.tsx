import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, Image, File, ChevronDown, ChevronUp, Download, Lock, Globe, Users, ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: attachments, isLoading } = useClientAttachments(clientId);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const updatePrivacy = async (id: string, privacy: string) => {
    const { error } = await supabase
      .from("client_attachments")
      .update({ privacy_type: privacy })
      .eq("id", id);
    
    if (error) {
      toast({
        title: "Erro ao atualizar privacidade",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Privacidade atualizada com sucesso" });
    queryClient.invalidateQueries({ queryKey: ["client_attachments", clientId] });
    queryClient.invalidateQueries({ queryKey: ["patient_records", clientId] });
  };

  const userRole = (user as any)?.app_metadata?.role;
  const currentUserId = user?.id;

  const visibleAttachments = attachments?.filter(att => {
    if (userRole === 'gestor') return true;
    if (att.privacy_type === 'public' || !att.privacy_type) return true;
    if (att.privacy_type === 'private') return true;
    if (att.privacy_type === 'only_me' && att.professional_id === currentUserId) return true;
    return false;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
      </div>
    );
  }

  if (!visibleAttachments.length) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        Nenhum anexo visível encontrado para este cliente.
      </p>
    );
  }

  // Group by ficha_type
  const grouped = visibleAttachments.reduce<Record<string, typeof visibleAttachments>>((acc, att) => {
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
          {visibleAttachments.length} anexo{visibleAttachments.length !== 1 ? "s" : ""} encontrado{visibleAttachments.length !== 1 ? "s" : ""}
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
                    <div className="flex items-center gap-2 mt-1">
                      {att.privacy_type === 'only_me' ? (
                        <Badge variant="destructive" className="text-[9px] gap-1 px-1 py-0 h-4">
                          <Lock className="w-2 h-2" /> Apenas Eu
                        </Badge>
                      ) : att.privacy_type === 'private' ? (
                        <Badge variant="secondary" className="text-[9px] gap-1 px-1 py-0 h-4 bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">
                          <ShieldAlert className="w-2 h-2" /> Privado
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px] gap-1 px-1 py-0 h-4 text-emerald-600 border-emerald-200">
                          <Globe className="w-2 h-2" /> Público
                        </Badge>
                      )}
                      
                      {att.notes && (
                        <p className="text-[10px] text-muted-foreground italic truncate max-w-[200px]">{att.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Privacy Selector */}
                    {(userRole === 'gestor' || att.professional_id === currentUserId) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <Lock className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-xs">
                          <DropdownMenuItem onClick={() => updatePrivacy(att.id, 'public')} className="gap-2">
                            <Globe className="w-3.5 h-3.5" /> Público (Todos)
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updatePrivacy(att.id, 'private')} className="gap-2">
                            <ShieldAlert className="w-3.5 h-3.5" /> Privado (Clínica)
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updatePrivacy(att.id, 'only_me')} className="gap-2 text-red-600">
                            <Lock className="w-3.5 h-3.5" /> Apenas Eu
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    {att.file_type === "image" && att.file_path.startsWith("uploads/") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={async () => {
                          const { data, error } = await supabase.storage
                            .from("client-attachments")
                            .createSignedUrl(att.file_path, 300);
                          if (error || !data?.signedUrl) return;
                          setPreviewUrl(data.signedUrl);
                        }}
                      >
                        Visualizar
                      </Button>
                    )}

                    {att.file_path.startsWith("uploads/") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs gap-1"
                        onClick={async () => {
                          const { data, error } = await supabase.storage
                            .from("client-attachments")
                            .createSignedUrl(att.file_path, 300, { download: true });
                          if (error || !data?.signedUrl) return;
                          const a = document.createElement("a");
                          a.href = data.signedUrl;
                          a.download = att.file_path.split("/").pop() || "anexo";
                          a.click();
                        }}
                      >
                        <Download className="w-3.5 h-3.5" /> Baixar
                      </Button>
                    )}
                  </div>
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
