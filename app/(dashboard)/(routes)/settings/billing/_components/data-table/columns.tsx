'use client';

import { Column, ColumnDef } from '@tanstack/react-table';
import { format, fromUnixTime } from 'date-fns';
import { ArrowUpDown, ReceiptText } from 'lucide-react';
import Link from 'next/link';

import { getUserBilling } from '@/actions/stripe/get-user-billing';
import { PriceColumn } from '@/components/data-table/columns/price-column';
import { Button } from '@/components/ui';
import { TIMESTAMP_TEMPLATE } from '@/constants/common';
import { DEFAULT_LOCALE } from '@/constants/locale';

const rootPageHref = '/settings/billing';

type UserBilling = Awaited<ReturnType<typeof getUserBilling>>[number];

const handleSortingHeader = <T extends Column<UserBilling, unknown>>(column: T, label: string) => {
  return (
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

export const getColumns = (t: (key: string) => string): ColumnDef<UserBilling>[] => [
  {
    id: 'course',
    header: () => <span>{t('course')}</span>,
    cell: ({ row }) => {
      const { products } = row.original;
      return products.map((product) => (
        <Link
          key={product.description}
          className="hover:underline"
          href={product.courseUrl || rootPageHref}
          target="_blank"
        >
          {product.description}
        </Link>
      ));
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => handleSortingHeader(column, t('price')),
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
    accessorKey: 'timestamp',
    header: ({ column }) => handleSortingHeader(column, t('date')),
    cell: ({ row }) => {
      const { timestamp } = row.original;

      return <span>{format(fromUnixTime(timestamp), TIMESTAMP_TEMPLATE)}</span>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const { url } = row.original;

      return (
        <>
          {url && (
            <Link href={url} target="_blank" className="hover:underline">
              <div className="flex gap-2 items-center">
                <ReceiptText className="h-4 w-4" />
                {t('view')}
              </div>
            </Link>
          )}
        </>
      );
    },
  },
];
