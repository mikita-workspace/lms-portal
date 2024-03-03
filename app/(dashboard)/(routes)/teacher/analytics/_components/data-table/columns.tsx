'use client';

import { Column, ColumnDef } from '@tanstack/react-table';
import { format, fromUnixTime } from 'date-fns';
import { ArrowUpDown, ReceiptText } from 'lucide-react';
import Link from 'next/link';

import { getAnalytics } from '@/actions/db/get-analytics';
import { TextBadge } from '@/components/common/text-badge';
import { Button } from '@/components/ui';
import { DEFAULT_LOCALE } from '@/constants/locale';
import { formatPrice, getConvertedPrice } from '@/lib/format';

const rootPageHref = '/teacher/analytics';

type ClientTransactions = Awaited<ReturnType<typeof getAnalytics>>['transactions'][number];

const handleSortingHeader = <T extends Column<ClientTransactions, unknown>>(
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

export const columns: ColumnDef<ClientTransactions>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => handleSortingHeader(column, 'Course'),
  },
  {
    id: 'customer',
    header: () => <span>Billing Details</span>,
    cell: ({ row }) => {
      const { billingDetails } = row.original;

      return (
        <div className="flex flex-col text-sm">
          <p className="font-medium">{billingDetails.name}</p>
          <p>{billingDetails.email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => handleSortingHeader(column, 'Price'),
    cell: ({ row }) => {
      const { amount, currency } = row.original;

      const formatted = formatPrice(getConvertedPrice(amount), {
        locale: DEFAULT_LOCALE,
        currency,
      });

      return amount ? formatted : <TextBadge variant="lime" label="Free" />;
    },
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) => handleSortingHeader(column, 'Purchase date'),
    cell: ({ row }) => {
      const { purchaseDate } = row.original;

      return <span>{format(fromUnixTime(purchaseDate), 'HH:mm, dd MMM yyyy')}</span>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const { receiptUrl } = row.original;

      return (
        <Link href={receiptUrl || rootPageHref} target="_blank" className="hover:underline">
          <div className="flex gap-2 items-center">
            <ReceiptText className="h-4 w-4" />
            Receipt
          </div>
        </Link>
      );
    },
  },
];
