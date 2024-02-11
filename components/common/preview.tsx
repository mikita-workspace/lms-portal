'use client';

import 'react-quill/dist/quill.bubble.css';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

type PreviewProps = {
  value: string;
};

export const Preview = ({ value }: PreviewProps) => {
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);

  return (
    <div className="bg-white">
      <ReactQuill
        className="dark:bg-neutral-950 text-primary"
        theme="bubble"
        value={value}
        readOnly
      />
    </div>
  );
};
