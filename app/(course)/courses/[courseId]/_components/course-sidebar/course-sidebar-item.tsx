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

  const handleOnClick = () => router.push(`/courses/${courseId}/chapters/${id}`);

  return (
    <button
      className={cn(
        'flex items-center gap-x-2 text-muted-foreground text-sm font-[500] pl-6 transition-all duration-300 hover:bg-muted',
        isActive && 'text-primary bg-muted',
        isCompleted && 'text-emerald-700 hover:text-emerald-700',
        isCompleted && isActive && 'bg-emerald-200/20',
      )}
      type="button"
      onClick={handleOnClick}
    >
      <div className="flex items center gap-x-2 py-4">
        <Icon
          className={cn(
            'text-muted-foreground',
            isActive && 'text-primary',
            isCompleted && 'text-emerald-700',
          )}
          size={22}
        />
        {label}
      </div>
    </button>
  );
};
