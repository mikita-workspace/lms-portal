'use client';

import { User } from '@prisma/client';
import { usePathname, useRouter } from 'next/navigation';
import qs from 'query-string';
import { useEffect, useState } from 'react';

import { DataTable } from '@/components/data-table/data-table';
import { isNumber } from '@/lib/guard';

import { columns } from './columns';

type UsersListProps = {
  users: User[];
};

export const UsersList = ({ users }: UsersListProps) => {
  const [isMounted, setIsMounted] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(0);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: { pageSize, page },
      },
      { skipNull: true, skipEmptyString: true },
    );

    router.push(url);
  }, [router, pathname, setPageSize, pageSize, page]);

  if (!isMounted) {
    return null;
  }

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
        setPagination={({ page, pageSize }) => {
          if (isNumber(page) && isNumber(pageSize)) {
            setPage(page);
            setPageSize(pageSize);
          }
        }}
      />
    </div>
  );
};
