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
import { Plus, Pencil, Loader2, Archive, ArchiveRestore, Mail, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProfForm {
  name: string;
  role_description: string;
  avatar_initials: string;
}

const emptyForm: ProfForm = { name: "", role_description: "", avatar_initials: "" };

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
      (data ?? []).forEach(p => { if (p.avatar_url) map[p.user_id] = p.avatar_url; });
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
  const [inviteLink, setInviteLink] = useState<{ profId: string; url: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const inviteMutation = useMutation({
    mutationFn: async (professionalId: string) => {
      const { data, error } = await supabase.functions.invoke("generate-invite", {
        body: { role: "profissional", professional_id: professionalId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data.token as string;
    },
    onSuccess: (token, professionalId) => {
      const url = `${window.location.origin}/cadastro?token=${token}`;
      setInviteLink({ profId: professionalId, url });
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao gerar convite", description: err.message, variant: "destructive" });
    },
  });

  const copyLink = async (url: string, profId: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(profId);
    toast({ title: "Link copiado!" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const initials = form.avatar_initials || generateInitials(form.name);
      if (editingId) {
        const { error } = await supabase
          .from("professionals")
          .update({ name: form.name.trim(), role_description: form.role_description.trim() || null, avatar_initials: initials })
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("professionals")
          .insert({ name: form.name.trim(), role_description: form.role_description.trim() || null, avatar_initials: initials });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidateAll();
      toast({ title: editingId ? "Profissional atualizado!" : "Profissional cadastrado!" });
      closeDialog();
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("professionals")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { is_active }) => {
      invalidateAll();
      toast({ title: is_active ? "Profissional reativado!" : "Profissional desativado!" });
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    },
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["professionals"] });
  };

  const openEdit = (p: { id: string; name: string; role_description: string | null; avatar_initials: string | null }) => {
    setEditingId(p.id);
    setForm({ name: p.name, role_description: p.role_description || "", avatar_initials: p.avatar_initials || "" });
    setDialogOpen(true);
  };

  const openNew = () => { setEditingId(null); setForm(emptyForm); setDialogOpen(true); };
  const closeDialog = () => { setDialogOpen(false); setEditingId(null); setForm(emptyForm); };
  const canSubmit = form.name.trim().length >= 2;

  const active = professionals.filter(p => p.is_active);
  const inactive = professionals.filter(p => !p.is_active);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">{active.length} profissionais ativos</p>
          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-muted-foreground">
            <Switch checked={showInactive} onCheckedChange={setShowInactive} className="scale-75" />
            Mostrar inativos
          </label>
        </div>
        <Button size="sm" className="gap-1.5" onClick={openNew}>
          <Plus className="w-4 h-4" /> Novo Profissional
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {active.map(p => (
            <Card key={p.id} className="group relative">
              <CardContent className="flex flex-col gap-2 p-4">
                <div className="flex items-center gap-3">
                  {getAvatarUrl(p) ? (
                    <img src={getAvatarUrl(p)} alt={p.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary">{p.avatar_initials || p.name.slice(0, 2).toUpperCase()}</span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.role_description || "—"}</p>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)} title="Editar">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeactivateTarget({ id: p.id, name: p.name })}
                      title="Desativar"
                      disabled={toggleActiveMutation.isPending}
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                {!p.user_id && (
                  inviteLink?.profId === p.id ? (
                    <div className="flex items-center gap-1.5">
                      <Input value={inviteLink.url} readOnly className="h-7 text-xs flex-1" />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => copyLink(inviteLink.url, p.id)}
                      >
                        {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 h-7 text-xs w-full"
                      onClick={() => inviteMutation.mutate(p.id)}
                      disabled={inviteMutation.isPending}
                    >
                      {inviteMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                      Gerar Convite
                    </Button>
                  )
                )}
                {p.user_id && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Conta vinculada
                  </p>
                )}
              </CardContent>
            </Card>
          ))}

          {showInactive && inactive.map(p => (
            <Card key={p.id} className="group relative opacity-50 border-dashed">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-muted-foreground">{p.avatar_initials || p.name.slice(0, 2).toUpperCase()}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground truncate">Inativo</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                  onClick={() => toggleActiveMutation.mutate({ id: p.id, is_active: true })}
                  title="Reativar"
                  disabled={toggleActiveMutation.isPending}
                >
                  <ArchiveRestore className="w-3.5 h-3.5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={v => { if (!v) closeDialog(); else setDialogOpen(true); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">{editingId ? "Editar Profissional" : "Novo Profissional"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <Label className="text-xs">Nome *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome completo" maxLength={100} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Função / Especialidade</Label>
              <Input value={form.role_description} onChange={e => setForm(f => ({ ...f, role_description: e.target.value }))} placeholder="Ex: Estética / Depilação" maxLength={100} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Iniciais (avatar)</Label>
              <Input value={form.avatar_initials} onChange={e => setForm(f => ({ ...f, avatar_initials: e.target.value.toUpperCase().slice(0, 3) }))} placeholder="Auto" maxLength={3} className="w-20" />
            </div>
            <Button className="w-full" disabled={!canSubmit || mutation.isPending} onClick={() => mutation.mutate()}>
              {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
              {editingId ? "Salvar" : "Cadastrar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deactivateTarget} onOpenChange={v => { if (!v) setDeactivateTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desativar profissional?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deactivateTarget?.name}</strong> não aparecerá mais na agenda e nos vínculos. Você poderá reativá-lo(a) depois.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deactivateTarget) {
                  toggleActiveMutation.mutate({ id: deactivateTarget.id, is_active: false });
                  setDeactivateTarget(null);
                }
              }}
            >
              Desativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfissionaisTab;
