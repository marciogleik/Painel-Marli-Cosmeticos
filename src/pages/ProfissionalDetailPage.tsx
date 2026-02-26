import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowLeft, Camera, HelpCircle, Loader2, Trash2, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

const ProfissionalDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingPhoto, setDeletingPhoto] = useState(false);
  const [confirmDeletePhoto, setConfirmDeletePhoto] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  const [form, setForm] = useState({
    name: "",
    role_description: "",
    agenda_order: 0,
    is_active: true,
    can_receive_appointments: true,
    can_view_all_agendas: false,
    can_receive_email_appointments: false,
    can_switch_registers: false,
  });
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [savingRole, setSavingRole] = useState(false);

  const { data: professional, isLoading } = useQuery({
    queryKey: ["professional-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("professionals")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch linked profile (avatar + email)
  const { data: linkedProfile } = useQuery({
    queryKey: ["professional-profile", professional?.user_id],
    queryFn: async () => {
      if (!professional?.user_id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("avatar_url, full_name, phone, email")
        .eq("user_id", professional.user_id)
        .single();
      return data;
    },
    enabled: !!professional?.user_id,
  });


  // Fetch user role
  const { data: userRole } = useQuery({
    queryKey: ["professional-role", professional?.user_id],
    queryFn: async () => {
      if (!professional?.user_id) return null;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", professional.user_id)
        .single();
      return data?.role ?? null;
    },
    enabled: !!professional?.user_id,
  });

  useEffect(() => {
    if (userRole) setSelectedRole(userRole);
  }, [userRole]);

  useEffect(() => {
    if (professional) {
      setForm({
        name: professional.name,
        role_description: professional.role_description || "",
        agenda_order: professional.agenda_order ?? 0,
        is_active: professional.is_active,
        can_receive_appointments: professional.can_receive_appointments,
        can_view_all_agendas: professional.can_view_all_agendas,
        can_receive_email_appointments: professional.can_receive_email_appointments,
        can_switch_registers: professional.can_switch_registers,
      });
    }
  }, [professional]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("professionals")
        .update({
          name: form.name.trim(),
          role_description: form.role_description.trim() || null,
          agenda_order: form.agenda_order,
          is_active: form.is_active,
          can_receive_appointments: form.can_receive_appointments,
          can_view_all_agendas: form.can_view_all_agendas,
          can_receive_email_appointments: form.can_receive_email_appointments,
          can_switch_registers: form.can_switch_registers,
        })
        .eq("id", id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["professional-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
      toast.success("Profissional atualizado!");
    } catch (err: any) {
      toast.error("Erro ao salvar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !professional?.user_id) return;
    if (!file.type.startsWith("image/")) { toast.error("Selecione uma imagem"); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error("Máximo 2 MB"); return; }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${professional.user_id}/avatar.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (upErr) throw upErr;

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      const { error: updErr } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("user_id", professional.user_id);
      if (updErr) throw updErr;

      queryClient.invalidateQueries({ queryKey: ["professional-profile"] });
      queryClient.invalidateQueries({ queryKey: ["profile-avatars"] });
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      toast.success("Foto atualizada!");
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!professional.user_id) return;
    setDeletingPhoto(true);
    try {
      // List files in the user's avatar folder
      const { data: files } = await supabase.storage.from("avatars").list(professional.user_id);
      if (files && files.length > 0) {
        const paths = files.map(f => `${professional.user_id}/${f.name}`);
        await supabase.storage.from("avatars").remove(paths);
      }
      await supabase.from("profiles").update({ avatar_url: null }).eq("user_id", professional.user_id);
      queryClient.invalidateQueries({ queryKey: ["professional-profile"] });
      queryClient.invalidateQueries({ queryKey: ["profile-avatars"] });
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      toast.success("Foto removida!");
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    } finally {
      setDeletingPhoto(false);
      setConfirmDeletePhoto(false);
    }
  };

  const handleSendPasswordReset = async () => {
    const email = linkedProfile?.email;
    if (!email) { toast.error("Profissional sem e-mail vinculado"); return; }
    setSendingReset(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success(`E-mail de redefinição enviado para ${email}`);
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    } finally {
      setSendingReset(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Profissional não encontrado.</p>
      </div>
    );
  }

  const avatarUrl = linkedProfile?.avatar_url;

  const ToggleButton = ({ 
    label, value, onChange, yesLabel = "SIM", noLabel = "NÃO", tooltip 
  }: { 
    label: string; value: boolean; onChange: (v: boolean) => void; yesLabel?: string; noLabel?: string; tooltip?: string;
  }) => (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground flex items-center gap-1">
        {label}
        {tooltip && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/60 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[220px] text-xs">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </Label>
      <div className="flex gap-0.5">
        <button
          onClick={() => onChange(true)}
          className={`px-3 py-1.5 text-xs font-medium rounded-l-md border transition-colors ${
            value
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-muted-foreground border-input hover:bg-accent"
          }`}
        >
          {yesLabel}
        </button>
        <button
          onClick={() => onChange(false)}
          className={`px-3 py-1.5 text-xs font-medium rounded-r-md border transition-colors ${
            !value
              ? "bg-destructive text-destructive-foreground border-destructive"
              : "bg-background text-muted-foreground border-input hover:bg-accent"
          }`}
        >
          {noLabel}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-8 pt-8 pb-4 shrink-0">
        <button onClick={() => navigate("/profissionais")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <h1 className="text-2xl font-display font-bold text-primary">CADASTRO DO PROFISSIONAL</h1>
      </div>

      <div className="flex-1 overflow-auto px-8 pb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Photo column */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div
              className="relative group cursor-pointer w-48 h-56 rounded-lg overflow-hidden bg-muted border"
              onClick={() => professional.user_id ? fileInputRef.current?.click() : toast.error("Vincule uma conta primeiro")}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={professional.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-muted-foreground">
                    {professional.avatar_initials || professional.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
              {professional.user_id && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {uploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
            <p className="text-[10px] text-muted-foreground">JPG, PNG — máx. 2 MB</p>
            {avatarUrl && professional.user_id && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs text-destructive hover:text-destructive"
                onClick={() => setConfirmDeletePhoto(true)}
                disabled={deletingPhoto}
              >
                {deletingPhoto ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Excluir Foto
              </Button>
            )}
          </div>

          {/* Fields column */}
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Nome do Profissional *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Ordem na Agenda</Label>
                <Input type="number" value={form.agenda_order} onChange={e => setForm(f => ({ ...f, agenda_order: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Função / Especialidade</Label>
                <Input value={form.role_description} onChange={e => setForm(f => ({ ...f, role_description: e.target.value }))} placeholder="Ex: Estética / Depilação" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Grupo de Acesso</Label>
                {professional.user_id ? (
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedRole || ""}
                      onValueChange={async (value) => {
                        if (!professional.user_id) return;
                        setSavingRole(true);
                        setSelectedRole(value);
                        try {
                          const { error } = await supabase
                            .from("user_roles")
                            .update({ role: value as "gestor" | "profissional" })
                            .eq("user_id", professional.user_id);
                          if (error) throw error;
                          queryClient.invalidateQueries({ queryKey: ["professional-role", professional.user_id] });
                          toast.success("Grupo de acesso atualizado!");
                        } catch (err: any) {
                          toast.error("Erro: " + err.message);
                          setSelectedRole(userRole || null);
                        } finally {
                          setSavingRole(false);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gestor">Administrador</SelectItem>
                        <SelectItem value="profissional">Profissional</SelectItem>
                      </SelectContent>
                    </Select>
                    {savingRole && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                  </div>
                ) : (
                  <Input value="Sem conta vinculada" disabled className="opacity-60" />
                )}
              </div>
            </div>

            {professional.user_id && linkedProfile?.email && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">E-mail</Label>
                  <Input value={linkedProfile.email} disabled className="opacity-60" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Senha</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 w-full"
                    onClick={handleSendPasswordReset}
                    disabled={sendingReset}
                  >
                    {sendingReset ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                    Enviar E-mail de Redefinição
                  </Button>
                </div>
              </div>
            )}

            {/* Toggle options */}
            <Card>
              <CardContent className="flex flex-wrap gap-6 p-4 items-end">
                <ToggleButton
                  label="Status"
                  value={form.is_active}
                  onChange={v => setForm(f => ({ ...f, is_active: v }))}
                  yesLabel="ATIVO"
                  noLabel="INATIVO"
                  tooltip="ATIVO: acessa o sistema e aparece no Calendário. INATIVO: sem acesso e não aparece no Calendário."
                />
                <ToggleButton
                  label="Receber Agendamento?"
                  value={form.can_receive_appointments}
                  onChange={v => setForm(f => ({ ...f, can_receive_appointments: v }))}
                  tooltip="Se SIM, o nome deste Profissional aparecerá no Calendário para receber agendamentos."
                />
                <ToggleButton
                  label="Ver todas Agendas?"
                  value={form.can_view_all_agendas}
                  onChange={v => setForm(f => ({ ...f, can_view_all_agendas: v }))}
                  tooltip="Se SIM, o profissional consegue ver a agenda de todos. Se NÃO, vê somente a própria agenda."
                />
                <ToggleButton
                  label="Receber E-mail do Agendamento?"
                  value={form.can_receive_email_appointments}
                  onChange={v => setForm(f => ({ ...f, can_receive_email_appointments: v }))}
                  tooltip="Se SIM, o profissional receberá e-mail avisando os agendamentos dos clientes, seja pela Agenda Online ou pelo Calendário."
                />
                <ToggleButton
                  label="Permite alternar entre os Caixas?"
                  value={form.can_switch_registers}
                  onChange={v => setForm(f => ({ ...f, can_switch_registers: v }))}
                  tooltip="Utilizado quando há mais de uma recepcionista. Se SIM, as duas podem trabalhar com o mesmo caixa."
                />
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    Último Acesso
                    <TooltipProvider delayDuration={200}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/60 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[220px] text-xs">
                          Data e hora do último acesso ao sistema. Quando 00:00 indica que ainda não acessou.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    value={professional.last_login_at ? format(new Date(professional.last_login_at), "dd/MM/yyyy HH:mm") : "00:00:00"}
                    disabled
                    className="opacity-60 w-40"
                  />
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSave} disabled={saving || !form.name.trim()} className="gap-1.5">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={confirmDeletePhoto} onOpenChange={setConfirmDeletePhoto}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir foto?</AlertDialogTitle>
            <AlertDialogDescription>
              A foto de perfil de <strong>{professional.name}</strong> será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePhoto} disabled={deletingPhoto}>
              {deletingPhoto && <Loader2 className="w-4 h-4 animate-spin mr-1" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfissionalDetailPage;
