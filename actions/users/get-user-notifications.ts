'use server';

import { Notification } from '@prisma/client';

import { db } from '@/lib/db';

export const getUserNotifications = async (userId?: string): Promise<Notification[]> => {
  if (!userId) {
    return [];
  }

  try {
    const userNotifications = await db.notification.findMany({ where: { userId } });

    return userNotifications;
  } catch (error) {
    console.error('[GET_USER_NOTIFICATION_ACTION]', error);

    return [];
  }
};
