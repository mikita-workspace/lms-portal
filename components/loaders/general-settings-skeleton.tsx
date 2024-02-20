'use client';

import { Skeleton } from '../ui/skeleton';

export const GeneralSettingsSkeleton = () => (
  <div className="w-full px-6 pt-10 pb-6 flex flex-col mx-auto gap-y-4">
    <Skeleton className="h-[30px] w-[150px] mb-4" />
    <Skeleton className="h-[30px] w-[300px] mb-4" />
    <div className="mb-4 mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      <Skeleton className="h-[40px]" />
      <Skeleton className="h-[40px]" />
      <Skeleton className="h-[40px]" />
    </div>
    <div className="flex flex-col mt-6">
      <Skeleton className="h-[40px] w-[120px]" />
    </div>
  </div>
);
