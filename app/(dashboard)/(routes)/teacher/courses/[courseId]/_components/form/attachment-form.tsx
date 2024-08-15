'use client';

import { Attachment, Course } from '@prisma/client';
import { Paperclip } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import * as z from 'zod';

import { FileDownload } from '@/components/common/file-download';
import { FileUpload } from '@/components/common/file-upload';
import { Button } from '@/components/ui/button';
import { fetcher } from '@/lib/fetcher';

type AttachmentProps = {
  courseId: string;
  initialData: Course & { attachments: Attachment[] };
};

const formSchema = z.object({
  files: z.array(z.object({ url: z.string(), name: z.string() })),
});

export const AttachmentForm = ({ initialData, courseId }: AttachmentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const router = useRouter();

  const handleToggleEdit = () => setIsEditing((prev) => !prev);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await fetcher.post(`/api/courses/${courseId}/attachments`, { body: values });

      handleToggleEdit();

      toast.success('Course updated');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      setDeletingId(id);

      await fetcher.delete(`/api/courses/${courseId}/attachments/${id}?name=${name}`);

      toast.success('Attachment deleted');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border  bg-neutral-100 dark:bg-neutral-900 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Attachments
        <Button onClick={handleToggleEdit} variant="outline" size="sm">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <Paperclip className="h-4 w-4 mr-2" />
              Attach
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length > 0 ? (
            <div className="space-y-2 mt-4">
              {initialData.attachments.map((attachment) => (
                <FileDownload
                  key={attachment.id}
                  fileName={attachment.name}
                  isRemoveButtonDisabled={deletingId === attachment.id}
                  onFileRemove={() =>
                    handleDelete(attachment.id, attachment?.url?.split('/')?.pop() ?? '')
                  }
                  url={attachment.url}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm mt-2 text-neutral-500 italic">No attachments</p>
          )}
        </>
      )}
      {isEditing && (
        <div className="mt-4">
          <FileUpload
            endpoint="courseAttachments"
            onChange={(files) => {
              if (files?.length) {
                handleSubmit({ files });
              }
            }}
          />
          <div className="flex text-xs items-start justify-between">
            <div className="text-muted-foreground mt-4">
              Add anything your students might need to complete the course
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
