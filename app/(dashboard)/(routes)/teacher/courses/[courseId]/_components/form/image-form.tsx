'use client';

import { Course } from '@prisma/client';
import axios from 'axios';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import * as z from 'zod';

import { FileUpload } from '@/components/common/file-upload';
import { UploadThingIcon } from '@/components/common/uploadthing-icon';
import { Button } from '@/components/ui/button';

type ImageFormProps = {
  courseId: string;
  initialData: Course;
};

const formSchema = z.object({
  imageUrl: z.string().min(1),
});

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();

  const handleToggleEdit = () => setIsEditing((prev) => !prev);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);

      toast.success('Course updated');
      handleToggleEdit();

      router.refresh();
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  return (
    <div className="mt-6 border  bg-neutral-100 dark:bg-neutral-900 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Image
        <Button onClick={handleToggleEdit} variant="outline">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData?.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add
            </>
          )}
          {!isEditing && initialData?.imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData?.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-neutral-200 dark:bg-neutral-800 rounded-md mt-4">
            <ImageIcon className="h-10 w-10 text-neutral-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-4">
            <Image
              className="object-cover rounded-md"
              alt="Upload"
              fill
              src={initialData.imageUrl}
            />
          </div>
        ))}
      {isEditing && (
        <div className="mt-4">
          <FileUpload
            endpoint="courseImage"
            onChange={(urls) => {
              if (urls?.length) {
                handleSubmit({ imageUrl: urls[0] });
              }
            }}
          />
          <div className="flex text-xs items-end justify-between">
            <div className="text-muted-foreground mt-4">16:9 aspect ratio recommend</div>
            <UploadThingIcon />
          </div>
        </div>
      )}
    </div>
  );
};
