'use server';

import { addMilliseconds, compareAsc } from 'date-fns';

import { ONE_DAY_MS, TEN_MINUTE_SEC } from '@/constants/common';
import { fetchCachedData } from '@/lib/cache';
import { db } from '@/lib/db';

export const checkSubscription = async (userId = ''): Promise<boolean> => {
  const userSubscription = await fetchCachedData(
    `updated-user-subscription-[${userId}]`,
    async () => {
      const subscription = await db.stripeSubscription.findUnique({
        where: { id: userId },
      });

      return subscription;
    },
    TEN_MINUTE_SEC,
  );

  if (!userSubscription) {
    return false;
  }

  return (
    userSubscription.stripePriceId &&
    compareAsc(addMilliseconds(userSubscription.endDate, ONE_DAY_MS), Date.now()) > 0
  );
};
