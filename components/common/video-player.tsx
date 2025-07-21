'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import { useVideoStore } from '@/hooks/store/use-video-store';
import { isNumber } from '@/lib/guard';

type VideoPlayerProps = {
  autoPlay?: boolean;
  id?: string;
  onEnded?: () => void;
  onReady?: () => void;
  showControls?: boolean;
  videoUrl: string;
};

export const VideoPlayer = ({
  autoPlay = false,
  id,
  onEnded,
  onReady,
  showControls = true,
  videoUrl,
}: VideoPlayerProps) => {
  const ReactPlayer = useMemo(() => dynamic(() => import('react-player/lazy'), { ssr: false }), []);

  const { setVideo } = useVideoStore((state) => ({ setVideo: state.setVideo }));

  const isGoogleDrivePlayer = videoUrl.includes('drive.google.com');
  const isGoogleSlidesPlayer = videoUrl.includes('docs.google.com');
  const isVKPlayer = videoUrl.includes('vk.com');

  const url = new URL(videoUrl);

  const handleSetDuration = (duration: unknown) => {
    if (isNumber(duration) && duration > 0 && id) {
      setVideo({ id: `${id}-${videoUrl}`, duration: Math.ceil(duration) });
    }
  };

  const commonProps = {
    height: '100%',
    onEnded,
    width: '100%',
  };

  if (isGoogleDrivePlayer || isGoogleSlidesPlayer || isVKPlayer) {
    if (autoPlay && !isGoogleDrivePlayer) {
      url.searchParams.append('autoplay', '1');
    }

    return (
      <iframe
        {...commonProps}
        allow="autoplay screen-wake-lock=*"
        allowFullScreen
        className="border-0"
        onDurationChange={handleSetDuration}
        onLoad={onReady}
        src={url.toString()}
      />
    );
  }

  return (
    <div className="border aspect-w-16 aspect-h-9">
      <ReactPlayer
        {...commonProps}
        className="react-player"
        config={{ file: { attributes: { controlsList: 'nodownload' } } }}
        controls={showControls}
        onReady={onReady}
        playing={autoPlay}
        url={url.toString()}
        onDuration={handleSetDuration}
      />
    </div>
  );
};
