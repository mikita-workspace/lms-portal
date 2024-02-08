'use client';

import axios from 'axios';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui';

type ChapterActionsProps = {
  chapterId: string;
  courseId: string;
  disabled?: boolean;
  isPublished?: boolean;
};

export const ChapterActions = ({
  chapterId,
  courseId,
  disabled = false,
  isPublished = false,
}: ChapterActionsProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePublication = async () => {
    setIsLoading(true);

    toast.promise(
      axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}/${isPublished ? 'unpublish' : 'publish'}`,
      ),
      {
        loading: isPublished
          ? 'This chapter is removing from publications'
          : 'Publication of the chapter...',
        success: () => {
          setIsLoading(false);

          router.refresh();

          return isPublished ? 'Chapter unpublished' : 'The chapter has been published';
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

    await toast.promise(axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`), {
      loading: 'Deleting a chapter...',
      success: () => {
        setIsLoading(false);

        router.push(`/teacher/courses/${courseId}`);
        router.refresh();

        return 'Chapter deleted';
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
