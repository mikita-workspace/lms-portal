import { getStripeDetails } from '@/actions/stripe/get-stripe-details';

import { PayoutRequests } from './_components/payout-requests/payout-requests';
import { StripeBalances } from './_components/stripe-balances';

type OwnerPageProps = {
  searchParams: { pageIndex: string; pageSize: string };
};

const OwnerPage = async ({ searchParams }: OwnerPageProps) => {
  const { balances, pageCount, payoutRequests, owner } = await getStripeDetails(searchParams);

  return (
    <div className="p-6 flex flex-col mb-6">
      <h1 className="text-2xl font-medium mb-12">Payment Service</h1>
      <StripeBalances balances={balances} owner={owner} />
      <PayoutRequests pageCount={pageCount} payoutRequests={payoutRequests} />
    </div>
  );
};

export default OwnerPage;
