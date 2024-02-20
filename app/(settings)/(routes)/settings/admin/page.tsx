import { getAdminInfo } from '@/actions/db/get-admin-info';

import { StripeBalances } from './_components/stripe-balances';

const AdminPage = async () => {
  const { stripeBalances, stripeTransactions } = await getAdminInfo();

  return (
    <div className="p-6 flex flex-col mb-6">
      <h1 className="text-2xl font-medium">Admin Settings</h1>
      <div className="mt-12">
        <StripeBalances balances={stripeBalances} transactions={stripeTransactions} />
      </div>
    </div>
  );
};

export default AdminPage;
