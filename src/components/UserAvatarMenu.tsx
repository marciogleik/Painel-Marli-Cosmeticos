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
        className="flex items-center gap-2.5 rounded-lg hover:bg-sidebar-accent transition-colors w-full px-1 py-1.5"
      >
        <Avatar className="w-7 h-7 shrink-0">
          {profile.avatar_url ? (
            <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
          ) : null}
          <AvatarFallback className="text-[10px] font-bold">
            {profile.full_name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <p className="text-[11px] font-medium text-primary truncate">{profile.full_name}</p>
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
