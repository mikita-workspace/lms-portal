'use client';

import { Skeleton } from '../ui/skeleton';

export const PreviewCourseSkeleton = () => (
  <div className="w-full px-6 py-6 grid grid-cols-1 md:grid-cols-5 gap-6">
    <div className="flex flex-col space-y-3 md:col-span-3">
      <Skeleton className="w-full aspect-w-16 aspect-h-9 rounded-lg overflow-hidden" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Skeleton className="h-4 w-[20px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
          <Skeleton className="h-4 w-[70px]" />
        </div>
      </div>
    </div>
    <div className="space-y-6 md:col-span-2">
      <Skeleton className="w-full h-[200px] rounded-lg overflow-hidden" />
      <div className="space-y-2">
        <div className="flex space-x-2">
          <Skeleton className="h-4 w-[20px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
        <Skeleton className="h-4 w-[70px]" />
      </div>
    </div>
  </div>
);
