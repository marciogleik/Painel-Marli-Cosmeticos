import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // Redirect to welcome page on first access
  const onboardingDone = localStorage.getItem("onboarding_done");
  if (!onboardingDone && location.pathname !== "/bem-vinda") {
    return <Navigate to="/bem-vinda" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
