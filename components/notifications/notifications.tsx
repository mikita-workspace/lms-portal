'use client';

import { Notification } from '@prisma/client';
import { Inbox, RefreshCcw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Pusher from 'pusher-js';
import { useEffect, useState, useTransition } from 'react';

import { useCurrentUser } from '@/hooks/use-current-user';
import { cn } from '@/lib/utils';

import {
  Button,
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
  const t = useTranslations('notifications');

  const { user } = useCurrentUser();

  const router = useRouter();
  const [isFetching, startTransition] = useTransition();

  const [open, setOpen] = useState(false);

  const unreadNotifications = userNotifications.filter((un) => !un.isRead);
  const amountOfNotifications = userNotifications.length;

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

  const handleFetchNotifications = () => startTransition(() => router.refresh());

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
          {Boolean(unreadNotifications.length) && (
            <div className="absolute w-[10px] h-[10px] rounded-full bg-red-500 top-2 right-2 flex items-center justify-center truncate"></div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[340px] sm:mr-16 mr-4 mt-1">
        <div className="flex justify-between items-center px-2 pt-4">
          <p className="font-semibold text-sm">{t('title')}</p>
          <div className="flex items-center gap-4">
            <button onClick={handleFetchNotifications} disabled={isFetching}>
              <RefreshCcw className={cn('w-4 h-4', isFetching ? 'animate-spin' : '')} />
            </button>
          </div>
        </div>
        <div className="px-2 pt-4">
          <Tabs defaultValue="unread" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger className="w-full" value="unread">
                {t('unread')}
              </TabsTrigger>
              <TabsTrigger className="w-full" value="all">
                {t('all')}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="w-[340px] ml-[-1em] pt-2">
              <ScrollArea className="pl-4 pr-2.5 w-full max-h-[200px] overflow-auto">
                <NotificationCards notifications={userNotifications} isFetching={isFetching} />
                {!amountOfNotifications && (
                  <div className="my-16 text-center flex flex-col gap-2">
                    <p className="text-sm font-semibold">{t('upToDate')}</p>
                    <p className="text-sm text-muted-foreground">{t('notFound')}</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="unread" className="w-[340px] ml-[-1em] pt-2">
              <ScrollArea className="pl-4 pr-2.5 w-full max-h-[200px] overflow-auto">
                <NotificationCards notifications={unreadNotifications} isFetching={isFetching} />
                {!unreadNotifications.length && (
                  <div className="my-16 text-center flex flex-col gap-2">
                    <p className="text-sm font-semibold">{t('upToDate')}</p>
                    <p className="text-sm text-muted-foreground">{t('notFoundAtTheMoment')}</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
          <div className="flex justify-center items-center border-t py-2 font-semibold">
            <Link href="/settings/notifications">
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                {t('viewAll')}
              </Button>
            </Link>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
