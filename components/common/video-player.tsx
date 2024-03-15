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

  const isGoogleDrivePlayer = videoUrl.includes('drive.google.com');

  if (isGoogleDrivePlayer) {
    return (
      <iframe
        allow={autoPlay ? 'autoplay' : ''}
        allowFullScreen
        height="100%"
        onEnded={onEnded}
        onLoad={onReady}
        src={videoUrl}
        width="100%"
      ></iframe>
    );
  }

  return (
    <div className="border aspect-w-16 aspect-h-9">
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
