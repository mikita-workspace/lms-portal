import { getStripeDetails } from '@/actions/stripe/get-stripe-details';

import { PayoutRequests } from './_components/payout-requests/payout-requests';
import { StripeBalances } from './_components/stripe-balances';

const OwnerPage = async () => {
  const { balances, payoutRequests, owner } = await getStripeDetails();

  return (
    <div className="p-6 flex flex-col mb-6">
      <h1 className="text-2xl font-medium mb-12">Payment Service</h1>
      <StripeBalances balances={balances} owner={owner} />
      <PayoutRequests payoutRequests={payoutRequests} />
    </div>
  );
};

export default OwnerPage;
