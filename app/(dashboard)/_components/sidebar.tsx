import { SideBarRoutes } from './sidebar.routes';

export const SideBar = () => {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-neutral-900 border-r">
      <SideBarRoutes />
    </div>
  );
};
