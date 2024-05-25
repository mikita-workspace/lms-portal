import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getUserNotifications } from '@/actions/users/get-user-notifications';
import { DataTable } from '@/components/data-table/data-table';

import { columns } from './_components/data-table/columns';

type NotificationsPageProps = {
  searchParams: { pageIndex: string; pageSize: string };
};

const NotificationsPage = async ({ searchParams }: NotificationsPageProps) => {
  const user = await getCurrentUser();
  const { notifications: userNotifications, pageCount } = await getUserNotifications({
    userId: user?.userId,
    ...searchParams,
  });

  return (
    <div className="p-6 flex flex-col">
      <h1 className="text-2xl font-medium">Notification Center</h1>
      <div className="mt-12">
        <DataTable
          columns={columns}
          data={userNotifications}
          isNotificationPage
          noLabel="No notifications"
          pageCount={pageCount}
        />
      </div>
    </div>
  );
};

export default NotificationsPage;
