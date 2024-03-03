'use client';

import { Column, ColumnDef } from '@tanstack/react-table';
import { format, fromUnixTime } from 'date-fns';
import { ArrowUpDown, ReceiptText } from 'lucide-react';
import Link from 'next/link';

import { getUserBilling } from '@/actions/db/get-user-billing';
import { TextBadge } from '@/components/common/text-badge';
import { Button } from '@/components/ui';
import { DEFAULT_LOCALE } from '@/constants/locale';
import { formatPrice, getConvertedPrice } from '@/lib/format';

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

export const columns: ColumnDef<UserBilling>[] = [
  {
    id: 'course',
    header: () => <span>Course</span>,
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
    id: 'customer',
    header: () => <span>Billing Details</span>,
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
      const { timestamp } = row.original;

      return <span>{format(fromUnixTime(timestamp), 'HH:mm, dd MMM yyyy')}</span>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const { url } = row.original;

      return (
        <Link href={url || rootPageHref} target="_blank" className="hover:underline">
          <div className="flex gap-2 items-center">
            <ReceiptText className="h-4 w-4" />
            Receipt
          </div>
        </Link>
      );
    },
  },
];
