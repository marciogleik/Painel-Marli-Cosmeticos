import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Loader2, User, Mail, Phone, ShieldCheck, Sparkles, LogOut } from "lucide-react";
import { toast } from "sonner";

const MinhaContaTab = () => {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [fullName, setFullName] = useState("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, phone")
        .eq("user_id", user.id)
        .single();
      if (data) setFullName(data.full_name || "");
      return data;
    },
    enabled: !!user,
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 2 MB");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      queryClient.invalidateQueries({ queryKey: ["profile-avatars"] });
      toast.success("Foto atualizada com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao enviar foto: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveName = async () => {
    if (!user || !fullName.trim()) return;
    setSavingName(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName.trim() })
        .eq("user_id", user.id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      toast.success("Nome atualizado!");
    } catch (err: any) {
      toast.error("Erro ao salvar: " + err.message);
    } finally {
      setSavingName(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
        <p className="text-sm text-muted-foreground font-medium">Carregando informações da conta...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-8 pb-24">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-64 flex flex-col items-center gap-4 bg-muted/5 p-8 rounded-[2.5rem] border border-border/40">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary/40 to-primary/10 rounded-full blur-sm opacity-50 group-hover:opacity-100 transition duration-500" />
            <Avatar className="w-32 h-32 relative cursor-pointer border-4 border-background ring-1 ring-primary/20 shadow-2xl transition-transform duration-500 hover:scale-105" onClick={() => fileInputRef.current?.click()}>
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.full_name || ""} className="object-cover" />
              ) : null}
              <AvatarFallback className="text-3xl font-black bg-primary/5 text-primary">
                {profile?.full_name?.slice(0, 2).toUpperCase() || <User className="w-10 h-10 opacity-40" />}
              </AvatarFallback>
            </Avatar>
            
            <button 
              className="absolute bottom-1 right-1 w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all outline-none border-4 border-background"
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={uploading}
            />
          </div>

          <div className="text-center space-y-1">
            <h3 className="font-display font-bold text-xl text-foreground/90">{profile?.full_name || "Usuário"}</h3>
            <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest leading-none">Minha Conta</p>
          </div>
          
          <div className="w-full pt-4 space-y-2">
             <Button variant="ghost" className="w-full h-11 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 gap-2 font-bold text-xs uppercase tracking-widest" onClick={() => signOut()}>
               <LogOut className="w-4 h-4" /> Sair da Conta
             </Button>
          </div>
        </div>

        <div className="flex-1 w-full space-y-6">
          <Card className="rounded-[2.5rem] border-border/40 overflow-hidden shadow-sm hover:shadow-md transition-all">
            <CardHeader className="bg-muted/5 border-b border-border/40 py-5 px-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <User className="w-4 h-4" />
                </div>
                <CardTitle className="text-xl font-display font-bold">Dados Pessoais</CardTitle>
                <Sparkles className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-px">Nome Completo</Label>
                <Input 
                  value={fullName} 
                  onChange={e => setFullName(e.target.value)} 
                  className="h-12 rounded-2xl bg-muted/20 border-border/30 focus:border-primary/30 focus:ring-primary/20 font-medium transition-all"
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-px flex items-center gap-1.5">
                    <Mail className="w-2.5 h-2.5" /> E-mail de Acesso
                  </Label>
                  <div className="h-12 rounded-2xl bg-muted/10 border border-border/30 px-4 flex items-center text-sm font-medium text-muted-foreground/70 select-none">
                    {user?.email}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-px flex items-center gap-1.5">
                    <Phone className="w-2.5 h-2.5" /> Telefone Vinculado
                  </Label>
                  <div className="h-12 rounded-2xl bg-muted/10 border border-border/30 px-4 flex items-center text-sm font-medium text-muted-foreground/70 select-none">
                    {profile?.phone || "Não informado"}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={handleSaveName} 
                  disabled={savingName || fullName.trim() === profile?.full_name} 
                  className="h-12 rounded-2xl px-8 font-bold gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all w-full sm:w-auto"
                >
                  {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="p-6 rounded-3xl bg-primary/[0.03] border border-primary/10 flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-foreground/80 leading-tight">Segurança e Privacidade</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Seus dados estão protegidos por criptografia de ponta a ponta. Para alterar sua senha ou e-mail de acesso, entre em contato com o suporte da clínica.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinhaContaTab;
