'use client';

import toast from 'react-hot-toast';

import { ourFileRouter } from '@/app/api/uploadthing/core';
import { UploadDropzone } from '@/lib/uploadthing';

type FileUploadProps = {
  endpoint: keyof typeof ourFileRouter;
  onChange: (urls?: string[]) => void;
};

export const FileUpload = ({ endpoint, onChange }: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.map(({ url }) => url));
      }}
      onUploadError={(error: Error) => {
        toast.error(String(error?.message));
      }}
    />
  );
};
