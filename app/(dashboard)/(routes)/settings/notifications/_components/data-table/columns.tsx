'use client';

import { Column, ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';
import * as React from 'react';

import { getUserNotifications } from '@/actions/users/get-user-notifications';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TIMESTAMP_TEMPLATE } from '@/constants/common';
import { cn } from '@/lib/utils';

import { ColumnActions } from './column-actions';

type UserNotification = Awaited<ReturnType<typeof getUserNotifications>>['notifications'][number];

const handleSortingHeader = <T extends Column<UserNotification, unknown>>(
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

export const getColumns = (t: (key: string) => string): ColumnDef<UserNotification>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: t('title'),
    cell: ({ row }) => {
      const { title, isRead } = row.original;

      return (
        <div className={cn('font-medium', isRead ? 'text-muted-foreground' : '')}>
          {' '}
          {!isRead && <div className="bg-green-500 rounded-full w-2 h-2 inline-block mr-1"></div>}
          {title}
        </div>
      );
    },
  },
  {
    header: t('notification'),
    cell: ({ row }) => {
      const { body, isRead } = row.original;

      return <div className={cn(isRead ? 'text-muted-foreground' : '')}>{body}</div>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => handleSortingHeader(column, t('date')),
    cell: ({ row }) => {
      const { createdAt } = row.original;

      return <span>{format(createdAt, TIMESTAMP_TEMPLATE)}</span>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const { id, isRead, userId } = row.original;

      return <ColumnActions id={id} isRead={isRead} userId={userId} />;
    },
  },
];
