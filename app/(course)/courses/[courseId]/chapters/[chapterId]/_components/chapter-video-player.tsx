'use client';

import { Loader2, Lock } from 'lucide-react';
import { useState } from 'react';

import { VideoPlayer } from '@/components/common/video-player';
import { cn } from '@/lib/utils';

type ChapterVideoPlayerProps = {
  chapterId: string;
  completeOnEnd: boolean;
  courseId: string;
  isLocked: boolean;
  nextChapterId?: string;
  title: string;
  videoUrl?: string | null;
};

export const ChapterVideoPlayer = ({
  chapterId,
  completeOnEnd,
  courseId,
  isLocked,
  nextChapterId,
  title,
  videoUrl,
}: ChapterVideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted gap-y-2 ">
          <Loader2 className="h-8 w-8 animate-spin text-secondary-foreground" />
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
            onEnded={() => {}}
            onReady={() => setIsReady(true)}
            videoUrl={videoUrl}
          />
        </div>
      )}
    </div>
  );
};
