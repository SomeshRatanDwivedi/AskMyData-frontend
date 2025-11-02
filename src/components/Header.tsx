
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
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { firstName = "", lastName = "", stFnResetUserStore } = useUserStore(useShallow((state) => ({ firstName: state.stUser.firstName, lastName: state.stUser.lastName, stFnResetUserStore: state.stFnResetUserStore })));
  const navigate = useNavigate();
  const logo = firstName[0]?.toUpperCase() + lastName[0]?.toUpperCase();

  const handleLogout = () => {
    localStorage.clear();
    stFnResetUserStore();
    return navigate("/auth/login");
  }
  const handleProfileClick = () => {
    return navigate("/app/profile");
  }
  return (
    <header className="shrink-0 h-16 flex items-center justify-end px-8 border-b border-gray-200">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">{logo}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleProfileClick}>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
};

export default Header;
