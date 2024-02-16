'use client';

import { Skeleton } from '../ui/skeleton';

export const LeaderBoardSkeleton = () => (
  <div className="md:w-4/5 w-full px-6 pt-10 pb-6 flex flex-col mx-auto gap-y-4">
    <Skeleton className="h-[40px] mb-4" />
    <div className="flex justify-between">
      <div className="flex space-x-6 w-full items-center justify-between">
        <div className="flex gap-4">
          <Skeleton className="h-[55px] w-[60px] md:mr-6" />
          <Skeleton className="h-[55px] w-[55px] rounded-full" />
          <div className="flex flex-col justify-center gap-2">
            <Skeleton className="h-[15px] w-[150px]" />
            <Skeleton className="h-[15px] w-[50px]" />
          </div>
        </div>
        <Skeleton className="h-[20px] w-[40px] hidden md:block" />
      </div>
    </div>
    <div className="flex justify-between">
      <div className="flex space-x-6 w-full items-center justify-between">
        <div className="flex gap-4">
          <Skeleton className="h-[55px] w-[60px] md:mr-6" />
          <Skeleton className="h-[55px] w-[55px] rounded-full" />
          <div className="flex flex-col justify-center gap-2">
            <Skeleton className="h-[15px] w-[150px]" />
            <Skeleton className="h-[15px] w-[50px]" />
          </div>
        </div>
        <Skeleton className="h-[20px] w-[40px] hidden md:block" />
      </div>
    </div>
    <div className="flex justify-between">
      <div className="flex space-x-6 w-full items-center justify-between">
        <div className="flex gap-4">
          <Skeleton className="h-[55px] w-[60px] md:mr-6" />
          <Skeleton className="h-[55px] w-[55px] rounded-full" />
          <div className="flex flex-col justify-center gap-2">
            <Skeleton className="h-[15px] w-[150px]" />
            <Skeleton className="h-[15px] w-[50px]" />
          </div>
        </div>
        <Skeleton className="h-[20px] w-[40px] hidden md:block" />
      </div>
    </div>
  </div>
);
