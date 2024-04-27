import { getUserNotifications } from '@/actions/users/get-user-notifications';

type UserNotification = Awaited<ReturnType<typeof getUserNotifications>>[number];

export const getNotificationActionName = (
  notifications: UserNotification[],
): { action: 'read' | 'unread'; ids: { id: string; userId: string }[] } => {
  return {
    action: notifications.some((nt) => !nt.isRead) ? 'read' : 'unread',
    ids: notifications.map((nt) => ({
      id: nt.id,
      userId: nt.userId,
    })),
  };
};
