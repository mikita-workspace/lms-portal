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
  hasPurchases?: boolean;
  isPublished?: boolean;
};

export const Actions = ({
  courseId,
  disabled = false,
  hasPurchases = false,
  isPublished = false,
}: ActionsProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleOpenConfetti = useConfettiStore((state) => state.onOpen);

  const handleTogglePublication = async () => {
    setIsLoading(true);

    toast.promise(
      fetcher.patch(`/api/courses/${courseId}/${isPublished ? 'unpublish' : 'publish'}`),
      {
        loading: isPublished ? 'Removing from publications' : 'Publishing the course...',
        success: () => {
          setIsLoading(false);

          router.refresh();

          if (isPublished) {
            return 'Course unpublished';
          }

          handleOpenConfetti();

          return 'Course has been published';
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
        <Button disabled={isLoading || hasPurchases} size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
