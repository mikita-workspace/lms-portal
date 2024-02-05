import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

import { getCurrentUser } from '@/actions/get-current-user';

const f = createUploadthing();

const handleAuth = async () => {
  const user = await getCurrentUser();

  if (!user) {
    throw new UploadThingError('Unauthorized');
  }

  return { userId: user.userId };
};

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  courseAttachment: f(['text', 'image', 'video', 'pdf'])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  chapterVideo: f({ video: { maxFileSize: '512MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
