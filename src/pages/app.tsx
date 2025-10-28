import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
      <div className='w-full h-full'>
          <Outlet />
      </div>
  )

}

export default AppLayout;