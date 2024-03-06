'use client';

import { Column, ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';

import { getStripeDetails } from '@/actions/stripe/get-stripe-details';
import { TextBadge } from '@/components/common/text-badge';
import { PriceColumn } from '@/components/data-table/columns/price-column';
import { Button } from '@/components/ui';
import { TIMESTAMP_TEMPLATE } from '@/constants/common';
import { DEFAULT_LOCALE } from '@/constants/locale';
import { PayoutRequestStatus } from '@/constants/payments';
import { capitalize } from '@/lib/utils';

import { ColumnActions } from './column-actions';

type PayoutRequests = Awaited<ReturnType<typeof getStripeDetails>>['payoutRequests'][number];

const handleSortingHeader = <T extends Column<PayoutRequests, unknown>>(
  column: T,
  label: string,
) => {
  return (
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

export const columns: ColumnDef<PayoutRequests>[] = [
  {
    id: 'teacher',
    header: () => <span>Teacher</span>,
    cell: ({ row }) => {
      const { teacher } = row.original;

      return (
        <div className="flex flex-col text-sm">
          <p className="font-medium">{teacher.name}</p>
          <p>{teacher.email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => handleSortingHeader(column, 'Requested amount'),
    cell: ({ row }) => {
      const { amount, currency } = row.original;
      const locale = {
        locale: DEFAULT_LOCALE,
        currency,
      };

      return <PriceColumn amount={amount} locale={locale} />;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => handleSortingHeader(column, 'Status'),
    cell: ({ row }) => {
      const { status } = row.original;

      const variant = (() => {
        if (status === PayoutRequestStatus.PAID) {
          return 'green';
        }

        if (status === PayoutRequestStatus.DECLINED) {
          return 'red';
        }

        return 'default';
      })();

      return <TextBadge label={capitalize(status)} variant={variant} />;
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => handleSortingHeader(column, 'Date of creation'),
    cell: ({ row }) => {
      const { createdAt } = row.original;

      return <span>{format(createdAt, TIMESTAMP_TEMPLATE)}</span>;
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => handleSortingHeader(column, 'Last update'),
    cell: ({ row }) => {
      const { updatedAt } = row.original;

      return <span>{format(updatedAt, TIMESTAMP_TEMPLATE)}</span>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const { id, status } = row.original;

      return <ColumnActions requestId={id} status={status} />;
    },
  },
];
