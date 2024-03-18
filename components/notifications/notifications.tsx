'use client';

import { Notification } from '@prisma/client';
import { Inbox, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Pusher from 'pusher-js';
import { useEffect, useState, useTransition } from 'react';

import { useCurrentUser } from '@/hooks/use-current-user';
import { cn } from '@/lib/utils';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../ui';
import { NotificationCards } from './notification-cards';

if (process.env.NODE_ENV === 'development') {
  Pusher.logToConsole = true;
}

type NotificationsProps = {
  userNotifications?: Omit<Notification, 'userId'>[];
};

export const Notifications = ({ userNotifications = [] }: NotificationsProps) => {
  const { user } = useCurrentUser();

  const router = useRouter();
  const [isFetching, startTransition] = useTransition();

  const [open, setOpen] = useState(false);

  const unreadNotifications = userNotifications.filter((un) => !un.isRead);

  const amountOfNotifications = userNotifications.length;
  const amountOfUnreadNotifications = unreadNotifications.length;

  const handleFetchNotifications = () => startTransition(() => router.refresh());

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY as string, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    });

    const channelName = `notification_channel_${user?.userId}`;

    const channel = pusher.subscribe(channelName);
    channel.bind(`private_event_${user?.userId}`, function (data: { trigger: boolean }) {
      const trigger = data?.trigger;

      if (trigger) {
        router.refresh();
      }
    });

    return () => {
      pusher.unsubscribe(channelName);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild className="relative block hover:cursor-pointer">
        <div
          className={cn(
            'relative rounded-full w-[40px] h-[40px] flex items-center justify-center transition-background ease-in-out duration-300',
            open ? 'bg-muted ' : 'hover:bg-muted ',
          )}
        >
          <Inbox className="h-5 w-5" />
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
          <p className="font-semibold text-sm">Recent Notifications</p>
          <div className="flex items-center gap-4">
            <button onClick={handleFetchNotifications} disabled={isFetching}>
              <RefreshCcw className={cn('w-4 h-4', isFetching ? 'animate-spin' : '')} />
            </button>
          </div>
        </div>
        <div className="px-2 py-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger className="w-full" value="all">
                All
              </TabsTrigger>
              <TabsTrigger className="w-full" value="unread">
                Unread
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="w-[340px] ml-[-1em] pt-2">
              <ScrollArea className={cn('pl-4 pr-2.5 h-72 w-full')}>
                <NotificationCards notifications={userNotifications} isFetching={isFetching} />
                {!amountOfNotifications && (
                  <p className="text-sm font-medium mt-32 text-center text-muted-foreground">
                    There are no notifications
                  </p>
                )}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="unread" className="w-[340px] ml-[-1em] pt-2">
              <ScrollArea className={cn('pl-4 pr-2.5 h-72 w-full')}>
                <NotificationCards notifications={unreadNotifications} isFetching={isFetching} />
                {!unreadNotifications.length && (
                  <p className="text-sm font-medium mt-32 text-center text-muted-foreground">
                    There are no unread notifications
                  </p>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
