import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MinhaContaTab from "@/components/settings/MinhaContaTab";

const UserAvatarMenu = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("user_id", user.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  if (!profile) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 rounded-lg hover:opacity-80 transition-opacity w-full"
      >
        <Avatar className="w-11 h-11 shrink-0 ring-2 ring-sidebar-accent bg-sidebar-accent">
          {profile.avatar_url ? (
            <AvatarImage src={profile.avatar_url} alt={profile.full_name} className="object-cover" />
          ) : null}
          <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary" delayMs={200}>
            {profile.full_name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 text-left">
          <p className="text-xs font-bold text-sidebar-accent-foreground truncate">{profile.full_name}</p>
          <p className="text-[9px] text-sidebar-foreground uppercase tracking-[0.15em]">Marli Cosméticos</p>
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Minha Conta</DialogTitle>
          </DialogHeader>
          <MinhaContaTab />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserAvatarMenu;
