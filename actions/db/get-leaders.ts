'use server';

import groupBy from 'lodash.groupby';

import { CHAPTER_XP } from '@/constants/common';
import { db } from '@/lib/db';

type Leaders = {
  name: string;
  picture: string | null;
  userId: string;
  xp: number;
};

export const getLeaders = async () => {
  const userProgress = await db.userProgress.findMany();
  const publishedChapters = await db.chapter.findMany({
    where: { isPublished: true },
    select: { id: true },
  });

  const groupedByUser = groupBy(userProgress, 'userId');
  const userIds = Object.keys(groupedByUser);
  const publishedChapterIds = publishedChapters.map(({ id }) => id);

  const users = await db.user.findMany({ where: { id: { in: userIds }, isPublic: true } });

  return Object.entries(groupedByUser)
    .reduce<Leaders[]>((acc, [userId, items]) => {
      const userInfo = users.find((user) => user.id === userId);

      if (userInfo) {
        const xp =
          items.filter((item) => publishedChapterIds.includes(item.chapterId)).length * CHAPTER_XP;

        if (xp > 0) {
          acc.push({
            name: userInfo.name || '',
            picture: userInfo.pictureUrl,
            userId,
            xp,
          });
        }
      }

      return acc;
    }, [])
    .sort((a, b) => b.xp - a.xp);
};
