import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getUserBilling } from '@/actions/stripe/get-user-billing';
import { DataTable } from '@/components/data-table/data-table';
import { DATA_TABLE_NAMES } from '@/constants/paginations';

import { columns } from './_components/data-table/columns';

const BillingPage = async () => {
  const user = await getCurrentUser();
  const userBilling = await getUserBilling(user?.userId);

  return (
    <div className="p-6 flex flex-col">
      <h1 className="text-2xl font-medium">Billing History</h1>
      <div className="mt-12">
        <DataTable
          columns={columns}
          data={userBilling}
          noLabel="No invoices"
          tableName={DATA_TABLE_NAMES.INVOICES}
        />
      </div>
    </div>
  );
};

export default BillingPage;
