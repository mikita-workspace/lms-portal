'use server';

import { utapi } from '@/server/uploadthing';

export const deleteFiles = async (fileIds: string[]) => {
  const deletedFiles = await utapi.deleteFiles(fileIds.filter((file) => file.includes('utfs.io')));

  return deletedFiles;
};
