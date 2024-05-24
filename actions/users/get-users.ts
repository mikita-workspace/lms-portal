'use server';

import { User } from '@prisma/client';

import { PAGE_SIZES } from '@/constants/paginations';
import { db } from '@/lib/db';

type GetUsers = {
  pageIndex?: string | number;
  pageSize?: string | number;
};

export const getUsers = async ({
  pageIndex = 0,
  pageSize = PAGE_SIZES[0],
}: GetUsers): Promise<{ pageCount: number; users: User[] }> => {
  const index = Number(pageIndex);
  const size = Number(pageSize);

  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      skip: index * size,
      take: size,
    });

    const count = await db.user.count();

    return { pageCount: Math.ceil(count / size), users };
  } catch (error) {
    console.error('[GET_USERS_ACTION]', error);

    return { pageCount: 0, users: [] };
  }
};
