'use client';

import { Course, Price } from '@prisma/client';
import { Column, ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil } from 'lucide-react';
import Link from 'next/link';

import { TextBadge } from '@/components/common/text-badge';
import {
  Button,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import { DropdownMenu } from '@/components/ui';
import { locales } from '@/constants/locale';
import { formatPrice } from '@/lib/format';

const handleSortingHeader = <T extends Column<Course & { price: Price | null }, unknown>>(
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

export const columns: ColumnDef<Course & { price: Price | null }>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => handleSortingHeader(column, 'Title'),
  },
  {
    id: 'prices',
    header: () => <span>Prices</span>,
    cell: ({ row }) => {
      const { price: prices } = row.original;

      return (
        <span>
          {locales
            .map((locale) => {
              const currency = locale.currency.toLowerCase() as keyof Price;

              return formatPrice(prices ? (prices[currency] as number) : 0, locale);
            })
            .join(' / ')}
        </span>
      );
    },
  },
  {
    accessorKey: 'isPublished',
    header: ({ column }) => handleSortingHeader(column, 'Published'),
    cell: ({ row }) => {
      const isPublished = row.getValue('isPublished') || false;

      return (
        <TextBadge
          variant={isPublished ? 'yellow' : 'default'}
          label={isPublished ? 'Published' : 'Draft'}
        />
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-4 w-8 p-0" variant="ghost">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/teacher/courses/${id}`}>
              <DropdownMenuItem className="hover:cursor-pointer">
                <Pencil className="h-4 w-4  mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
