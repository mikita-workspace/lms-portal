'use server';

import { StripeSubscription, User } from '@prisma/client';

import { PAGE_SIZES } from '@/constants/paginations';
import { db } from '@/lib/db';

type GetUsers = {
  pageIndex?: string | number;
  pageSize?: string | number;
  search?: string;
};

type UserWithSubscription = User & { stripeSubscription: StripeSubscription | null };

export const getUsers = async ({
  pageIndex = 0,
  pageSize = PAGE_SIZES[0],
  search,
}: GetUsers): Promise<{ pageCount: number; users: UserWithSubscription[] }> => {
  const index = Number(pageIndex);
  const size = Number(pageSize);

  try {
    const users = await db.user.findMany({
      where: { email: { contains: search, mode: 'insensitive' } },
      include: { stripeSubscription: true },
      orderBy: { createdAt: 'desc' },
      skip: index * size,
      take: size,
    });

    const count = await db.user.count({
      where: { email: { contains: search, mode: 'insensitive' } },
    });

    return { pageCount: Math.ceil(count / size), users };
  } catch (error) {
    console.error('[GET_USERS_ACTION]', error);

    return { pageCount: 0, users: [] };
  }
};
