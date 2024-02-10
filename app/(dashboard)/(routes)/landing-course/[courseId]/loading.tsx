import { Skeleton } from '@/components/ui/skeleton';

const LandingCourseLoading = () => {
  return (
    <div className="w-full px-6 pt-6 grid grid-cols-1 md:grid-cols-5 gap-6">
      <div className="flex flex-col space-y-3 md:col-span-3">
        <Skeleton className="w-full aspect-video rounded-lg overflow-hidden" />
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
};

export default LandingCourseLoading;
