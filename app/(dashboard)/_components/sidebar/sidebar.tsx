import { SideBarRoutes } from './sidebar-routes';

export const SideBar = () => {
  return (
    <div className="h-full md:pt-[80px] flex flex-col bg-white dark:bg-neutral-900 border-r">
      <SideBarRoutes />
    </div>
  );
};
