'use server';

import { UTFile } from 'uploadthing/server';

import { base64ToBlob } from '@/lib/utils';
import { utapi } from '@/server/uploadthing';

export const uploadFiles = async (
  files: { name: string; contentType: string; base64: string }[],
) => {
  const UTFiles = files.map(({ name, contentType, base64 }) => {
    const file = new UTFile([base64ToBlob(base64, contentType)], name);

    return file;
  });

  const response = await utapi.uploadFiles(UTFiles);

  return response;
};
