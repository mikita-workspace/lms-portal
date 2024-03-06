'use client';

import { Banknote, MoreHorizontal, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import { PayoutRequestStatus } from '@/constants/payments';
import { fetcher } from '@/lib/fetcher';

type ColumnActionsProps = {
  requestId: string;
  status: string;
};

export const ColumnActions = ({ requestId, status }: ColumnActionsProps) => {
  const router = useRouter();

  const [isFetching, setIsFetching] = useState(false);

  const isDisabledActions = [PayoutRequestStatus.PAID, PayoutRequestStatus.DECLINED].includes(
    status as PayoutRequestStatus,
  );

  const handleAction = (action: string) => async () => {
    try {
      setIsFetching(true);

      await fetcher.post(`/api/payments/payout/${requestId}?action=${action}`, {
        responseType: 'json',
      });

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
        <Button className="h-4 w-8 p-0" variant="ghost" disabled={isFetching || isDisabledActions}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={handleAction(PayoutRequestStatus.PAID)}
        >
          <Banknote className="h-4 w-4  mr-2" />
          Pay out
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:cursor-pointer text-red-500"
          onClick={handleAction(PayoutRequestStatus.DECLINED)}
        >
          <XCircle className="h-4 w-4  mr-2" />
          Decline
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
