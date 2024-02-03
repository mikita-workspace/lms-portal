import { SideBarRoutes } from './sidebar.routes';

export const SideBar = () => {
  return (
    <div className="h-full flex flex-col bg-white border-r">
      <SideBarRoutes />
    </div>
  );
};
