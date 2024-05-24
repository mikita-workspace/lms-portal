import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getUserNotifications } from '@/actions/users/get-user-notifications';
import { DataTable } from '@/components/data-table/data-table';
import { DATA_TABLE_NAMES } from '@/constants/paginations';

import { columns } from './_components/data-table/columns';

const NotificationsPage = async () => {
  const user = await getCurrentUser();
  const userNotifications = await getUserNotifications(user?.userId);

  return (
    <div className="p-6 flex flex-col">
      <h1 className="text-2xl font-medium">Notification Center</h1>
      <div className="mt-12">
        <DataTable
          columns={columns}
          data={userNotifications}
          isNotificationPage
          noLabel="No notifications"
          tableName={DATA_TABLE_NAMES.NOTIFICATIONS}
        />
      </div>
    </div>
  );
};

export default NotificationsPage;
