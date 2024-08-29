'use client';

import { Notification } from '@prisma/client';
import { useTranslations } from 'next-intl';

import { DataTable } from '@/components/data-table/data-table';

import { getColumns } from './columns';

type TableProps = { pageCount: number; userNotifications: Notification[] };

export const Table = ({ pageCount, userNotifications }: TableProps) => {
  const t = useTranslations('notifications.table-data');

  const columns = getColumns(t);

  return (
    <DataTable
      columns={columns}
      data={userNotifications}
      isNotificationPage
      noLabel={t('notFound')}
      pageCount={pageCount}
    />
  );
};
