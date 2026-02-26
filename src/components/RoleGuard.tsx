import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  children: React.ReactNode;
  denyRoles: string[];
  redirectTo?: string;
}

const RoleGuard = ({ children, denyRoles, redirectTo = "/dashboard" }: RoleGuardProps) => {
  const { user } = useAuth();

  const { data: userRole, isLoading } = useQuery({
    queryKey: ["my-role", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .single();
      return data?.role ?? null;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (userRole && denyRoles.includes(userRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
