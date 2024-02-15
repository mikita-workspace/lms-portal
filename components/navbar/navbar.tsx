import { Logo } from '../../app/(dashboard)/_components/common/logo';
import { SideBarMobile } from '../sidebar/sidebar-mobile';
import { NavBarRoutes } from './navbar-routes';

export const NavBar = () => {
  return (
    <div className="p-4 gap-x-4 h-full flex items-center bg-white dark:bg-neutral-800 border-b">
      <SideBarMobile />
      <Logo />
      <NavBarRoutes />
    </div>
  );
};
