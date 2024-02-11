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

  const modules = {
    toolbar: [
      [{ font: [] }, { header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
      ['link'],
    ],
  };

  return (
    <div className="bg-white">
      <ReactQuill
        className="dark:bg-neutral-900 text-primary"
        modules={modules}
        onChange={onChange}
        theme="snow"
        value={value}
      />
    </div>
  );
};
