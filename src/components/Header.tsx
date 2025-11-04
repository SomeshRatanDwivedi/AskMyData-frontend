
import useUserStore from '@/stores/user.store';
import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from 'react-router-dom';
import { NavigationMenuDemo } from './NavigationMenu';


const Header: React.FC = () => {
  const { stUser,stFnResetUserStore } = useUserStore(useShallow((state) => ({ stUser: state.stUser, stFnResetUserStore: state.stFnResetUserStore })));
  const { isAdmin, firstName = "", lastName = "", userId } = stUser;
  const navigate = useNavigate();
  const logo = firstName[0]?.toUpperCase() + lastName[0]?.toUpperCase();

  const handleLogout = () => {
    localStorage.clear();
    stFnResetUserStore();
    return navigate("/auth/login");
  }
  const handleProfileClick = () => {
    return navigate(`/app/profile/${userId}`);
  }

  const handleSettingClick = () => {
    return navigate("/app/settings");
  }
  return (
    <header className="shrink-0 h-16 flex items-center justify-between md:justify-end px-8 border-b border-gray-200">
      <div className='md:hidden flex'>
        <NavigationMenuDemo />
        <h1 className="text-2xl font-bold bg-white px-4 cursor-pointer" onClick={() => navigate("/app")}>AskMyData</h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">{logo}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleProfileClick}>
              Profile
            </DropdownMenuItem>
            {
              isAdmin && (
                <DropdownMenuItem onClick={handleSettingClick}>
                  Settings
                </DropdownMenuItem>
              )
            }

          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
};

export default Header;
