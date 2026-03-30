import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const UserAvatarMenu = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [imgRetries, setImgRetries] = useState(0);

  // Reset error state if profile changes
  useEffect(() => {
    setImgError(false);
    setImgRetries(0);
  }, [profile?.avatar_url]);

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Usuário";
  const displayAvatarUrl = profile?.avatar_url
    ? (imgRetries > 0 
        ? `${profile.avatar_url}${profile.avatar_url.includes('?') ? '&' : '?'}retry=${imgRetries}` 
        : profile.avatar_url)
    : null;
  const initials = displayName.slice(0, 2).toUpperCase();

  const { data: myProfessionalId } = useQuery({
    queryKey: ["my-professional-id", user?.id],
    queryFn: async () => {
      const { data } = await supabase.rpc("get_my_professional_id");
      return data as string | null;
    },
    enabled: !!user,
  });

  return (
    <button
      onClick={() => {
        if (myProfessionalId) {
          navigate(`/profissionais/${myProfessionalId}`);
        }
      }}
      className="flex items-center gap-3 rounded-lg hover:opacity-80 transition-opacity w-full"
    >
      <div className="w-11 h-11 shrink-0 rounded-full ring-2 ring-sidebar-accent bg-sidebar-accent overflow-hidden flex items-center justify-center">
        {displayAvatarUrl && !imgError ? (
          <img
            src={displayAvatarUrl}
            alt={displayName}
            className="w-full h-full object-cover"
            onError={() => {
              if (imgRetries < 2) {
                setImgRetries(prev => prev + 1);
              } else {
                setImgError(true);
              }
            }}
          />
        ) : (
          <span className="text-xs font-bold text-primary">{initials}</span>
        )}
      </div>
      <div className="min-w-0 text-left">
        <p className="text-xs font-bold text-sidebar-accent-foreground truncate">{displayName}</p>
        <p className="text-[9px] text-sidebar-foreground uppercase tracking-[0.15em]">Marli Cosméticos</p>
      </div>
    </button>
  );
};

export default UserAvatarMenu;
