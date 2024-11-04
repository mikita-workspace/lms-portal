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
  const isGoogleSlidesPlayer = videoUrl.includes('docs.google.com');
  const isVKPlayer = videoUrl.includes('vk.com');

  const url = new URL(videoUrl);

  if (isGoogleDrivePlayer || isGoogleSlidesPlayer || isVKPlayer) {
    if (autoPlay && !isGoogleDrivePlayer) {
      url.searchParams.append('autoplay', '1');
    }

    return (
      <iframe
        allow="autoplay screen-wake-lock=*"
        allowFullScreen
        className="border-0"
        height="100%"
        onEnded={onEnded}
        onLoad={onReady}
        src={url.toString()}
        width="100%"
      />
    );
  }

  return (
    <div className="border aspect-w-16 aspect-h-9">
      <ReactPlayer
        className="react-player"
        config={{ file: { attributes: { controlsList: 'nodownload' } } }}
        controls={showControls}
        height="100%"
        onEnded={onEnded}
        onReady={onReady}
        playing={autoPlay}
        url={url.toString()}
        width="100%"
      />
    </div>
  );
};
