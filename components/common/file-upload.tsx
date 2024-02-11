'use client';

import toast from 'react-hot-toast';

import { ourFileRouter } from '@/app/api/uploadthing/core';
import { UploadDropzone } from '@/lib/uploadthing';

type FileUploadProps = {
  endpoint: keyof typeof ourFileRouter;
  onBegin?: () => void;
  onChange: (files: { url: string; name: string }[]) => void;
};

export const FileUpload = ({ endpoint, onBegin, onChange }: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onUploadBegin={onBegin}
      onClientUploadComplete={(res) => {
        onChange(res?.map(({ url, name }) => ({ url, name })));
      }}
      onUploadError={(error: Error) => {
        toast.error(String(error?.message));
      }}
    />
  );
};
