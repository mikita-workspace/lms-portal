'use client';

import { CheckCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui';
import { fetcher } from '@/lib/fetcher';
import { getNotificationActionName } from '@/lib/notifications';

type MarkAllButtonProps = {
  action: ReturnType<typeof getNotificationActionName>['action'];
  amount: number;
  ids: ReturnType<typeof getNotificationActionName>['ids'];
  reset?: () => void;
};

export const MarkAllButton = ({ action, amount, ids, reset }: MarkAllButtonProps) => {
  const router = useRouter();

  const [isFetching, setIsFetching] = useState(false);

  const handleAction = async () => {
    try {
      setIsFetching(true);

      await fetcher.patch(`/api/users/${ids[0].userId}/notifications?all=true`, {
        body: {
          ids,
          isRead: action === 'read',
        },
      });

      router.refresh();
      reset?.();
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Button disabled={isFetching} isLoading={isFetching} onClick={handleAction}>
      {!isFetching && <CheckCheck className="h-4 w-4 mr-2" />}
      Mark {amount} selected as {action}
    </Button>
  );
};
