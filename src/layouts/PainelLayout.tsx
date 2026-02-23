import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import placeLogo from "@/assets/place-logo.png";

const PainelLayout = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Outlet />
        <div className="flex items-center justify-center gap-2 py-3 opacity-70 hover:opacity-100 transition-opacity">
          <span className="text-xs text-muted-foreground">powered by</span>
          <img src={placeLogo} alt="Place" className="h-5" />
        </div>
      </main>
    </div>
  );
};

export default PainelLayout;
