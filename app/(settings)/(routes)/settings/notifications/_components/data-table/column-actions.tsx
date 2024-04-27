'use client';

import { CheckCheck, MoreHorizontal, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { BiLoaderAlt } from 'react-icons/bi';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import { fetcher } from '@/lib/fetcher';

type ColumnActionsProps = {
  id: string;
  isRead: boolean;
  userId: string;
};

export const ColumnActions = ({ id, isRead, userId }: ColumnActionsProps) => {
  const router = useRouter();

  const [isFetching, setIsFetching] = useState(false);

  const handleAction = (action: 'update' | 'remove') => async () => {
    try {
      setIsFetching(true);

      if (action === 'update') {
        await fetcher.patch(`/api/users/${userId}/notifications`, {
          body: {
            id,
            isRead: !isRead,
          },
        });
      }

      if (action === 'remove') {
        await fetcher.delete(`/api/users/${userId}/notifications?id=${id}`);
      }

      router.refresh();
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-4 w-8 p-0" variant="ghost" disabled={isFetching}>
          {isFetching && <BiLoaderAlt className="h-4 w-4 animate-spin" />}
          {!isFetching && (
            <>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="hover:cursor-pointer" onClick={handleAction('update')}>
          <CheckCheck className="h-4 w-4  mr-2" />
          {isRead ? 'Mark as unread' : 'Mark as read'}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:cursor-pointer text-red-500"
          onClick={handleAction('remove')}
        >
          <XCircle className="h-4 w-4  mr-2" />
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
