import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import marliLogo from "@/assets/marli-logo.jpg";

const PainelLayout = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <img
          src={marliLogo}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute bottom-6 right-6 w-48 opacity-[0.04]"
        />
        <Outlet />
      </main>
    </div>
  );
};

export default PainelLayout;
