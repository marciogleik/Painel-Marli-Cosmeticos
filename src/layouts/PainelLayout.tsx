import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import UserAvatarMenu from "@/components/UserAvatarMenu";

const PainelLayout = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex justify-end items-center px-6 py-2 shrink-0">
          <UserAvatarMenu />
        </div>
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PainelLayout;
