'use client';

import { StripeSubscription, User, UserSettings } from '@prisma/client';
import { Column, ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';

import { TextBadge } from '@/components/common/text-badge';
import { DateColumn } from '@/components/data-table/columns/date-column';
import { Avatar, AvatarFallback, AvatarImage, Button } from '@/components/ui';
import { TIMESTAMP_EMAIL_TEMPLATE } from '@/constants/common';
import { fetcher } from '@/lib/fetcher';
import { getFallbackName } from '@/lib/utils';

import { ColumnActions } from './column-actions';

type UserWithSubscription = User & {
  settings: UserSettings | null;
  stripeSubscription: StripeSubscription | null;
};

const handleSortingHeader = <T extends Column<UserWithSubscription, unknown>>(
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

export const columns: ColumnDef<UserWithSubscription>[] = [
  {
    id: 'user',
    header: () => <span>User</span>,
    cell: ({ row }) => {
      const { email, name, pictureUrl } = row.original;

      return (
        <div className="flex items-center gap-2">
          <Avatar className="w-[40px] h-[40px] border dark:border-muted-foreground">
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
    id: 'userSubscription',
    header: () => <span>Type</span>,
    cell: ({ row }) => {
      const { stripeSubscription } = row.original;

      const isPremium = stripeSubscription?.stripeSubscriptionId;

      return (
        <TextBadge label={isPremium ? 'Premium' : 'Free'} variant={isPremium ? 'indigo' : 'lime'} />
      );
    },
  },
  {
    accessorKey: 'isPublic',
    header: ({ column }) => handleSortingHeader(column, 'Profile status'),
    cell: ({ row }) => {
      const { settings } = row.original;
      const isPublic = settings?.isPublicProfile;

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
      return <DateColumn date={row.original.createdAt} />;
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => handleSortingHeader(column, 'Last update'),
    cell: ({ row }) => {
      return <DateColumn date={row.original.updatedAt} />;
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
  {
    id: 'extraInfo',
    header: () => <span>Service info</span>,
    cell: async ({ row }) => {
      const handleGetInfo = async () => {
        try {
          const response = await fetcher.post(`/api/users/${row.original.id}/report`, {
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to generate PDF: ${response.status} ${errorText}`);
          }

          const blob = await response.blob();

          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `${row.original.email}_${format(new Date(), TIMESTAMP_EMAIL_TEMPLATE)}_report.pdf`;

          document.body.appendChild(a);
          a.click();

          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          return blob;
        } catch (error) {
          console.error('Error generating PDF:', error);
          throw error;
        }
      };

      return (
        <Button variant="outline" onClick={handleGetInfo}>
          Get
        </Button>
      );
    },
  },
];
