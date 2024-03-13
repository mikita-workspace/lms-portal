'use client';

import { Column, ColumnDef } from '@tanstack/react-table';
import { fromUnixTime } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';

import { getStripePromo } from '@/actions/stripe/get-stripe-promo';
import { CopyClipboard } from '@/components/common/copy-clipboard';
import { TextBadge } from '@/components/common/text-badge';
import { DateColumn } from '@/components/data-table/columns/date-column';
import { Button } from '@/components/ui';

import { ColumnActions } from './column-actions';

type Promo = Awaited<ReturnType<typeof getStripePromo>>['promos'][number];

const handleSortingHeader = <T extends Column<Promo, unknown>>(column: T, label: string) => {
  return (
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

export const columns: ColumnDef<Promo>[] = [
  {
    accessorKey: 'code',
    id: 'title',
    header: ({ column }) => handleSortingHeader(column, 'Promotion code'),
    cell: ({ row }) => {
      return (
        <div className="font-medium flex gap-2 items-center">
          <span>{row.original.code}</span>
          <CopyClipboard textToCopy={row.original.code} />
        </div>
      );
    },
  },
  {
    accessorKey: 'created',
    header: ({ column }) => handleSortingHeader(column, 'Date of creation'),
    cell: ({ row }) => {
      return <DateColumn date={fromUnixTime(row.original.created)} />;
    },
  },
  {
    id: 'status',
    header: () => <span>Status</span>,
    cell: ({ row }) => {
      const variant = row.original.active ? 'green' : 'red';
      const label = row.original.active ? 'Active' : 'Inactive';

      return <TextBadge variant={variant} label={label} />;
    },
  },
  {
    id: 'coupon',
    header: () => <span>Coupon</span>,
    cell: ({ row }) => {
      return (
        <div className="flex flex-col text-sm">
          <p className="font-medium">{row.original.coupon.name}</p>
          <p className="text-muted-foreground">{row.original.coupon.description}</p>
        </div>
      );
    },
  },
  {
    id: 'customer',
    header: () => <span>Customer</span>,
    cell: ({ row }) => {
      return row.original.customer?.name ? (
        <div className="flex flex-col text-sm">
          <p className="font-medium">{row.original.customer.name}</p>
          {row.original.customer.email && (
            <p className="text-muted-foreground">{row.original.customer.email}</p>
          )}
        </div>
      ) : (
        <p className="text-center">&#8212;</p>
      );
    },
  },
  {
    id: 'restrictions',
    header: () => <span>Restrictions</span>,
    cell: ({ row }) => {
      return row.original.restrictions ? (
        <p>{row.original.restrictions}</p>
      ) : (
        <p className="text-center">&#8212;</p>
      );
    },
  },
  {
    id: 'redemptions',
    header: () => <span>Redemptions</span>,
    cell: ({ row }) => {
      return (
        <p>
          {row.original.timesRedeemed}/{row.original.maxRedemptions}
        </p>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const { id } = row.original;

      return <ColumnActions promoId={id} />;
    },
  },
];
