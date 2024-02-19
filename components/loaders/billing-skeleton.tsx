'use client';

import { Skeleton } from '../ui/skeleton';

export const BillingSkeleton = () => (
  <div className="w-full px-6 pt-10 pb-6 flex flex-col mx-auto gap-y-4">
    <Skeleton className="h-[30px] w-[150px] mb-4" />
    <Skeleton className="h-[40px] mb-4 mt-8" />
    <div className="flex flex-col gap-8">
      <div className="flex space-x-6 w-full items-center justify-between">
        <div className="flex gap-4 justify-between w-full items-center">
          <div className="flex flex-col justify-center gap-2">
            <Skeleton className="h-[15px] w-[150px]" />
            <Skeleton className="h-[15px] w-[50px]" />
          </div>
          <div className="md:flex hidden flex-col justify-center gap-2">
            <Skeleton className="h-[30px] w-[100px]" />
          </div>
          <div className="md:flex hidden flex-col justify-center gap-2">
            <Skeleton className="h-[30px] w-[100px]" />
          </div>
          <div className="flex justify-center gap-2">
            <Skeleton className="h-[15px] w-[25px]" />
            <Skeleton className="h-[15px] w-[30px]" />
          </div>
        </div>
      </div>
      <div className="flex space-x-6 w-full items-center justify-between">
        <div className="flex gap-4 justify-between w-full items-center">
          <div className="flex flex-col justify-center gap-2">
            <Skeleton className="h-[15px] w-[150px]" />
            <Skeleton className="h-[15px] w-[50px]" />
          </div>
          <div className="md:flex hidden flex-col justify-center gap-2">
            <Skeleton className="h-[30px] w-[100px]" />
          </div>
          <div className="md:flex hidden flex-col justify-center gap-2">
            <Skeleton className="h-[30px] w-[100px]" />
          </div>
          <div className="flex justify-center gap-2">
            <Skeleton className="h-[15px] w-[25px]" />
            <Skeleton className="h-[15px] w-[30px]" />
          </div>
        </div>
      </div>
      <div className="flex space-x-6 w-full items-center justify-between">
        <div className="flex gap-4 justify-between w-full items-center">
          <div className="flex flex-col justify-center gap-2">
            <Skeleton className="h-[15px] w-[150px]" />
            <Skeleton className="h-[15px] w-[50px]" />
          </div>
          <div className="md:flex hidden flex-col justify-center gap-2">
            <Skeleton className="h-[30px] w-[100px]" />
          </div>
          <div className="md:flex hidden flex-col justify-center gap-2">
            <Skeleton className="h-[30px] w-[100px]" />
          </div>
          <div className="flex justify-center gap-2">
            <Skeleton className="h-[15px] w-[25px]" />
            <Skeleton className="h-[15px] w-[30px]" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
