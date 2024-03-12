'use client';

import { MoreHorizontal, XCircle } from 'lucide-react';
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
import { PayoutRequestStatus } from '@/constants/payments';

type ColumnActionsProps = {
  promoId: string;
};

export const ColumnActions = ({}: ColumnActionsProps) => {
  const router = useRouter();

  const [isFetching, setIsFetching] = useState(false);

  const isDisabledActions = [PayoutRequestStatus.PAID, PayoutRequestStatus.DECLINED].includes(
    status as PayoutRequestStatus,
  );

  const handleAction = () => async () => {
    try {
      setIsFetching(true);

      // await fetcher.post(`/api/payments/payout/${requestId}?action=${action}`, {
      //   responseType: 'json',
      // });

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
        <Button className="h-4 w-8 p-0" variant="ghost" disabled={isDisabledActions || isFetching}>
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
        <DropdownMenuItem className="hover:cursor-pointer text-red-500" onClick={handleAction}>
          <XCircle className="h-4 w-4  mr-2" />
          Deactivate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
