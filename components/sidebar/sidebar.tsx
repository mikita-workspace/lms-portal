import { SideBarRoutes } from './sidebar-routes';

export const SideBar = () => {
  return (
    <div className="h-full md:pt-[80px] flex flex-col justify-between bg-white dark:bg-neutral-900 md:border-r">
      <SideBarRoutes />
    </div>
  );
};
