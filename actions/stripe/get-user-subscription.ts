'use server';

import { db } from '@/lib/db';

export const getUserSubscription = async (userId = '') => {
  const userSubscription = await db.stripeSubscription.findUnique({
    where: { userId },
  });

  if (!userSubscription) {
    return null;
  }

  return userSubscription;
};
