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

export const NotificationCards = ({
  isFetching = false,
  notifications,
}: NotificationCardsProps) => {
  const { user } = useCurrentUser();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [notificationId, setNotificationId] = useState<string | null>(null);

  const handleMarkAsRead = async (id: string) => {
    try {
      setNotificationId(id);

      await fetcher.patch(`/api/users/${user?.userId}/notifications`, {
        body: {
          id,
          isRead: true,
        },
      });

      startTransition(() => router.refresh());
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setNotificationId(null);
    }
  };

  return (
    <>
      {notifications.map((un) => (
        <div
          key={un.id}
          className={cn(
            'border rounded-sm p-3 mb-2 flex flex-col',
            un.isRead ? 'text-muted-foreground' : '',
          )}
        >
          <p className="text-sm font-medium">{un.title}</p>
          <p className="text-xs">{un.body}</p>
          <div className="text-xs text-muted-foreground mt-2 flex justify-between items-center">
            <p>{formatDistanceToNow(un.createdAt, { addSuffix: true })}</p>
            {un.isRead && <CheckCheck className="h-4 w-4" />}
            {!un.isRead && (
              <>
                {(notificationId === un.id || pending) && (
                  <BiLoaderAlt className="h-4 w-4 animate-spin" />
                )}
                {notificationId !== un.id && !pending && (
                  <button
                    className="hover:underline"
                    onClick={() => handleMarkAsRead(un.id)}
                    disabled={Boolean(notificationId) || isFetching}
                  >
                    Mark as read
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </>
  );
};
