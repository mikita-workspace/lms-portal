'use client';

import { Notification } from '@prisma/client';
import { useState } from 'react';
import { TbBellRinging2Filled } from 'react-icons/tb';

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
  userNotifications: Notification[];
};

export const Notifications = ({ userNotifications }: NotificationsProps) => {
  const [open, setOpen] = useState(false);

  const amountOfNotifications = userNotifications.length;

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
          {Boolean(amountOfNotifications) && (
            <div className="absolute w-[14px] h-[14px] rounded-full bg-red-500 top-2 right-1 flex items-center justify-center truncate">
              <span className="text-white font-semibold text-[8px]">{amountOfNotifications}</span>
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-screen md:w-[340px] md:mr-16 mt-1">
        <div className="flex justify-between items-center px-2 pt-4">
          <p className="font-semibold text-sm">Notifications</p>
          <div className="text-xs text-muted-foreground flex gap-2 items-center">
            <span>Show only unread</span>
            <Switch />
          </div>
        </div>
        <DropdownMenuSeparator className="-mx-1 my-4 h-px bg-muted" />
        <ScrollArea
          className={cn(
            'px-2 pb-2 h-72 w-full',
            !amountOfNotifications ? 'text-center align-middle' : '',
          )}
        >
          {userNotifications.map((un) => (
            <div key={un.id} className="border rounded-sm p-3 mb-2 flex flex-col">
              <p className="text-sm font-medium">{un.title}</p>
              <p className="text-xs">{un.body}</p>
            </div>
          ))}
          {!amountOfNotifications && (
            <p className="text-sm font-medium mt-32">There are no notifications</p>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// There are no unread notifications
