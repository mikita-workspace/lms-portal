'use client';

import { Course } from '@prisma/client';
import { Column, ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil } from 'lucide-react';
import Link from 'next/link';

import { TextBadge } from '@/components/common/text-badge';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from '@/constants/locale';
import { formatPrice, getConvertedPrice } from '@/lib/format';

const handleSortingHeader = <T extends Column<Course, unknown>>(column: T, label: string) => {
  return (
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => handleSortingHeader(column, 'Title'),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => handleSortingHeader(column, 'Price'),
    cell: ({ row }) => {
      const price = getConvertedPrice(row.getValue('price') || 0);
      const formatted = formatPrice(price, { locale: DEFAULT_LOCALE, currency: DEFAULT_CURRENCY });

      return price ? formatted : <TextBadge variant="lime" label="Free" />;
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
    accessorKey: 'isPremium',
    header: ({ column }) => handleSortingHeader(column, 'Type'),
    cell: ({ row }) => {
      const isPremium = row.getValue('isPremium') || false;

      return (
        <TextBadge
          variant={isPremium ? 'indigo' : 'default'}
          label={isPremium ? 'Premium' : 'Public'}
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
