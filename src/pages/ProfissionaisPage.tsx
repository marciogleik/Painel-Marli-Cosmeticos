import { useNavigate } from "react-router-dom";
import { useProfessionals } from "@/hooks/useClinicData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const ProfissionaisPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showInactive, setShowInactive] = useState(false);

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

  const { data: professionals = [], isLoading: isLoadingProfs } = useProfessionals(showInactive);

  useEffect(() => {
    if (!isLoadingRole && isGestor === false) {
      navigate("/dashboard");
    }
  }, [isGestor, isLoadingRole, navigate]);

  const isLoading = isLoadingRole || isLoadingProfs;

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

  const active = professionals.filter(p => p.is_active);
  const inactive = professionals.filter(p => !p.is_active);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 sm:px-8 pt-4 sm:pt-8 pb-2 shrink-0">
        <h1 className="text-xl sm:text-2xl font-display font-bold">Profissionais</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Gerencie a equipe da clínica</p>
      </div>

      <div className="flex-1 overflow-auto px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-muted/20 p-4 rounded-xl border border-border/10">
          <p className="text-[11px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-70">
            {active.length} {active.length === 1 ? 'Profissional Ativo' : 'Profissionais Ativos'}
          </p>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">Mostrar inativos</span>
            <Switch checked={showInactive} onCheckedChange={setShowInactive} className="scale-90" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {active.map(p => (
              <Card
                key={p.id}
                className="group relative overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50 bg-card"
                onClick={() => navigate(`/profissionais/${p.id}`)}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 to-primary/10" />
                <CardContent className="flex flex-col items-center gap-4 p-6 pt-8 text-center">
                  <div className="relative">
                    {getAvatarUrl(p) ? (
                      <img src={getAvatarUrl(p)} alt={p.name} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-background shadow-lg group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center ring-4 ring-background shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <span className="text-2xl font-display font-bold text-primary/60">{p.avatar_initials || p.name.slice(0, 2).toUpperCase()}</span>
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-4 border-background shadow-sm" />
                  </div>
                  
                  <div className="min-w-0 space-y-1">
                    <p className="font-display font-bold text-base tracking-tight text-foreground group-hover:text-primary transition-colors">{p.name}</p>
                    <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide opacity-80">{p.role_description || "Equipe Marli"}</p>
                  </div>

                  <div className="w-full h-px bg-border/40 my-1" />
                  
                  <div className="flex items-center justify-center gap-3 w-full">
                    <div className="flex flex-col items-center px-3 py-1 bg-muted/30 rounded-lg">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">Agenda</span>
                      <span className="text-xs font-bold text-foreground">#{p.agenda_order ?? 0}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[10px] h-8 font-bold text-primary group-hover:bg-primary/5">
                      VER PERFIL
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {showInactive && inactive.map(p => (
              <Card
                key={p.id}
                className="group relative overflow-hidden grayscale opacity-60 border-dashed cursor-pointer hover:grayscale-0 hover:opacity-100 transition-all duration-300 hover:border-primary/50"
                onClick={() => navigate(`/profissionais/${p.id}`)}
              >
                <CardContent className="flex flex-col items-center gap-4 p-6 pt-8 text-center">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center ring-4 ring-background shadow-md">
                      <span className="text-2xl font-display font-bold text-muted-foreground/60">{p.avatar_initials || p.name.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-muted-foreground/30 border-4 border-background" />
                  </div>
                  
                  <div className="min-w-0 space-y-1">
                    <p className="font-display font-bold text-base tracking-tight text-foreground">{p.name}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Inativo</p>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="mt-2 text-[10px] font-bold">
                    REATIVAR PERFIL
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfissionaisPage;
