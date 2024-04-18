'use client';

import { CheckCircle, Lock, PauseCircle, PlayCircle } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';

type CourseSideBarItemProps = {
  courseId: string;
  id: string;
  isCompleted: boolean;
  isLocked: boolean;
  label: string;
};

export const CourseSideBarItem = ({
  courseId,
  id,
  isCompleted,
  isLocked,
  label,
}: CourseSideBarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = pathname?.includes(id);

  const Icon = useMemo(() => {
    if (isLocked) {
      return Lock;
    }

    if (isActive) {
      return PauseCircle;
    }

    return isCompleted ? CheckCircle : PlayCircle;
  }, [isActive, isCompleted, isLocked]);

  const handleOnClick = () => router.push(`/courses/${courseId}/chapters/${id}`);

  return (
    <button
      className={cn(
        'flex items-center gap-x-2 text-muted-foreground text-sm font-[500] pl-4 pr-2 transition-all duration-300 hover:bg-muted border-b last:border-none',
        isActive && 'text-primary bg-muted',
        isCompleted && 'text-emerald-700 hover:text-emerald-700',
        isCompleted && isActive && 'bg-emerald-200/20',
      )}
      type="button"
      onClick={handleOnClick}
    >
      <div className="flex items-center gap-x-2 py-5">
        <div>
          <Icon
            className={cn(
              'text-muted-foreground',
              isActive && 'text-primary animate-spin-once',
              isCompleted && 'text-emerald-700',
            )}
            size={22}
          />
        </div>
        <p className="text-left line-clamp-2">{label}</p>
      </div>
    </button>
  );
};
