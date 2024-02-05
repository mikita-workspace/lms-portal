import { Logo } from '../common';
import { SideBarMobile } from '../sidebar';
import { NavBarRoutes } from '.';

export const NavBar = () => {
  return (
    <div className="p-4 gap-x-4 h-full flex items-center bg-white dark:bg-neutral-800 border-b">
      <SideBarMobile />
      <Logo />
      <NavBarRoutes />
    </div>
  );
};
