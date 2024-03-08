'use client';

import { Notification } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { CheckCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import { BiLoaderAlt } from 'react-icons/bi';

import { useCurrentUser } from '@/hooks/use-current-user';
import { fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';

type NotificationCardsProps = {
  isFetching?: boolean;
  notifications: Omit<Notification, 'userId'>[];
};

type NotificationCardProps = Omit<NotificationCardsProps, 'notifications'> & {
  notification: Omit<Notification, 'userId'>;
  userId?: string;
};

const NotificationCard = ({ isFetching = false, notification, userId }: NotificationCardProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [isLoading, setIsLoading] = useState(false);

  const handleMarkAsRead = async (id: string) => {
    try {
      setIsLoading(true);

      await fetcher.patch(`/api/users/${userId}/notifications`, {
        body: {
          id,
          isRead: true,
        },
      });

      startTransition(() => router.refresh());
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        'border rounded-sm p-3 mb-2 flex flex-col',
        notification.isRead ? 'text-muted-foreground' : '',
      )}
    >
      <p className="text-sm font-medium">{notification.title}</p>
      <p className="text-xs">{notification.body}</p>
      <div className="text-xs text-muted-foreground mt-2 flex justify-between items-center">
        <p>{formatDistanceToNow(notification.createdAt, { addSuffix: true })}</p>
        {notification.isRead && <CheckCheck className="h-4 w-4" />}
        {!notification.isRead && (
          <>
            {(isLoading || pending) && <BiLoaderAlt className="h-4 w-4 animate-spin" />}
            {!isLoading && !pending && (
              <button
                className="hover:underline"
                onClick={() => handleMarkAsRead(notification.id)}
                disabled={isLoading || isFetching}
              >
                Mark as read
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export const NotificationCards = ({
  isFetching = false,
  notifications,
}: NotificationCardsProps) => {
  const { user } = useCurrentUser();

  return (
    <>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          isFetching={isFetching}
          notification={notification}
          userId={user?.userId}
        />
      ))}
    </>
  );
};
