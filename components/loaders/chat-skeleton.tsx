'use client';

import { Skeleton } from '../ui/skeleton';

export const ChatSkeleton = () => (
  <div className="mx-auto flex flex-row gap-3 lg:max-w-2xl xl:max-w-3xl w-full h-full px-4">
    <div className="w-full h-full px-2 pt-6 pb-4 flex flex-col mx-auto justify-between">
      <div className="flex mb-10 justify-between space-x-2">
        <Skeleton className="h-8 w-[140px]" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-10" />
        </div>
      </div>
      <div className="flex flex-col gap-y-6 justify-start h-full">
        <div className="flex gap-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex flex-col gap-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[170px]" />
          </div>
        </div>
        <div className="flex gap-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex flex-col gap-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[170px]" />
          </div>
        </div>
        <div className="flex gap-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex flex-col gap-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[170px]" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-2 items-center">
        <Skeleton className="h-[100px] w-full" />
        <Skeleton className="w-2/3 h-2" />
      </div>
    </div>
  </div>
);
