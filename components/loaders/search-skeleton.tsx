'use client';

import { Skeleton } from '../ui/skeleton';

export const SearchSkeleton = () => (
  <div className="w-full px-6 py-6 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
    {[...Array(8)].map((_, index) => (
      <div key={index} className="flex flex-col space-y-3">
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
    ))}
  </div>
);
