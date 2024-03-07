'use client';

import { Notification } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { CheckCheck, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import { BiLoaderAlt } from 'react-icons/bi';
import { TbBellRinging2Filled } from 'react-icons/tb';

import { useCurrentUser } from '@/hooks/use-current-user';
import { fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ScrollArea,
  Switch,
} from '../ui';

type NotificationsProps = {
  userNotifications?: Omit<Notification, 'userId'>[];
};

export const Notifications = ({ userNotifications = [] }: NotificationsProps) => {
  const { user } = useCurrentUser();
  const router = useRouter();

  const [isFetching, startTransition] = useTransition();

  const [unreadNotifications, setUnreadNotifications] = useState<typeof userNotifications>([]);

  const [open, setOpen] = useState(false);
  const [isSwitched, setIsSwitched] = useState(false);
  const [notificationId, setNotificationId] = useState<string | null>(null);

  const amountOfNotifications = userNotifications.length;
  const amountOfUnreadNotifications = userNotifications.filter((un) => !un.isRead)?.length;

  const handleSwitchFilter = (checked: boolean) => {
    setIsSwitched(checked);

    const filteredNotifications = userNotifications.filter((nt) => (checked ? !nt.isRead : false));

    setUnreadNotifications(filteredNotifications);
  };

  const handleFetchNotifications = () =>
    startTransition(() => {
      setIsSwitched(false);
      router.refresh();
    });

  const handleMarkAsRead = async (id: string) => {
    try {
      setNotificationId(id);

      await fetcher.patch(`/api/users/${user?.userId}/notifications`, {
        body: {
          id,
          isRead: true,
        },
      });

      if (isSwitched) {
        setUnreadNotifications((prev) => prev.filter((nt) => nt.id !== id));
      }

      router.refresh();
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setNotificationId(null);
    }
  };

  const notifications = isSwitched ? unreadNotifications : userNotifications;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild className="relative block hover:cursor-pointer">
        <div
          className={cn(
            'relative rounded-full w-[40px] h-[40px] flex items-center justify-center transition-background ease-in-out duration-300',
            open ? 'bg-muted ' : 'hover:bg-muted ',
          )}
        >
          <TbBellRinging2Filled className="h-5 w-5" />
          {Boolean(amountOfUnreadNotifications) && (
            <div className="absolute w-[14px] h-[14px] rounded-full bg-red-500 top-2 right-1 flex items-center justify-center truncate">
              <span className="text-white font-semibold text-[8px]">
                {amountOfUnreadNotifications}
              </span>
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[340px] sm:mr-16 mr-4 mt-1">
        <div className="flex justify-between items-center px-2 pt-4">
          <p className="font-semibold text-sm">Notifications</p>
          <div className="flex items-center gap-4">
            <div className="text-xs text-muted-foreground flex gap-2 items-center">
              <span>Show only unread</span>
              <Switch
                aria-readonly
                disabled={isFetching}
                checked={isSwitched}
                onCheckedChange={handleSwitchFilter}
              />
            </div>
            <button onClick={handleFetchNotifications} disabled={isFetching}>
              <RefreshCcw className={cn('w-4 h-4', isFetching ? 'animate-spin' : '')} />
            </button>
          </div>
        </div>
        <DropdownMenuSeparator className="-mx-1 my-4 h-px bg-muted" />
        <ScrollArea
          className={cn(
            'px-2 pb-2 h-72 w-full',
            !amountOfNotifications || (!unreadNotifications.length && isSwitched)
              ? 'text-center align-middle'
              : '',
          )}
        >
          {notifications.map((un) => (
            <div
              key={un.id}
              className={cn(
                'border rounded-sm p-3 mb-2 flex flex-col',
                notifications.length > 1 ? 'mr-1' : 'mr-auto',
              )}
            >
              <p className="text-sm font-medium">{un.title}</p>
              <p className="text-xs">{un.body}</p>
              <div className="text-xs text-muted-foreground mt-2 flex justify-between items-center">
                <p>{formatDistanceToNow(un.createdAt, { addSuffix: true })}</p>
                {un.isRead && <CheckCheck className="h-4 w-4" />}
                {!un.isRead && (
                  <>
                    {notificationId === un.id && <BiLoaderAlt className="h-4 w-4 animate-spin" />}
                    {notificationId !== un.id && (
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
          {!amountOfNotifications && (
            <p className="text-sm font-medium mt-32">There are no notifications</p>
          )}
          {!unreadNotifications.length && isSwitched && (
            <p className="text-sm font-medium mt-32">There are no unread notifications</p>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
