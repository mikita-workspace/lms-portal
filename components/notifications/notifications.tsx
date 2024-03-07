'use client';

import { TbBellRinging2Filled } from 'react-icons/tb';

export const Notifications = () => {
  return (
    <div className="relative rounded-full w-[40px] h-[40px] flex items-center justify-center hover:cursor-pointer hover:bg-muted transition-background ease-in-out duration-300">
      <TbBellRinging2Filled className="h-5 w-5" />
      <div className="absolute w-[14px] h-[14px] rounded-full bg-red-500 top-2 right-1 flex items-center justify-center truncate">
        <span className="text-white font-semibold text-[8px]">9</span>
      </div>
    </div>
  );
};
