'use server';

import { User } from '@prisma/client';

import { db } from '@/lib/db';

export const getUsers = async (): Promise<User[]> => {
  try {
    const users = await db.user.findMany({ orderBy: { createdAt: 'desc' } });

    return users;
  } catch (error) {
    console.error('[GET_USERS_ACTION]', error);

    return [];
  }
};
