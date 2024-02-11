'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

type VideoPlayerProps = {
  autoPlay?: boolean;
  onEnded?: () => void;
  onReady?: () => void;
  showControls?: boolean;
  videoUrl: string;
};

export const VideoPlayer = ({
  autoPlay = false,
  onEnded,
  onReady,
  showControls = true,
  videoUrl,
}: VideoPlayerProps) => {
  const ReactPlayer = useMemo(() => dynamic(() => import('react-player/lazy'), { ssr: false }), []);

  return (
    <div className="border aspect-video">
      <ReactPlayer
        controls={showControls}
        height="100%"
        onEnded={onEnded}
        onReady={onReady}
        playing={autoPlay}
        url={videoUrl}
        width="100%"
      />
    </div>
  );
};
