'use client';

import { CheckCircle, Lock, PlayCircle } from 'lucide-react';
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

  const Icon = useMemo(() => {
    if (isLocked) {
      return Lock;
    }

    return isCompleted ? CheckCircle : PlayCircle;
  }, [isCompleted, isLocked]);

  const isActive = pathname?.includes(id);

  const handleOnClick = () => router.push(`/courses/${courseId}/chapter/${id}`);

  return (
    <button
      className={cn(
        'flex items-center gap-x-2 text-neutral-500 text-sm font-[500] pl-6 transition-all duration-300 hover:text-neutral-600 hover:bg-neutral-300/20',
        isActive &&
          'text-neutral-700 bg-neutral-200/20 hover:bg-neutral-200/20 hover:text-neutral-700',
        isCompleted && 'text-emerald-700 hover:text-emerald-700',
        isCompleted && isActive && 'bg-emerald-200/20',
      )}
      type="button"
      onClick={handleOnClick}
    >
      <div className="flex items center gap-x-2 py-4">
        <Icon
          className={cn(
            'text-neutral-500',
            isActive && 'text-neutral-700',
            isCompleted && 'text-emerald-700',
          )}
          size={22}
        />
        {label}
      </div>
      <div
        className={cn(
          'ml-auto opacity-0 border-2 border-neutral-700 h-full transition-all duration-300',
          isActive && 'opacity-100',
          isCompleted && 'border-emerald-700',
        )}
      ></div>
    </button>
  );
};
