import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/actions/auth/get-current-user';
import { getStripeInfo } from '@/actions/db/get-stripe-info';
import { isOwner } from '@/lib/owner';

import { StripeBalances } from './_components/stripe-balances';

const StripePage = async () => {
  const user = await getCurrentUser();

  if (!isOwner(user?.userId)) {
    redirect('/');
  }

  const { stripeBalances } = await getStripeInfo();

  return (
    <div className="p-6 flex flex-col mb-6">
      <h1 className="text-2xl font-medium">Stripe Settings</h1>
      <div className="mt-12">
        <StripeBalances balances={stripeBalances} />
      </div>
    </div>
  );
};

export default StripePage;
