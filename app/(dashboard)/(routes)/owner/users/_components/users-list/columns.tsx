'use client';

import { User } from '@prisma/client';
import { Column, ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';

import { TextBadge } from '@/components/common/text-badge';
import { Avatar, AvatarFallback, AvatarImage, Button } from '@/components/ui';
import { TIMESTAMP_TEMPLATE } from '@/constants/common';
import { getFallbackName } from '@/lib/utils';

import { ColumnActions } from './column-actions';

const handleSortingHeader = <T extends Column<User, unknown>>(column: T, label: string) => {
  return (
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

export const columns: ColumnDef<User>[] = [
  {
    id: 'user',
    header: () => <span>User</span>,
    cell: ({ row }) => {
      const { email, name, pictureUrl } = row.original;

      return (
        <div className="flex items-center gap-2">
          <Avatar className="w-[40px] h-[40px]">
            <AvatarImage src={pictureUrl || ''} />
            <AvatarFallback>{getFallbackName(name as string)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm">
            <p className="font-medium">{name}</p>
            <p>{email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'isPublic',
    header: ({ column }) => handleSortingHeader(column, 'Profile status'),
    cell: ({ row }) => {
      const { isPublic } = row.original;

      return (
        <TextBadge
          label={isPublic ? 'Public' : 'Private'}
          variant={isPublic ? 'green' : 'default'}
        />
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => handleSortingHeader(column, 'Date of creation'),
    cell: ({ row }) => {
      const { createdAt } = row.original;

      return <span>{format(createdAt, TIMESTAMP_TEMPLATE)}</span>;
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => handleSortingHeader(column, 'Last update'),
    cell: ({ row }) => {
      const { updatedAt } = row.original;

      return <span>{format(updatedAt, TIMESTAMP_TEMPLATE)}</span>;
    },
  },
  {
    id: 'roleActions',
    header: () => <span>Change role</span>,
    cell: ({ row }) => {
      const { id, role } = row.original;

      return <ColumnActions userId={id} role={role} />;
    },
  },
];
