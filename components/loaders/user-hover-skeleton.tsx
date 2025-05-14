'use client';

import { Skeleton } from '../ui/skeleton';

export const UserHoverSkeleton = () => (
  <div className="flex items-center space-x-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[180px]" />
    </div>
  </div>
);
