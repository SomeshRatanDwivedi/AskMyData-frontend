import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import useUserStore from "@/stores/user.store";
import { Navigate, Outlet } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";

function AppLayout() {
  const accessToken = useUserStore(useShallow((state) => state.stUser.accessToken));
  if (!accessToken) {
    return <Navigate to="/auth/login" />
  }
  return (
    <div className="flex w-full justify-between h-full font-sans text-gray-900">
      <Sidebar />
      <main className="flex h-full w-[calc(100%-272px)] flex-col bg-white">
        <Header />
        <div className="h-[calc(100%-64px)]">
          <Outlet />
        </div>
      </main>
    </div>
  )

}

export default AppLayout;