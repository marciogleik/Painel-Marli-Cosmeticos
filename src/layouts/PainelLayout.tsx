import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";

const PainelLayout = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default PainelLayout;
