'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import { fetcher } from '@/lib/fetcher';

type ActionsProps = {
  courseId: string;
  disabled?: boolean;
  isPublished?: boolean;
};

export const Actions = ({ courseId, disabled = false, isPublished = false }: ActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();

  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePublication = async () => {
    setIsLoading(true);

    toast.promise(
      fetcher.patch(`/api/courses/${courseId}/${isPublished ? 'unpublish' : 'publish'}`),
      {
        loading: isPublished
          ? 'This course is removing from publications'
          : 'Publication of the course...',
        success: () => {
          setIsLoading(false);

          router.refresh();

          if (isPublished) {
            return 'Course unpublished';
          }

          confetti.onOpen();

          return 'The course has been published';
        },
        error: () => {
          setIsLoading(false);

          return 'Something went wrong';
        },
      },
    );
  };

  const handleDelete = async () => {
    setIsLoading(true);

    await toast.promise(fetcher.delete(`/api/courses/${courseId}`), {
      loading: 'Deleting a course...',
      success: () => {
        setIsLoading(false);

        router.push(`/teacher/courses`);
        router.refresh();

        return 'Course deleted';
      },
      error: () => {
        setIsLoading(false);

        return 'Something went wrong';
      },
    });
  };

  return (
    <div className="flex items-center  gap-x-2">
      <Button
        onClick={handleTogglePublication}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal onConfirm={handleDelete}>
        <Button disabled={isLoading} size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
