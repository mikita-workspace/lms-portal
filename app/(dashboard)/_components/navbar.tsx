import { NavBarRoutes } from '@/components/navbar.routes';
import { ThemeSwitcher } from '@/components/theme-switcher';

import { MobileSideBar } from './sidebar.mobile';

export const NavBar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileSideBar />
      <div className="flex items-center ml-auto">
        <ThemeSwitcher />
        <NavBarRoutes />
      </div>
    </div>
  );
};
