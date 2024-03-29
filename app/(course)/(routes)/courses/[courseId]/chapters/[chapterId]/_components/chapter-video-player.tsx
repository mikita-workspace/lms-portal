'use client';

import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { BiLoaderAlt } from 'react-icons/bi';

import { VideoPlayer } from '@/components/common/video-player';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import { fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';

type ChapterVideoPlayerProps = {
  chapterId: string;
  completeOnEnd?: boolean;
  courseId: string;
  isLocked: boolean;
  nextChapterId?: string;
  videoUrl?: string | null;
};

export const ChapterVideoPlayer = ({
  chapterId,
  completeOnEnd = false,
  courseId,
  isLocked,
  nextChapterId,
  videoUrl,
}: ChapterVideoPlayerProps) => {
  const router = useRouter();

  const [isReady, setIsReady] = useState(false);

  const handleOpenConfetti = useConfettiStore((state) => state.onOpen);

  const handleEnd = async () => {
    if (completeOnEnd) {
      await toast.promise(
        fetcher.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
          body: { isCompleted: true },
        }),
        {
          loading: 'Updating progress...',
          success: () => {
            if (!nextChapterId) {
              handleOpenConfetti();
            } else {
              router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
            }

            router.refresh();
            return 'Progress updated';
          },
          error: () => 'Something went wrong',
        },
      );
    }
  };

  return (
    <div className="relative aspect-w-16 aspect-h-9">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted gap-y-2 ">
          <BiLoaderAlt className="h-8 w-8 animate-spin text-secondary-foreground" />
          <p className="text-sm">Loading a video...</p>
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted gap-y-2 text-secondary-foreground">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && videoUrl && (
        <div className={cn(!isReady && 'hidden')}>
          <VideoPlayer
            autoPlay
            onEnded={handleEnd}
            onReady={() => setIsReady(true)}
            videoUrl={videoUrl}
          />
        </div>
      )}
    </div>
  );
};
