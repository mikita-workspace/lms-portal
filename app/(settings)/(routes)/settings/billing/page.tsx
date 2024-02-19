import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getUserBilling } from '@/actions/db/get-user-billing';

import { columns } from './_components/data-table/columns';
import { DataTable } from './_components/data-table/data-table';

const BillingPage = async () => {
  const user = await getCurrentUser();
  const userBilling = await getUserBilling(user?.userId);

  return (
    <div className="p-6 flex flex-col">
      <h1 className="text-2xl font-medium">Billing History</h1>
      <div className="mt-12">
        <DataTable columns={columns} data={userBilling} />
      </div>
    </div>
  );
};

export default BillingPage;
