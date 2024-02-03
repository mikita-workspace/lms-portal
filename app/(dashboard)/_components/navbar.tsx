import { NavBarRoutes } from '@/components/navbar.routes';

import { Logo } from './logo';
import { MobileSideBar } from './sidebar.mobile';

export const NavBar = () => {
  return (
    <div className="p-4 gap-x-4 h-full flex items-center bg-white dark:bg-neutral-800 border-b">
      <MobileSideBar />
      <Logo />
      <NavBarRoutes />
    </div>
  );
};
