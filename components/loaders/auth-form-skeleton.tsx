'use client';

import { Separator, Skeleton } from '../ui';

export const AuthFormSkeleton = () => (
  <div className="flex flex-col gap-4 w-[415px]">
    <Skeleton className="h-[25px] w-[100px]" />
    <Skeleton className="h-[25px] w-[200px]" />
    <Skeleton className="h-[40px] w-[415px]" />
    <Skeleton className="h-[40px] w-[415px]" />
    <Skeleton className="h-[40px] w-[415px] mt-2" />
    <Separator className="w-[415px] my-2" />
    <div className="flex items-center justify-between gap-x-2">
      <Skeleton className="h-[40px] w-full" />
      <Skeleton className="h-[40px] w-full" />
      <Skeleton className="h-[40px] w-full" />
      <Skeleton className="h-[40px] w-full" />
    </div>
    <Skeleton className="h-[25px] w-[300px] mt-4 self-center" />
  </div>
);
