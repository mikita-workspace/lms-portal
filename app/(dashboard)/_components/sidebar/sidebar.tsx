import getConfig from 'next/config';

import { SideBarRoutes } from './sidebar-routes';

export const SideBar = () => {
  return (
    <div className="h-full md:pt-[80px] flex flex-col justify-between bg-white dark:bg-neutral-900 border-r">
      <SideBarRoutes />
      {/* TODO: Temporary label for Test mode */}
      <div className="mb-4 ml-3 text-muted-foreground text-xs">
        <p>
          The Portal works in <strong>TEST</strong> mode.
        </p>
        <p>Version: {getConfig().publicRuntimeConfig?.version}.</p>
      </div>
    </div>
  );
};
