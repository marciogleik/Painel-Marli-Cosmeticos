import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import placeLogo from "@/assets/place-logo.png";

const PainelLayout = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Outlet />
        <div className="flex items-center justify-center gap-1.5 py-2 opacity-40 hover:opacity-60 transition-opacity">
          <span className="text-[10px] text-muted-foreground">powered by</span>
          <img src={placeLogo} alt="Place" className="h-3" />
        </div>
      </main>
    </div>
  );
};

export default PainelLayout;
