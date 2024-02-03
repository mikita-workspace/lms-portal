import { NavBarRoutes } from '@/components/navbar.routes';
import { ThemeSwitcher } from '@/components/theme-switcher';

import { Logo } from './logo';
import { MobileSideBar } from './sidebar.mobile';

export const NavBar = () => {
  return (
    <div className="p-4 gap-x-4 h-full flex items-center bg-white border-b">
      <MobileSideBar />
      <Logo />
      <div className="flex items-center ml-auto">
        <ThemeSwitcher />
        <NavBarRoutes />
      </div>
    </div>
  );
};
