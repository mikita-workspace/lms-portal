'use client';

import { Skeleton } from '../ui/skeleton';

export const LeaderBoardSkeleton = () => (
  <div className="w-full px-6 pt-10 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:w-4/5 mx-auto">
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-4  w-5/6" />
    <Skeleton className="h-4 w-[200px]" />
    <Skeleton className="h-4 w-[200px]" />
    <Skeleton className="h-4 w-4/5" />
    <Skeleton className="h-4 w-4/5" />
    <Skeleton className="h-4 w-[285px] mb-6" />
    <Skeleton className="h-4 w-[285px] mb-6" />
    <Skeleton className="h-4 w-4/5" />
    <Skeleton className="h-4 w-4/5" />
    <Skeleton className="h-4 w-[200px]" />
    <Skeleton className="h-4 w-[200px]" />
    <Skeleton className="h-4 w-3/5" />
    <Skeleton className="h-4 w-3/5" />
    <Skeleton className="h-4 w-[285px]" />
    <Skeleton className="h-4 w-[285px]" />
  </div>
);
