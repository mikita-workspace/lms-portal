'use server';

import groupBy from 'lodash.groupby';

import { CHAPTER_XP } from '@/constants/courses';
import { db } from '@/lib/db';
import { isOwner as isOwnerFunc } from '@/lib/owner';

import { getUserSubscription } from '../stripe/get-user-subscription';

export type Leader = {
  hasSubscription?: boolean;
  isOwner?: boolean;
  name: string;
  picture: string | null;
  userId: string;
  xp: number;
};

export const getLeaders = async () => {
  const userProgress = await db.userProgress.findMany();
  const publishedChapters = await db.chapter.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      course: {
        select: { isPublished: true },
      },
    },
  });

  const groupedByUser = groupBy(userProgress, 'userId');
  const userIds = Object.keys(groupedByUser);
  const publishedChapterIds = publishedChapters
    .filter(({ course }) => course.isPublished)
    .map(({ id }) => id);

  const users = await db.user.findMany({
    where: { id: { in: userIds }, isPublic: true },
    select: { id: true, name: true, pictureUrl: true },
  });

  const userSubscriptions = await Promise.all(
    users.map(async (user) => {
      const userSubscription = await getUserSubscription(user.id);
      const isOwner = isOwnerFunc(user.id);

      return {
        hasSubscription: isOwner ?? Boolean(userSubscription),
        isOwner,
        userId: user.id,
      };
    }),
  );

  return Object.entries(groupedByUser)
    .reduce<Leader[]>((acc, [userId, items]) => {
      const userInfo = users.find((user) => user.id === userId);

      if (userInfo) {
        const xp =
          items.filter((item) => publishedChapterIds.includes(item.chapterId)).length * CHAPTER_XP;

        const { hasSubscription, isOwner } =
          userSubscriptions.find((sb) => sb.userId === userId) ?? {};

        if (xp > 0) {
          acc.push({
            isOwner,
            hasSubscription,
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
