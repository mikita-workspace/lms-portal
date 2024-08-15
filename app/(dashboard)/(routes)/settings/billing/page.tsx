import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getUserBilling } from '@/actions/stripe/get-user-billing';
// import { getUserSubscription } from '@/actions/stripe/get-user-subscription';
import { DataTable } from '@/components/data-table/data-table';

import { columns } from './_components/data-table/columns';

const BillingPage = async () => {
  const user = await getCurrentUser();
  const userBilling = await getUserBilling(user?.userId);
  // const userSubscription = await getUserSubscription(user?.userId, true);

  return (
    <div className="p-6 flex flex-col">
      <h1 className="text-2xl font-medium">Billing & Subscription</h1>
      <div className="mt-12">
        <DataTable
          columns={columns}
          data={userBilling}
          isServerSidePagination={false}
          noLabel="No invoices"
        />
      </div>
    </div>
  );
};

export default BillingPage;
