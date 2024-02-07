'use client';

import 'react-quill/dist/quill.snow.css';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

type EditorProps = {
  onChange: (value: string) => void;
  value: string;
};

export const Editor = ({ onChange, value }: EditorProps) => {
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);

  return (
    <div className="bg-white">
      <ReactQuill
        className="dark:bg-neutral-400 text-primary"
        theme="snow"
        onChange={onChange}
        value={value}
      />
    </div>
  );
};
