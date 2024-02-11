'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';

import { VideoPlayer } from '@/components/common/video-player';
import { cn } from '@/lib/utils';

type PreviewVideoPlayerProps = { videoUrl?: string | null };

export const PreviewVideoPlayer = ({ videoUrl }: PreviewVideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);

  return (
    <div className="relative aspect-video">
      {!isReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted gap-y-2 border">
          <Loader2 className="h-8 w-8 animate-spin text-secondary-foreground" />
          <p className="text-sm">Loading a video...</p>
        </div>
      )}
      {videoUrl && (
        <div className={cn(!isReady && 'hidden')}>
          <VideoPlayer onReady={() => setIsReady(true)} videoUrl={videoUrl} />
        </div>
      )}
    </div>
  );
};
