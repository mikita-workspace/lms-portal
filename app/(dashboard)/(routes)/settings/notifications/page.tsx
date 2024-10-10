import { getTranslations } from 'next-intl/server';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getUserNotifications } from '@/actions/users/get-user-notifications';

import { Table } from './_components/data-table/table';

type NotificationsPageProps = {
  searchParams: { pageIndex: string; pageSize: string; search?: string };
};

const NotificationsPage = async ({ searchParams }: NotificationsPageProps) => {
  const t = await getTranslations('notifications');

  const user = await getCurrentUser();
  const { notifications: userNotifications, pageCount } = await getUserNotifications({
    userId: user?.userId,
    ...searchParams,
  });

  return (
    <div className="p-6 flex flex-col">
      <h1 className="text-2xl font-medium">{t('notificationCenter')}</h1>
      <div className="mt-12">
        <Table pageCount={pageCount} userNotifications={userNotifications} />
      </div>
    </div>
  );
};

export default NotificationsPage;
