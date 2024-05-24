'use client';

import { User } from '@prisma/client';

import { DataTable } from '@/components/data-table/data-table';
import { DATA_TABLE_NAMES } from '@/constants/paginations';

import { columns } from './columns';

type UsersListProps = {
  users: User[];
};

export const UsersList = ({ users }: UsersListProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-xl">Users</p>
        <span className="text-xs text-muted-foreground">List of all users of the platform</span>
      </div>
      <DataTable
        columns={columns}
        data={users}
        initialPageSize={10}
        noLabel="No users"
        tableName={DATA_TABLE_NAMES.USERS_LIST}
      />
    </div>
  );
};
