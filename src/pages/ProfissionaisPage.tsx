import { useNavigate } from "react-router-dom";
import { useProfessionals } from "@/hooks/useClinicData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const ProfissionaisPage = () => {
  const navigate = useNavigate();
  const [showInactive, setShowInactive] = useState(false);
  const { data: professionals = [], isLoading } = useProfessionals(showInactive);

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
      <div className="px-8 pt-8 pb-2 shrink-0">
        <h1 className="text-2xl font-display font-bold">Profissionais</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Gerencie a equipe da clínica</p>
      </div>

      <div className="flex-1 overflow-auto px-8 py-4">
        <div className="flex items-center gap-3 mb-4">
          <p className="text-sm text-muted-foreground">{active.length} profissionais ativos</p>
          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-muted-foreground">
            <Switch checked={showInactive} onCheckedChange={setShowInactive} className="scale-75" />
            Mostrar inativos
          </label>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {active.map(p => (
              <Card
                key={p.id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => navigate(`/profissionais/${p.id}`)}
              >
                <CardContent className="flex items-center gap-3 p-4">
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
                </CardContent>
              </Card>
            ))}

            {showInactive && inactive.map(p => (
              <Card
                key={p.id}
                className="opacity-50 border-dashed cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => navigate(`/profissionais/${p.id}`)}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-muted-foreground">{p.avatar_initials || p.name.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground truncate">Inativo</p>
                  </div>
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
