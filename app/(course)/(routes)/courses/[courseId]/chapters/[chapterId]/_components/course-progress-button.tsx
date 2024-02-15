'use client';

import { ArrowRight, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import { fetcher } from '@/lib/fetcher';

type CourseProgressButton = {
  chapterId: string;
  courseId: string;
  isCompleted?: boolean;
  nextChapterId?: string;
};

export const CourseProgressButton = ({
  chapterId,
  courseId,
  isCompleted,
  nextChapterId,
}: CourseProgressButton) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleOpenConfetti = useConfettiStore((state) => state.onOpen);

  const handleClick = async () => {
    setIsLoading(true);

    await toast.promise(
      fetcher.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
        body: { isCompleted: !isCompleted },
      }),
      {
        loading: 'Updating progress...',
        success: () => {
          setIsLoading(false);

          if (!isCompleted && !nextChapterId) {
            handleOpenConfetti();
          } else if (!isCompleted && nextChapterId) {
            router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
          }

          router.refresh();
          return 'Progress updated';
        },
        error: () => {
          setIsLoading(false);

          return 'Something went wrong';
        },
      },
    );
  };

  const Icon = isCompleted ? XCircle : ArrowRight;

  return (
    <Button
      className="w-full md:w-auto"
      disabled={isLoading}
      onClick={handleClick}
      size="lg"
      type="button"
      variant={isCompleted ? 'outline' : 'success'}
    >
      {isCompleted ? 'Not completed' : 'Complete and Continue'}
      <Icon className="h-4 w-4 ml-2" />
    </Button>
  );
};
