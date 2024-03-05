import { getStripeDetails } from '@/actions/payments/get-stripe-details';

import { StripeBalances } from './_components/stripe-balances';

const PaymentsPage = async () => {
  const { balances } = await getStripeDetails();

  return (
    <div className="p-6 flex flex-col mb-6">
      <h1 className="text-2xl font-medium">Payment Service</h1>
      <div className="mt-12">
        <StripeBalances balances={balances} />
      </div>
    </div>
  );
};

export default PaymentsPage;
