'use server';

import { User } from '@prisma/client';

import { db } from '@/lib/db';

type GetUsers = {
  page?: number;
  pageSize?: number;
};

export const getUsers = async ({ page = 0, pageSize = 10 }: GetUsers): Promise<User[]> => {
  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      skip: page * pageSize,
      take: pageSize,
    });

    return users;
  } catch (error) {
    console.error('[GET_USERS_ACTION]', error);

    return [];
  }
};
