'use server';

import { db } from '@/lib/db';

export const getWelcomeDiscounts = async (userId: string) => {
  const hasPurchases = await db.purchase.count({ where: { userId } });

  if (hasPurchases > 0) {
    return [];
  }

  return [
    {
      coupon: process.env.STRIPE_COUPON_ID as string,
    },
  ];
};
