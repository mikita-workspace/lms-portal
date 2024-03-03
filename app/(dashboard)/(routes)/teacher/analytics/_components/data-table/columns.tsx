'use client';

import { Column, ColumnDef } from '@tanstack/react-table';
import { format, fromUnixTime } from 'date-fns';
import { ArrowUpDown, ReceiptText } from 'lucide-react';
import Link from 'next/link';

import { getAnalytics } from '@/actions/db/get-analytics';
import { PriceColumn } from '@/components/data-table/price-column';
import { Button } from '@/components/ui';
import { TIMESTAMP_TEMPLATE } from '@/constants/common';
import { DEFAULT_LOCALE } from '@/constants/locale';

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

      <PriceColumn
        amount={amount}
        locale={{
          locale: DEFAULT_LOCALE,
          currency,
        }}
      />;
    },
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) => handleSortingHeader(column, 'Purchase date'),
    cell: ({ row }) => {
      const { purchaseDate } = row.original;

      return <span>{format(fromUnixTime(purchaseDate), TIMESTAMP_TEMPLATE)}</span>;
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
