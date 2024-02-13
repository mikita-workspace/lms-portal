'use client';

import { Lock } from 'lucide-react';
import { useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';

import { VideoPlayer } from '@/components/common/video-player';
import { cn } from '@/lib/utils';

type PreviewVideoPlayerProps = { videoUrl?: string | null; isLocked?: boolean };

export const PreviewVideoPlayer = ({ videoUrl, isLocked = false }: PreviewVideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);

  return (
    <div className="relative aspect-video">
      {isReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted gap-y-2 border">
          <BiLoaderAlt className="h-8 w-8 animate-spin text-secondary-foreground" />
          <p className="text-sm">Loading a video...</p>
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted gap-y-2 text-secondary-foreground">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This preview is locked</p>
        </div>
      )}
      {!isLocked && videoUrl && (
        <div className={cn(!isReady && 'hidden')}>
          <VideoPlayer onReady={() => setIsReady(true)} videoUrl={videoUrl} />
        </div>
      )}
    </div>
  );
};
