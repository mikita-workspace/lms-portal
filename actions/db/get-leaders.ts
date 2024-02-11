'use server';

import { db } from '@/lib/db';
import { groupBy } from '@/lib/utils';

const CHAPTER_XP = 20;

type Leaders = {
  name: string;
  picture: string | null;
  role: string;
  userId: string;
  xp: number;
};

export const getLeaders = async () => {
  const userProgress = await db.userProgress.findMany();

  if (!userProgress) {
    return [];
  }

  const groupedByUser = groupBy(userProgress, (item) => item.userId);
  const userIds = Object.keys(groupedByUser);

  const users = await db.user.findMany({ where: { id: { in: userIds } } });

  return Object.entries(groupedByUser)
    .reduce<Leaders[]>((acc, [userId, items]) => {
      const userInfo = users.find((user) => user.id === userId);

      if (userInfo) {
        const xp = items.length * CHAPTER_XP;

        if (xp > 0) {
          acc.push({
            name: userInfo.name || '',
            picture: userInfo.pictureUrl,
            role: userInfo.role,
            userId,
            xp,
          });
        }
      }

      return acc;
    }, [])
    .sort((a, b) => b.xp - a.xp);
};
