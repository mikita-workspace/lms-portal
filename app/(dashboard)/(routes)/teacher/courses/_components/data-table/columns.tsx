'use client';

import { Course } from '@prisma/client';
import { Column, ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil } from 'lucide-react';
import Link from 'next/link';

import {
  Badge,
  Button,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import { DropdownMenu } from '@/components/ui';
import { Currency, Locale } from '@/constants/locale';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';

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
      const price = parseFloat(row.getValue('price') || '0');
      const formatted = formatPrice(price, { locale: Locale.EN_US, currency: Currency.USD });

      return price ? (
        formatted
      ) : (
        <Badge
          variant="outline"
          className="bg-green-600/30 text-green-800 dark:text-neutral-100 border-none mt-2"
        >
          Free
        </Badge>
      );
    },
  },
  {
    accessorKey: 'isPublished',
    header: ({ column }) => handleSortingHeader(column, 'Published'),
    cell: ({ row }) => {
      const isPublished = row.getValue('isPublished') || false;

      return (
        <Badge
          className={cn(
            'bg-neutral-600/30 text-neutral-800 dark:text-neutral-100 border-none',
            isPublished && 'bg-violet-700 text-neutral-100',
          )}
          variant="outline"
        >
          {isPublished ? 'Published' : 'Draft'}
        </Badge>
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
