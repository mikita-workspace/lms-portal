'use client';

import { Column, ColumnDef } from '@tanstack/react-table';
import { format, fromUnixTime } from 'date-fns';
import { ArrowUpDown, ReceiptText } from 'lucide-react';
import Link from 'next/link';

import { getAnalytics } from '@/actions/analytics/get-analytics';
import { CreditCardInfo } from '@/components/common/credit-card-info';
import { PriceColumn } from '@/components/data-table/columns/price-column';
import { Button } from '@/components/ui';
import { TIMESTAMP_TEMPLATE } from '@/constants/common';
import { DEFAULT_LOCALE } from '@/constants/locale';

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
      const { billingDetails, paymentMethod } = row.original;

      return (
        <div className="flex flex-col text-sm">
          <p className="font-medium">{billingDetails.name}</p>
          <p>{billingDetails.email}</p>

          {paymentMethod && (
            <div className="mt-2">
              <CreditCardInfo
                brand={paymentMethod.brand}
                expMonth={paymentMethod.expMonth}
                expYear={paymentMethod.expYear}
                last4={paymentMethod.last4}
              />
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => handleSortingHeader(column, 'Price'),
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
    accessorKey: 'purchaseDate',
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

      return receiptUrl ? (
        <Link href={receiptUrl} target="_blank" className="hover:underline">
          <div className="flex gap-2 items-center">
            <ReceiptText className="h-4 w-4" />
            Receipt
          </div>
        </Link>
      ) : null;
    },
  },
];
