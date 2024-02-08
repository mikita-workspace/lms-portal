'use client';

import MuxPlayer from '@mux/mux-player-react';
import { Chapter, MuxData } from '@prisma/client';
import axios from 'axios';
import { Pencil, PlusCircle, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import * as z from 'zod';

import { FileUpload } from '@/components/common/file-upload';
import { UploadThingIcon } from '@/components/common/uploadthing-icon';
import { Button } from '@/components/ui/button';

type ChapterVideoFormProps = {
  chapterId: string;
  courseId: string;
  initialData: Chapter & { muxData?: MuxData | null };
};

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export const ChapterVideoForm = ({ initialData, chapterId, courseId }: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();

  const handleToggleEdit = () => setIsEditing((prev) => !prev);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);

      toast.success('Chapter updated');
      handleToggleEdit();

      router.refresh();
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };

  return (
    <div className="mt-6 border  bg-neutral-100 dark:bg-neutral-900 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Video
        <Button onClick={handleToggleEdit} variant="outline">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData?.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add
            </>
          )}
          {!isEditing && initialData?.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData?.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-neutral-200 dark:bg-neutral-800 rounded-md mt-4">
            <Video className="h-10 w-10 text-neutral-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-4">
            <MuxPlayer
              className="w-full h-[270px]"
              playbackId={initialData?.muxData?.playbackId || ''}
            />
          </div>
        ))}
      {isEditing && (
        <div className="mt-4">
          <FileUpload
            endpoint="chapterVideo"
            onChange={(urls) => {
              if (urls?.length) {
                handleSubmit({ videoUrl: urls[0] });
              }
            }}
          />
          <div className="flex text-xs items-end justify-between">
            <div className="text-muted-foreground mt-4">Upload this chapter&apos;s video</div>
            <UploadThingIcon />
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Video processing may take several minutes. Refresh the page if the video is not displayed.
        </div>
      )}
    </div>
  );
};
