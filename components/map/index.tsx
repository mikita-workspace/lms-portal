'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./dynamic-map'), {
  ssr: false,
});

export default Map;
