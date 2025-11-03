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
    <div className="flex w-full justify-between h-full bg-(--theme-bg-container) font-sans text-gray-900">
      <Sidebar />
      <main className="flex w-[calc(100%-272px)] flex-col bg-white">
        <Header />
       <Outlet/>
      </main>
    </div>
  )

}

export default AppLayout;