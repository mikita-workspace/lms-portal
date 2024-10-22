'use server';

import { utapi } from '@/server/uploadthing';

export const getFiles = async (fileIds: string[]) => {
  const files = await utapi.getFileUrls(fileIds);

  return files.data;
};
