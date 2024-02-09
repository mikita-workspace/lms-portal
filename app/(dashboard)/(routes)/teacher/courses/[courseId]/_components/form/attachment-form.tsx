'use client';

import { Attachment, Course } from '@prisma/client';
import axios from 'axios';
import { File, Loader2, Paperclip, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import * as z from 'zod';

import { FileUpload } from '@/components/common/file-upload';
import { UploadThingIcon } from '@/components/common/uploadthing-icon';
import { Button } from '@/components/ui/button';

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
      await axios.post(`/api/courses/${courseId}/attachments`, values);

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

      await axios.delete(`/api/courses/${courseId}/attachments/${id}?name=${name}`);

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
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full rounded-md bg-blue-500/15 border border-blue-500/20 text-blue-700 dark:text-blue-400"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <Link
                    className="text-sm line-clamp-1 basis-4/5 hover:underline"
                    href={attachment.url}
                    target="_blank"
                  >
                    {attachment.name}
                  </Link>
                  <div className="ml-auto flex items-center">
                    {deletingId === attachment.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <button
                        className="hover:opacity-75 transition-all duration-300"
                        onClick={() =>
                          handleDelete(attachment.id, attachment?.url?.split('/')?.pop() ?? '')
                        }
                        disabled={Boolean(deletingId)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
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
            <div className="text-muted-foreground mt-4 basis-3/5">
              Add anything your students might need to complete the course
            </div>
            <UploadThingIcon />
          </div>
        </div>
      )}
    </div>
  );
};
