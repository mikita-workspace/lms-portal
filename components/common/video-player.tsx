'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

type VideoPlayerProps = {
  height?: string;
  showControls?: boolean;
  videoUrl: string;
};

export const VideoPlayer = ({
  height = '100%',
  showControls = true,
  videoUrl,
}: VideoPlayerProps) => {
  const ReactPlayer = useMemo(() => dynamic(() => import('react-player/lazy'), { ssr: false }), []);

  return (
    <div className="border">
      <ReactPlayer width="100%" height={height} controls={showControls} url={videoUrl} />
    </div>
  );
};
