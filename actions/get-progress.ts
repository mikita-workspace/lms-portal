'use server';

import { db } from '@/lib/db';

type GetProgress = { userId: string; courseId: string };

export const getProgress = async ({ userId, courseId }: GetProgress) => {
  const publishedChapters = await db.chapter.findMany({
    where: { courseId, isPublished: true },
    select: { id: true },
  });

  const publishedChapterIds = publishedChapters.map(({ id }) => id);

  const validCompletedChapters = await db.userProgress.count({
    where: { userId, chapterId: { in: publishedChapterIds }, isCompleted: true },
  });

  const progressPercentage = (validCompletedChapters / publishedChapterIds.length) * 100;

  return progressPercentage;
};
