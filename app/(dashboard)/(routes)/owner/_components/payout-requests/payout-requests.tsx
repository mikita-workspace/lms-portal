'use client';

import { getStripeDetails } from '@/actions/stripe/get-stripe-details';
import { DataTable } from '@/components/data-table/data-table';

import { columns } from './columns';

type StripeDetails = Awaited<ReturnType<typeof getStripeDetails>>;

type PayoutRequestsProps = {
  payoutRequests: StripeDetails['payoutRequests'];
};

export const PayoutRequests = ({ payoutRequests }: PayoutRequestsProps) => {
  return (
    <div className="flex flex-col gap-4 mt-8">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-xl">Payout Requests</p>
        <span className="text-xs text-muted-foreground">Withdrawal requests from teachers</span>
      </div>
      <DataTable
        columns={columns}
        data={payoutRequests}
        initialPageSize={3}
        noLabel="No payout requests"
      />
    </div>
  );
};
