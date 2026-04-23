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
import { ArrowLeft, Camera, HelpCircle, Loader2, Trash2, KeyRound, Search, Scissors, Check as CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useServices } from "@/hooks/useClinicData";

const ProfissionalDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data: isGestor, isLoading: isLoadingRole } = useQuery({
    queryKey: ["is-gestor", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "gestor",
      });
      return !!data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!isLoadingRole && isGestor === false) {
      navigate("/dashboard");
    }
  }, [isGestor, isLoadingRole, navigate]);
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
  const [serviceSearch, setServiceSearch] = useState("");

  const { data: allServices = [] } = useServices();
  
  const { data: professionalServices = [], isLoading: isLoadingSvcLinks } = useQuery({
    queryKey: ["professional-services-links", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("professional_services")
        .select("*")
        .eq("professional_id", id!)
        .eq("is_active", true);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const toggleServiceMutation = useMutation({
    mutationFn: async ({ serviceId, active }: { serviceId: string, active: boolean }) => {
      const { error } = await supabase
        .from("professional_services")
        .upsert({
          professional_id: id!,
          service_id: serviceId,
          is_active: active,
        }, {
          onConflict: "professional_id,service_id"
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professional-services-links", id] });
    },
    onError: (err: any) => {
      toast.error("Erro ao atualizar serviço: " + err.message);
    }
  });

  const toggleCategoryMutation = useMutation({
    mutationFn: async ({ category, active }: { category: string, active: boolean }) => {
      const servicesInCategory = allServices.filter(s => s.category === category);
      const promises = servicesInCategory.map(s => 
        supabase
          .from("professional_services")
          .upsert({
            professional_id: id!,
            service_id: s.id,
            is_active: active,
          }, {
            onConflict: "professional_id,service_id"
          })
      );
      const results = await Promise.all(promises);
      const error = results.find(r => r.error);
      if (error) throw error.error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professional-services-links", id] });
      toast.success("Categoria atualizada!");
    },
    onError: (err: any) => {
      toast.error("Erro ao atualizar categoria: " + err.message);
    }
  });

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
    <div className="flex items-center justify-between gap-4 p-3 rounded-lg border border-border/40 bg-muted/5">
      <div className="flex items-center gap-2">
        <Label className="text-[11px] sm:text-xs font-bold text-foreground/80 cursor-help flex items-center gap-1.5">
          {label}
          {tooltip && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3 h-3 text-muted-foreground/40 hover:text-primary transition-colors" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[240px] text-[10px] bg-popover/95 backdrop-blur-sm border-border/50">
                  {tooltip}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </Label>
      </div>
      <div className="flex p-0.5 bg-muted rounded-lg border border-border/10 shrink-0">
        <button
          onClick={() => onChange(true)}
          className={cn(
            "px-4 py-2 text-[10px] font-bold rounded-md transition-all duration-200",
            value
              ? "bg-emerald-500 text-white shadow-sm"
              : "text-muted-foreground hover:bg-muted-foreground/5"
          )}
        >
          {yesLabel}
        </button>
        <button
          onClick={() => onChange(false)}
          className={cn(
            "px-4 py-2 text-[10px] font-bold rounded-md transition-all duration-200",
            !value
              ? "bg-destructive text-white shadow-sm"
              : "text-muted-foreground hover:bg-muted-foreground/5"
          )}
        >
          {noLabel}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 sm:px-8 pt-4 sm:pt-6 pb-2 shrink-0">
        <button 
          onClick={() => navigate("/profissionais")} 
          className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-muted-foreground hover:text-primary transition-all mb-2 uppercase tracking-wider"
        >
          <ArrowLeft className="w-3 h-3" /> Voltar para lista
        </button>
        <h1 className="text-xl sm:text-2xl font-display font-bold tracking-tight">Cadastro do Profissional</h1>
        <p className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider opacity-70">
          Gerencie permissões e dados da equipe
        </p>
      </div>

      <div className="flex-1 overflow-hidden px-4 sm:px-8 mt-4">
        <Tabs defaultValue="basis" className="h-full flex flex-col">
          <TabsList className="bg-transparent border-b border-border/10 rounded-none w-full justify-start h-12 gap-6 p-0 mb-6">
            <TabsTrigger 
              value="basis" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 h-full text-xs font-bold uppercase tracking-widest text-muted-foreground data-[state=active]:text-foreground transition-all"
            >
              Dados Gerais
            </TabsTrigger>
            <TabsTrigger 
              value="services" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 h-full text-xs font-bold uppercase tracking-widest text-muted-foreground data-[state=active]:text-foreground transition-all"
            >
              Serviços Habilitados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basis" className="flex-1 overflow-auto pb-8 focus-visible:ring-0 m-0">
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Photo column */}
          <div className="flex flex-col items-center gap-4 shrink-0">
            <div className="relative group">
              <div
                className="relative cursor-pointer w-48 h-56 rounded-2xl overflow-hidden bg-muted border-2 border-dashed border-border/60 hover:border-primary/50 transition-all shadow-sm group-hover:shadow-md"
                onClick={() => professional.user_id ? fileInputRef.current?.click() : toast.error("Vincule uma conta primeiro")}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt={professional.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-40">
                    <Camera className="w-8 h-8" />
                    <span className="text-2xl font-display font-bold">
                      {professional.avatar_initials || professional.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                {professional.user_id && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-background/90 p-2 rounded-full shadow-lg">
                      {uploading ? <Loader2 className="w-5 h-5 text-primary animate-spin" /> : <Camera className="w-5 h-5 text-primary" />}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
            <div className="text-center space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">JPG, PNG — máx. 2 MB</p>
              {avatarUrl && professional.user_id && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-[10px] font-bold text-destructive hover:text-destructive hover:bg-destructive/5 rounded-full"
                  onClick={() => setConfirmDeletePhoto(true)}
                  disabled={deletingPhoto}
                >
                  {deletingPhoto ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                  EXCLUIR FOTO
                </Button>
              )}
            </div>
          </div>

          {/* Fields column */}
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Section: Basic Data */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border/10 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-primary/80">Dados Básicos</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_120px] gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Nome Comercial *</Label>
                    <Input 
                      value={form.name} 
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="bg-card border-border/60 focus:ring-primary/20 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Ordem na Agenda</Label>
                    <Input 
                      type="number" 
                      value={form.agenda_order} 
                      onChange={e => setForm(f => ({ ...f, agenda_order: parseInt(e.target.value) || 0 }))}
                      className="bg-card border-border/60 font-medium"
                    />
                  </div>
                  <div className="space-y-1.5 lg:col-span-2">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Função / Especialidade</Label>
                    <Input 
                      value={form.role_description} 
                      onChange={e => setForm(f => ({ ...f, role_description: e.target.value }))} 
                      placeholder="Ex: Estética / Depilação" 
                      className="bg-card border-border/60 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Section: System Access */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border/10 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-primary/80">Acesso ao Sistema</h3>
                </div>
                {professional.user_id ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Grupo de Acesso</Label>
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
                                .update({ role: value as "gestor" | "profissional" | "secretaria" })
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
                          <SelectTrigger className="w-full bg-card border-border/60 font-medium text-xs h-10">
                            <SelectValue placeholder="Selecione..." />
                          </SelectTrigger>
                          <SelectContent className="bg-popover z-50">
                            <SelectItem value="gestor">Administrador</SelectItem>
                            <SelectItem value="secretaria">Secretária(o)</SelectItem>
                            <SelectItem value="profissional">Profissional</SelectItem>
                          </SelectContent>
                        </Select>
                        {savingRole && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                      </div>
                    </div>
                    {linkedProfile?.email && (
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Redefinir Senha</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 w-full h-10 border-border/60 text-xs font-bold bg-card active:scale-95 transition-all"
                          onClick={handleSendPasswordReset}
                          disabled={sendingReset}
                        >
                          {sendingReset ? <Loader2 className="w-3 h-3 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
                          ENVIAR E-MAIL DE RESET
                        </Button>
                      </div>
                    )}
                    {linkedProfile?.email && (
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">E-mail Vinculado</Label>
                        <Input value={linkedProfile.email} disabled className="opacity-60 bg-muted/30 font-medium text-xs border-border/40" />
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Último Acesso</Label>
                      <Input
                        value={professional.last_login_at ? format(new Date(professional.last_login_at), "dd/MM/yyyy HH:mm") : "Nunca acessou"}
                        disabled
                        className="opacity-60 bg-muted/30 font-medium text-xs border-border/40 h-10"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl">
                    <p className="text-xs font-medium text-amber-700/80">Este profissional ainda não possui uma conta de usuário vinculada.</p>
                  </div>
                )}
              </div>

              {/* Section: Permissions */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border/10 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-primary/80">Permissões e Status</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ToggleButton
                    label="Status do Cadastro"
                    value={form.is_active}
                    onChange={v => setForm(f => ({ ...f, is_active: v }))}
                    yesLabel="ATIVO"
                    noLabel="INATIVO"
                    tooltip="ATIVO: acessa o sistema e aparece no Calendário. INATIVO: sem acesso e não aparece no Calendário."
                  />
                  <ToggleButton
                    label="Exibir na Agenda?"
                    value={form.can_receive_appointments}
                    onChange={v => setForm(f => ({ ...f, can_receive_appointments: v }))}
                    tooltip="Se SIM, o nome deste Profissional aparecerá como coluna na Agenda."
                  />
                  <ToggleButton
                    label="Ver todas Agendas?"
                    value={form.can_view_all_agendas}
                    onChange={v => setForm(f => ({ ...f, can_view_all_agendas: v }))}
                    tooltip="Se SIM, o profissional consegue ver a agenda de todos. Se NÃO, vê somente a própria agenda."
                  />
                  <ToggleButton
                    label="Receber E-mail de Avisos?"
                    value={form.can_receive_email_appointments}
                    onChange={v => setForm(f => ({ ...f, can_receive_email_appointments: v }))}
                    tooltip="Se SIM, o profissional receberá e-mail avisando os agendamentos dos clientes."
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button 
                onClick={handleSave} 
                disabled={saving || !form.name.trim()} 
                className="gap-2 w-full sm:w-auto h-12 px-8 rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-all text-xs font-bold uppercase tracking-widest"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="services" className="flex-1 overflow-hidden focus-visible:ring-0 m-0 pb-8 flex flex-col">
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">Configuração de Procedimentos</h3>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider opacity-70">Marque quais serviços esta profissional está autorizada a realizar</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
              <Input 
                placeholder="Pesquisar serviço..." 
                value={serviceSearch}
                onChange={e => setServiceSearch(e.target.value)}
                className="pl-9 h-9 rounded-xl text-xs bg-muted/5 border-border/40"
              />
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
            {Array.from(new Set(allServices.map(s => s.category))).sort().map(category => {
              const servicesInCategory = allServices
                .filter(s => s.category === category)
                .filter(s => s.name.toLowerCase().includes(serviceSearch.toLowerCase()));
              
              if (servicesInCategory.length === 0) return null;

              const enabledInCategory = servicesInCategory.filter(s => 
                professionalServices.some(ps => ps.service_id === s.id)
              );
              const allEnabled = enabledInCategory.length === servicesInCategory.length && servicesInCategory.length > 0;

              return (
                <div key={category} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/10 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                        <Scissors className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground/80">{category}</h4>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={cn(
                        "h-7 text-[9px] font-bold px-2 rounded-full transition-colors",
                        allEnabled ? "text-primary hover:bg-primary/5" : "text-muted-foreground hover:bg-muted/5"
                      )}
                      onClick={() => toggleCategoryMutation.mutate({ category, active: !allEnabled })}
                    >
                      {allEnabled ? "DESATIVAR TUDO" : "ATIVAR TUDO"}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {servicesInCategory.map(service => {
                      const isEnabled = professionalServices.some(ps => ps.service_id === service.id);
                      return (
                        <div 
                          key={service.id} 
                          className={cn(
                            "flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer group",
                            isEnabled 
                              ? "bg-primary/5 border-primary/20" 
                              : "bg-muted/5 border-transparent hover:border-border/40"
                          )}
                          onClick={() => toggleServiceMutation.mutate({ serviceId: service.id, active: !isEnabled })}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-5 h-5 rounded-md flex items-center justify-center border transition-all",
                              isEnabled ? "bg-primary border-primary text-white" : "bg-card border-border/60"
                            )}>
                              {isEnabled && <CheckIcon className="w-3.5 h-3.5 font-black" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-foreground/90 leading-none truncate">{service.name}</p>
                              <p className="text-[9px] text-muted-foreground/60 font-medium mt-1 uppercase tracking-wider">{service.duration_minutes} min</p>
                            </div>
                          </div>
                          {isEnabled && (
                            <div className="px-1.5 py-0.5 rounded-full bg-primary/10 text-[8px] font-black text-primary uppercase tracking-tighter">
                              Habilitado
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </TabsContent>
        </Tabs>
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
