import { Notification } from '@prisma/client';

import { Logo } from '../common/logo';
import { SideBarMobile } from '../sidebar/sidebar-mobile';
import { NavBarRoutes } from './navbar-routes';

type NavBarProps = {
  isChat?: boolean;
  globalProgress?: {
    progressPercentage: number;
    total: number;
    value: number;
  } | null;
  userNotifications?: Omit<Notification, 'userId'>[];
};

export const NavBar = ({ isChat = false, globalProgress, userNotifications }: NavBarProps) => {
  return (
    <div className="p-4 gap-x-4 h-full flex items-center bg-white dark:bg-neutral-800 border-b">
      {!isChat && <SideBarMobile />}
      <Logo />
      <NavBarRoutes globalProgress={globalProgress} userNotifications={userNotifications} />
    </div>
  );
};
