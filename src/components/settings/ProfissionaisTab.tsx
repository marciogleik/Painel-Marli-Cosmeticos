import { useState } from "react";
import { useProfessionals } from "@/hooks/useClinicData";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Loader2, Archive, ArchiveRestore, Mail, Copy, Check, UserCircle2, Sparkles, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProfForm {
  name: string;
  role_description: string;
  avatar_initials: string;
  can_receive_appointments: boolean;
}

const emptyForm: ProfForm = { 
  name: "", 
  role_description: "", 
  avatar_initials: "", 
  can_receive_appointments: true 
};

const ProfissionaisTab = () => {
  const queryClient = useQueryClient();
  const [showInactive, setShowInactive] = useState(false);
  const { data: professionals = [], isLoading } = useProfessionals(showInactive);

  // Fetch avatar URLs from profiles for linked professionals
  const { data: profileAvatars = {} } = useQuery({
    queryKey: ["profile-avatars"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, avatar_url")
        .not("avatar_url", "is", null);
      const map: Record<string, string> = {};
      (data ?? []).forEach(p => { if (p.user_id && p.avatar_url) map[p.user_id] = p.avatar_url; });
      return map;
    },
  });

  const getAvatarUrl = (p: { user_id: string | null }) => {
    return p.user_id ? profileAvatars[p.user_id] : undefined;
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<{ id: string; name: string } | null>(null);
  const [form, setForm] = useState<ProfForm>(emptyForm);
  const [isManualInitials, setIsManualInitials] = useState(false);
  const [inviteLink, setInviteLink] = useState<{ profId: string; url: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const inviteMutation = useMutation({
    mutationFn: async (professionalId: string) => {
      const response = await supabase.functions.invoke("generate-invite", {
        body: { role: "profissional", professional_id: professionalId },
      });

      if (response.error) {
        let errorMessage = response.error.message;
        
        try {
          // If the edge function returns a JSON, it might be in response.error.context
          const errCtx = response.error.context;
          if (errCtx && typeof errCtx === 'object' && !('text' in errCtx)) {
            // Already parsed?
            // @ts-ignore
             if (errCtx.error) errorMessage = errCtx.error;
          } else if (errCtx && 'text' in errCtx && typeof errCtx.text === 'function') {
             // Clone response to avoid body already consumed errors
             const responseClone = (errCtx as Response).clone();
             const body = JSON.parse(await responseClone.text());
             if (body.error) errorMessage = body.error;
          }
        } catch (e) {
          if (errorMessage === "Edge Function returned a non-2xx status code") {
            errorMessage = "Erro ao processar convite no servidor.";
          }
        }
        throw new Error(errorMessage);
      }

      if (response.data?.error) throw new Error(response.data.error);
      return (response.data as any).token as string;
    },
    onSuccess: (token, professionalId) => {
      const url = `${window.location.origin}/cadastro?token=${token}`;
      setInviteLink({ profId: professionalId, url });
      toast({ title: "Convite gerado com sucesso!" });
    },
    onError: (err: Error) => {
      console.error("Erro ao gerar convite:", err);
      toast({ 
        title: "Erro ao gerar convite", 
        description: err.message, 
        variant: "destructive" 
      });
    },
  });

  const copyLink = async (url: string, profId: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(profId);
    toast({ title: "Link copiado!" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareWhatsApp = (url: string) => {
    const text = encodeURIComponent(`Olá! Este é o seu convite para acessar o Painel Marli: ${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const generateInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const initials = form.avatar_initials || generateInitials(form.name);
      const payload = { 
        name: form.name.trim(), 
        role_description: form.role_description.trim() || null, 
        avatar_initials: initials,
        can_receive_appointments: form.can_receive_appointments
      };

      if (editingId) {
        const { error } = await supabase.from("professionals").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("professionals").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
      toast({ title: editingId ? "Profissional atualizado!" : "Profissional cadastrado!" });
      closeDialog();
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("professionals").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { is_active }) => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
      toast({ title: is_active ? "Profissional reativado!" : "Profissional desativado!" });
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const openEdit = (p: any) => {
    setEditingId(p.id);
    setForm({ 
      name: p.name, 
      role_description: p.role_description || "", 
      avatar_initials: p.avatar_initials || "",
      can_receive_appointments: p.can_receive_appointments ?? true
    });
    setDialogOpen(true);
  };

  const openNew = () => { setEditingId(null); setForm(emptyForm); setIsManualInitials(false); setDialogOpen(true); };
  const closeDialog = () => { setDialogOpen(false); setEditingId(null); setForm(emptyForm); setIsManualInitials(false); };
  const canSubmit = form.name.trim().length >= 2;

  const active = professionals.filter(p => p.is_active);
  const inactive = professionals.filter(p => !p.is_active);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-xs font-bold text-primary flex items-center gap-2">
              <UserCircle2 className="w-3.5 h-3.5" />
              {active.length} Profissiona{active.length !== 1 ? "is" : "l"} Ativo{active.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/10 border border-border/20">
            <Switch checked={showInactive} onCheckedChange={setShowInactive} className="scale-75" />
            <span className="text-xs font-medium text-muted-foreground">Inativos</span>
          </div>
        </div>
        <Button size="lg" className="h-10 px-5 rounded-xl gap-2 font-bold shadow-sm shadow-primary/20" onClick={openNew}>
          <Plus className="w-4 h-4" /> Novo Profissional
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
          <p className="text-sm text-muted-foreground animate-pulse font-medium">Carregando profissionais...</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {active.map(p => (
            <Card key={p.id} className="group overflow-hidden rounded-2xl border-border/40 hover:border-primary/30 hover:shadow-xl transition-all duration-300">
              <CardContent className="p-0">
                <div className="flex items-start justify-between p-5">
                  <div className="flex items-start gap-4 flex-1">
                    {getAvatarUrl(p) ? (
                      <div className="relative">
                        <img src={getAvatarUrl(p)} alt={p.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-background ring-offset-2 ring-offset-primary/10 group-hover:scale-105 transition-transform" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <span className="text-lg font-black text-primary/60">{p.avatar_initials || p.name.slice(0, 2).toUpperCase()}</span>
                      </div>
                    )}
                    <div className="min-w-0 space-y-1">
                      <h3 className="font-display font-bold text-base leading-tight text-foreground/90 truncate">{p.name}</h3>
                      <p className="text-xs font-medium text-muted-foreground/70 truncate">{p.role_description || "Sem especialidade definida"}</p>
                      
                      <div className="pt-2">
                        {p.user_id ? (
                          <Badge variant="outline" className="text-[10px] font-bold bg-green-500/5 text-green-600 border-green-200 gap-1 px-2 py-0.5">
                            <Check className="w-3 h-3" /> Conta Vinculada
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] font-bold bg-amber-500/5 text-amber-600 border-amber-200 px-2 py-0.5">
                            Aguardando Convite
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/5" onClick={() => openEdit(p)} title="Editar">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                      onClick={() => setDeactivateTarget({ id: p.id, name: p.name })}
                      title="Desativar"
                      disabled={toggleActiveMutation.isPending}
                    >
                      <Archive className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {!p.user_id && (
                  <div className="px-5 pb-5 mt-1">
                    {inviteLink?.profId === p.id ? (
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-muted/30 border border-primary/10">
                        <Input value={inviteLink.url} readOnly className="h-8 text-[11px] bg-transparent border-none focus-visible:ring-0 px-1 font-mono" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg shrink-0 text-primary hover:bg-primary/10"
                          onClick={() => copyLink(inviteLink.url, p.id)}
                        >
                          {copiedId === p.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg shrink-0 text-green-600 hover:bg-green-50"
                          onClick={() => shareWhatsApp(inviteLink.url)}
                          title="Enviar via WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-9 rounded-xl gap-2 font-bold text-xs border-primary/20 text-primary hover:bg-primary/5 group/btn transition-all"
                        onClick={() => inviteMutation.mutate(p.id)}
                        disabled={inviteMutation.isPending}
                      >
                        {inviteMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />}
                        Gerar Link de Convite
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {showInactive && inactive.map(p => (
            <Card key={p.id} className="group overflow-hidden rounded-2xl border-dashed border-border group opacity-60 scale-[0.98] grayscale-[0.5] hover:grayscale-0 transition-all">
              <CardContent className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center text-muted-foreground shrink-0">
                    <Archive className="w-5 h-5 opacity-40" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-bold text-base leading-tight text-muted-foreground truncate">{p.name}</h3>
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5">Profissional Inativo</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary hover:bg-primary/5"
                  onClick={() => toggleActiveMutation.mutate({ id: p.id, is_active: true })}
                >
                  <ArchiveRestore className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}

          {active.length === 0 && !isLoading && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center border border-dashed border-border">
                <UserCircle2 className="w-8 h-8 text-muted-foreground/20" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-foreground/70">Nenhum profissional encontrado</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">Cadastre sua equipe para começar a gerenciar a agenda.</p>
              </div>
            </div>
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={v => { if (!v) closeDialog(); else setDialogOpen(true); }}>
        <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-primary/5 p-6 border-b border-primary/10 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                {editingId ? <Pencil className="w-6 h-6" /> : <UserCircle2 className="w-6 h-6" />}
              </div>
              <div>
                <DialogTitle className="font-display text-2xl tracking-tight text-foreground">
                  {editingId ? "Editar Profissional" : "Novo Profissional"}
                </DialogTitle>
                <p className="text-xs font-medium text-muted-foreground/80 mt-0.5">
                  {editingId ? "Atualize as informações da sua colaboradora." : "Cadastre uma nova profissional na sua equipe."}
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-6 pb-2">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/10 flex items-center justify-center shadow-inner overflow-hidden group">
                  <span className="text-2xl font-black text-primary transition-all duration-300 group-hover:scale-110">
                    {form.avatar_initials || (form.name ? generateInitials(form.name) : <Sparkles className="w-8 h-8 opacity-20" />)}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="text-sm font-bold text-foreground">Visualização do Avatar</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  As iniciais serão usadas enquanto a profissional não enviar uma foto personalizada.
                </p>
              </div>
            </div>

            <div className="grid gap-5">
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80 ml-1">Nome Completo *</Label>
                <Input 
                  value={form.name} 
                  onChange={e => {
                    const newName = e.target.value;
                    setForm(f => ({ 
                      ...f, 
                      name: newName,
                      avatar_initials: isManualInitials ? f.avatar_initials : generateInitials(newName)
                    }));
                  }} 
                  placeholder="Ex: Maria Eduarda Silva" 
                  maxLength={100} 
                  className="rounded-xl h-12 text-sm bg-muted/5 border-border/50 focus-visible:ring-primary/20" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80 ml-1">Especialidade / Cargo</Label>
                <Input 
                  value={form.role_description} 
                  onChange={e => setForm(f => ({ ...f, role_description: e.target.value }))} 
                  placeholder="Ex: Esteticista Sênior" 
                  maxLength={100} 
                  className="rounded-xl h-12 text-sm bg-muted/5 border-border/50 focus-visible:ring-primary/20" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/80 ml-1">Iniciais Personalizadas</Label>
                <div className="flex items-center gap-3">
                  <Input 
                    value={form.avatar_initials} 
                    onChange={e => {
                      setForm(f => ({ ...f, avatar_initials: e.target.value.toUpperCase().slice(0, 3) }));
                      setIsManualInitials(true);
                    }} 
                    placeholder="Auto" 
                    maxLength={3} 
                    className="w-24 rounded-xl h-10 text-sm font-bold text-center bg-muted/5 border-border/50 focus-visible:ring-primary/20" 
                  />
                  <p className="text-[10px] text-muted-foreground leading-snug">Opcional. Clique para sobrescrever o padrão.</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-primary/10 bg-primary/5 transition-all hover:bg-primary/[0.08]">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-foreground">Exibir na Agenda</Label>
                  <p className="text-[10px] text-muted-foreground leading-tight max-w-[200px]">Define se o profissional aparece como uma coluna disponível na Agenda.</p>
                </div>
                <Switch 
                  checked={form.can_receive_appointments} 
                  onCheckedChange={v => setForm(f => ({ ...f, can_receive_appointments: v }))} 
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button 
                className="w-full h-12 rounded-xl font-bold gap-3 text-sm shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" 
                disabled={!canSubmit || mutation.isPending} 
                onClick={() => mutation.mutate()}
              >
                {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? <Pencil className="w-4 h-4" /> : <Plus className="w-5 h-5" />}
                {editingId ? "Salvar Alterações" : "Cadastrar Profissional na Unidade"}
              </Button>
              {!editingId && (
                <p className="text-[10px] text-center text-muted-foreground mt-4 font-medium opacity-60">
                  Após cadastrar, você poderá gerar o link de acesso exclusivo da profissional.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deactivateTarget} onOpenChange={v => { if (!v) setDeactivateTarget(null); }}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Desativar profissional?</AlertDialogTitle>
            <AlertDialogDescription>
              A profissional <strong className="text-foreground">{deactivateTarget?.name}</strong> não poderá mais receber agendamentos. Você poderá reativá-la futuramente se necessário.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deactivateTarget) {
                  toggleActiveMutation.mutate({ id: deactivateTarget.id, is_active: false });
                  setDeactivateTarget(null);
                }
              }}
            >
              Sim, Desativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Internal Badge for consistency
const Badge = ({ children, variant = "outline", className = "" }: any) => {
  const styles = {
    outline: "border border-border",
    secondary: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${styles[variant as keyof typeof styles]} ${className}`}>
      {children}
    </span>
  );
};

export default ProfissionaisTab;
