import useUserStore from "@/stores/user.store";
import { Navigate, Outlet } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";

function AppLayout() {
  const accessToken = useUserStore(useShallow((state) => state.stUser.accessToken));
  if (!accessToken) {
    return <Navigate to="/auth/login" />
  }
  return (
      <div className='w-full h-full'>
          <Outlet />
      </div>
  )

}

export default AppLayout;