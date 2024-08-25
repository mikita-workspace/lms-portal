'use client';

import { ourFileRouter } from '@/app/api/uploadthing/core';
import { useToast } from '@/components/ui/use-toast';
import { UploadDropzone } from '@/lib/uploadthing';

type FileUploadProps = {
  endpoint: keyof typeof ourFileRouter;
  onBegin?: () => void;
  onChange: (files: { url: string; name: string }[]) => void;
};

export const FileUpload = ({ endpoint, onBegin, onChange }: FileUploadProps) => {
  const { toast } = useToast();

  return (
    <UploadDropzone
      endpoint={endpoint}
      onUploadBegin={onBegin}
      onClientUploadComplete={(res) => {
        onChange(res?.map(({ url, name }) => ({ url, name })));
      }}
      onUploadError={(error: Error) => {
        toast({ title: String(error?.message) });
      }}
    />
  );
};
