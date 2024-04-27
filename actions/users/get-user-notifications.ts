'use server';

import { Notification } from '@prisma/client';

import { db } from '@/lib/db';

export const getUserNotifications = async (
  userId?: string,
  take?: number,
): Promise<Notification[]> => {
  if (!userId) {
    return [];
  }

  try {
    const userNotifications = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        body: true,
        createdAt: true,
        id: true,
        isRead: true,
        title: true,
        updatedAt: true,
        userId: true,
      },
      take,
    });

    return userNotifications;
  } catch (error) {
    console.error('[GET_USER_NOTIFICATION_ACTION]', error);

    return [];
  }
};
